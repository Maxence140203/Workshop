import express, { Request, Response, NextFunction } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

// Define rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // Limit each IP to 5 login attempts per `window` (1 minute)
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer après une minute',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Autorise uniquement votre frontend
  credentials: true, // Si vous utilisez des cookies
}));

const JWT_SECRET = 'your_secret_key'; // Replace with a strong secret key
const JWT_EXPIRES_IN = '15m';         // Token expires in 15 minutes

const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'utilisateurs',
  port: 3306,
};

// Route d'enregistrement
app.post('/api/register', async (req: Request, res: Response): Promise<void> => {
  const { nom, prenom, age, email, password, telephone, adresse } = req.body;

  try {
    console.log('Données reçues:', { nom, prenom, age, email, password, telephone, adresse });

    const connection = await mysql.createConnection(dbConfig);
    console.log('Connexion à la base de données réussie');

    const [existingUser] = await connection.execute<any[]>(
      'SELECT * FROM user_info WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      console.log('Utilisateur existant trouvé');
      res.status(400).json({ success: false, message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Mot de passe haché:', hashedPassword);

    await connection.execute(
      'INSERT INTO user_info (nom, prenom, age, email, password, telephone, adresse) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, age, email, hashedPassword, telephone, adresse]
    );

    connection.end();
    console.log('Utilisateur enregistré avec succès');
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.post('/api/register_medecin', async (req: Request, res: Response): Promise<void> => {
  const { nom, prenom, age, email, password, telephone, adresse } = req.body;

  try {
    console.log('Données reçues pour inscription médecin:', { nom, prenom, age, email, password, telephone, adresse });

    const connection = await mysql.createConnection(dbConfig);
    console.log('Connexion à la base de données réussie');

    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await connection.execute<any[]>(
      'SELECT * FROM user_info WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      console.log('Médecin existant trouvé');
      res.status(400).json({ success: false, message: 'Médecin déjà existant' });
      return;
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Mot de passe haché:', hashedPassword);

    // Insérer les données du médecin avec l'indicateur "médecin"
    await connection.execute(
      'INSERT INTO user_info (nom, prenom, age, email, password, telephone, adresse, medecin) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
      [nom, prenom, age, email, hashedPassword, telephone, adresse]
    );

    connection.end();
    console.log('Médecin enregistré avec succès');
    res.json({ success: true, message: 'Médecin enregistré avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du médecin:', error);
    res.status(500).json({ success: false, message: 'Erreur de base de données' });
  }
});


// Apply the rate limiter middleware to the login route
app.post('/api/login', loginLimiter, async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    console.log('Données de connexion reçues:', { email, password });

    const connection = await mysql.createConnection(dbConfig);
    console.log('Connexion à la base de données réussie');

    const [rows] = await connection.execute<any[]>(
      'SELECT * FROM user_info WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      console.log('Aucun utilisateur trouvé avec cet email');
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const user = rows[0];
    console.log('Utilisateur trouvé:', user);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Mot de passe incorrect');
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        medecin: user.medecin,  // Ajout de l'indicateur "médecin"
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log('JWT généré:', token);  // Log le token généré

    res.json({
      success: true,
      message: 'Login successful',
      token,  // Le token JWT est envoyé au client
    });

    connection.end();
    console.log('Connexion fermée avec succès');
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});




// Middleware to verify JWT token
const authenticateJWT = (req: Request & { user?: any }, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ success: false, message: 'Token is not valid or expired' });
      return;
    }

    req.user = user;  // Store user info from token in request object
    next();
  });
};

// Route de profil (protected)
app.get('/api/profile', authenticateJWT, async (req: Request & { user?: any }, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  jwt.verify(token, JWT_SECRET, async (err, decodedUser) => {
    if (err) {
      res.status(403).json({ success: false, message: 'Invalid token' });
      return;
    }

    req.user = decodedUser;  // Store user info from token in request object

    try {
      const { id } = req.user;  // Get user ID from decoded token

      const connection = await mysql.createConnection(dbConfig);
      console.log('Database connection successful.');

      const [rows] = await connection.execute<any[]>(
        'SELECT * FROM user_info WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        console.log('No user found with the provided ID.');
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const user = rows[0];
      console.log('User found:', user);

      const [reservations] = await connection.execute<any[]>(
        'SELECT * FROM user_reservations WHERE id_user = ?',
        [user.id]
      );

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
          medecin: user.medecin,  // Ajout de la propriété medecin
          reservations: reservations.length ? reservations : [],
        },
      });      

      connection.end();
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ success: false, message: 'Database error' });
    }
  });
});

app.get('/api/services', async (req: Request, res: Response) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute<any[]>(
      'SELECT id, latitude, longitude, date, nom FROM user_reservations'
    );
    connection.end();

    // Envoyer les données sous la forme d'une réponse JSON avec la nouvelle colonne 'nom'
    res.json({ success: true, services: rows });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});



app.post('/api/reservations', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  const { id_user, latitude, longitude, date, nom } = req.body;  // Ajout du champ nom

  console.log('Début de la création de la réservation...');
  console.log('Données reçues :', { id_user, latitude, longitude, date, nom });

  try {
    // Connexion à la base de données
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connexion à la base de données réussie.');

    // Exécution de la requête d'insertion avec le champ nom
    const [result] = await connection.execute(
      'INSERT INTO user_reservations (id_user, date, latitude, longitude, nom) VALUES (?, ?, ?, ?, ?)',
      [id_user, date, latitude, longitude, nom]  // Ajout de la colonne 'nom'
    );
    console.log('Réservation insérée dans la base de données, résultat :', result);

    // Fermeture de la connexion
    connection.end();
    console.log('Connexion à la base de données fermée.');

    // Réponse réussie
    res.json({ success: true, message: 'Réservation créée avec succès' });
    console.log('Réponse envoyée avec succès.');
  } catch (error) {
    // Gestion d'erreur
    console.error('Erreur lors de la création de la réservation :', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de la réservation' });
  }
});



// Route 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(3001, '0.0.0.0', () => {
  console.log('Server is running on port 3001');
});
