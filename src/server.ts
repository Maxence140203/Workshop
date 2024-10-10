import express, { Request, Response, NextFunction } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import axios from 'axios';

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // Limit each IP to 5 requests per minute
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer après une minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

const JWT_SECRET = 'your_secret_key';
const JWT_EXPIRES_IN = '15m';

const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'utilisateurs',
  port: 3306,
};

// Google Geocoding API key
const GOOGLE_API_KEY = 'AIzaSyCQLhFSq03QDVmUeyIVpTSV2KB93LJgioc';

// Route d'enregistrement
app.post('/api/register', async (req: Request, res: Response): Promise<void> => {
  const { nom, prenom, age, email, password, telephone, adresse } = req.body;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [existingUser] = await connection.execute<any[]>('SELECT * FROM user_info WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      res.status(400).json({ success: false, message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.execute('INSERT INTO user_info (nom, prenom, age, email, password, telephone, adresse) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, age, email, hashedPassword, telephone, adresse]);

    connection.end();
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.post('/api/register_medecin', async (req: Request, res: Response): Promise<void> => {
  const { nom, prenom, age, email, password, telephone, adresse } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [existingUser] = await connection.execute<any[]>('SELECT * FROM user_info WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      res.status(400).json({ success: false, message: 'Médecin déjà existant' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.execute('INSERT INTO user_info (nom, prenom, age, email, password, telephone, adresse, medecin) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
      [nom, prenom, age, email, hashedPassword, telephone, adresse]);

    connection.end();
    res.json({ success: true, message: 'Médecin enregistré avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur de base de données' });
  }
});

// Login Route with rate limiting
app.post('/api/login', loginLimiter, async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute<any[]>('SELECT * FROM user_info WHERE email = ?', [email]);

    if (rows.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        medecin: user.medecin,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
    });

    connection.end();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Middleware to verify JWT token
const authenticateJWT = (req: Request & { user?: any }, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ success: false, message: 'Token is not valid or expired' });
      return;
    }

    req.user = user;
    next();
  });
};

// Geocode address using Google API
// Geocode address using Google API
const getCoordinatesFromAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address,
        key: GOOGLE_API_KEY,
      },
    });

    if (response.data.status === 'OK') {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } else if (response.data.status === 'ZERO_RESULTS') {
      throw new Error(`No results found for address: ${address}`);
    } else {
      throw new Error(`Geocoding API error: ${response.data.status}`);
    }
  } catch (error) {
    console.error(`Failed to get coordinates for address ${address}:`, error);
    throw error;
  }
};


// Haversine formula to calculate distance between two coordinates in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

import { MailtrapClient } from 'mailtrap';

const TOKEN = '3e9c0b87122996f75c5745e6e8e52d95'; // Your Mailtrap token
const testInboxId = 3199920; // Your Mailtrap inbox ID

const client = new MailtrapClient({
  token: TOKEN,
  testInboxId: testInboxId,
});

// Function to send email to users
const sendEmail = async (recipientEmails: string[], reservationDetails: { date: string; address: string }) => {
  console.log('Preparing to send email to:', recipientEmails);

  const sender = {
    email: 'your_email@example.com', // Replace with your sender email
    name: 'Your App Name',
  };

  const recipients = recipientEmails.map((email) => ({
    email: email,
  }));

  try {
    const response = await client.testing.send({
      from: sender,
      to: recipients,
      subject: 'Nouvelle réservation près de chez vous',
      text: `Une nouvelle réservation a été créée près de votre emplacement.\n\nDétails :\nDate : ${reservationDetails.date}\nLocalisation : ${reservationDetails.address}`,
      category: 'Reservation Notification',
    });
    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error || error);
  }
};





// Route for creating a reservation
app.post('/api/reservations', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  const { id_user, latitude, longitude, date, nom } = req.body; // Reservation data

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Insert the reservation into the database
    await connection.execute(
      'INSERT INTO user_reservations (id_user, date, latitude, longitude, nom) VALUES (?, ?, ?, ?, ?)',
      [id_user, date, latitude, longitude, nom]
    );

    // Fetch all users with their addresses
    const [users] = await connection.execute<any[]>(
      'SELECT id, email, adresse FROM user_info'
    );

    // Find users within 15 km
    const nearbyUsers = [];
    for (const user of users) {
      try {
        const { lat: userLat, lng: userLng } = await getCoordinatesFromAddress(user.adresse);
        const distance = calculateDistance(latitude, longitude, userLat, userLng);
        if (distance <= 15) {
          nearbyUsers.push(user);
        }
      } catch (error) {
        console.error(`Failed to get coordinates for user with address ${user.adresse}:`, error);
      }
    }

    // Send email to users within 15 km
    if (nearbyUsers.length > 0) {
      const recipientEmails = nearbyUsers.map(user => user.email);
      const address = `${latitude}, ${longitude}`; // Replace this with actual address if needed
      await sendEmail(recipientEmails, { date, address });
    }

    res.json({ success: true, message: 'Réservation créée avec succès' });
    connection.end();
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la création de la réservation' });
  }
});

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

// Route 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(3001, '0.0.0.0', () => {
  console.log('Server is running on port 3001');
});
