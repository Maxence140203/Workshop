import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use(cors());

// Forcer le typage à "any"
const postRequest: any = express.request;
const postResponse: any = express.response;

const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'utilisateurs',
  port: 3306,
};

// Route d'enregistrement
app.post('/register', async (req: typeof postRequest, res: typeof postResponse) => {
  const { nom, prenom, age, email, password, telephone, adresse } = req.body;

  try {
    console.log('Données reçues:', { nom, prenom, age, email, password, telephone, adresse }); // Log des données reçues

    const connection = await mysql.createConnection(dbConfig);
    
    // Log avant la requête de vérification
    console.log('Connexion à la base de données réussie');

    const [existingUser] = await connection.execute<any[]>(
      'SELECT * FROM user_info WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      console.log('Utilisateur existant trouvé'); // Log si l'utilisateur existe
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Mot de passe haché:', hashedPassword); // Log après hachage

    await connection.execute(
      'INSERT INTO user_info (nom, prenom, age, email, password, telephone, adresse) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, age, email, hashedPassword, telephone, adresse]
    );

    connection.end();
    console.log('Utilisateur enregistré avec succès'); // Log si tout est réussi
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error); // Log de l'erreur
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Route de connexion
app.post('/login', async (req: typeof postRequest, res: typeof postResponse) => {
  const { email, password } = req.body;

  try {
    console.log('Données de connexion reçues:', { email, password }); // Log des données reçues

    const connection = await mysql.createConnection(dbConfig);

    // Log avant la requête de vérification
    console.log('Connexion à la base de données réussie');

    const [rows] = await connection.execute<any[]>(
      'SELECT * FROM user_info WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      console.log('Aucun utilisateur trouvé avec cet email'); // Log si aucun utilisateur n'est trouvé
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = rows[0];
    console.log('Utilisateur trouvé:', user); // Log les informations de l'utilisateur trouvé

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Résultat de la comparaison des mots de passe:', passwordMatch); // Log le résultat de la comparaison de mot de passe

    if (!passwordMatch) {
      console.log('Mot de passe incorrect'); // Log si le mot de passe ne correspond pas
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Log si tout est réussi
    console.log('Connexion réussie pour l\'utilisateur:', user.email);

    res.json({
      success: true,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        age: user.age,
        email: user.email,
        telephone: user.telephone,
        adresse: user.adresse,
      },
    });
    connection.end();
    console.log('Connexion à la base de données fermée'); // Log lorsque la connexion est fermée
  } catch (error) {
    console.error('Erreur lors de la connexion:', error); // Log de l'erreur
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Route de profil
app.get('/profile', async (req: typeof postRequest, res: typeof postResponse) => {
  const { email } = req.query;
  console.log('Profile');
  try {
    console.log('Email reçu pour la recherche de profil:', email);

    const connection = await mysql.createConnection(dbConfig);
    console.log('Connexion à la base de données réussie');

    // Récupération des informations de l'utilisateur
    const [rows] = await connection.execute<any[]>(
      'SELECT * FROM user_info WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      console.log('Aucun utilisateur trouvé');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    console.log('Utilisateur trouvé:', user);

    // Récupération des réservations
    const [reservations] = await connection.execute<any[]>(
      'SELECT * FROM user_reservations WHERE id_patient = ?',
      [user.id]
    );

    // Si aucune réservation n'est trouvée, renvoyer un tableau vide
    const userReservations = reservations.length > 0 ? reservations : [];
    console.log('Réservations trouvées ou tableau vide:', userReservations);

    // Réponse JSON avec un tableau vide s'il n'y a pas de réservations
    res.json({
      success: true,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        age: user.age,
        email: user.email,
        telephone: user.telephone,
        adresse: user.adresse,
        reservations: userReservations,  // ou un tableau vide s'il n'y a pas de réservations
      },
    });    

    console.log('Réponse JSON envoyée');
    connection.end();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erreur lors de la recherche de profil:', error.message);
      res.status(500).json({ success: false, message: 'Database error', error: error.message });
    } else {
      console.error('Erreur inconnue:', error);
      res.status(500).json({ success: false, message: 'Unknown error' });
    }
  }
});

// Démarrer le serveur
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
