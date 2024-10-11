# Application Web des Unités Mobiles Médicales et Administratives

Ce projet est une application web qui connecte le personnel médical et administratif avec des personnes vivant dans des zones de désert médical ou à faible densité médicale. Grâce à une carte interactive, les utilisateurs peuvent localiser les unités mobiles à proximité, effectuer des réservations, et recevoir des notifications concernant les passages futurs.

## Fonctionnalités

- **Carte interactive** : Affichage en temps réel des unités mobiles médicales et administratives.
- **Notifications par email** : Les utilisateurs reçoivent des notifications par email lorsque des unités mobiles sont proches de leur localisation.
- **Réservation de créneaux médicaux** : Les utilisateurs peuvent réserver des créneaux horaires directement sur la carte.
- **Suivi des véhicules en temps réel** : Possibilité de suivre les unités mobiles en temps réel et d'être notifié lors de leur passage.
- **Authentification & gestion des rôles** : Connexion sécurisée avec des politiques de mot de passe robustes et authentification multi-facteurs (MFA). Les rôles sont définis pour les utilisateurs, les professionnels et les administrateurs.
- **Alertes par email** : Notification des utilisateurs dans un rayon de 15 km lorsqu'une nouvelle réservation est effectuée.

## Technologies Utilisées

- **Frontend** : React, TypeScript, Tailwind CSS
- **Backend** : Node.js, Express.js
- **Base de données** : MariaDB pour stocker les données des utilisateurs, des réservations et des unités mobiles.
- **API Google Maps** : Intégration pour l'affichage de la carte et la gestion de la géolocalisation.
- **Sécurité** :
  - Hachage des mots de passe avec bcrypt
  - Gestion des sessions via JWT
  - HTTPS pour sécuriser les échanges de données
  - Limitation des tentatives de connexion via `express-rate-limit`
- **Notifications Email** : Utilisation de l'API Mailtrap pour envoyer des emails de réservation.
  
## Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/ton-utilisateur/ton-repo.git
   cd ton-repo

2. Installer les dépendances :
  ```bash
  npm install
```

3. Configurer les variables d'environnement dans un fichier .env :
```react
  DB_HOST=ton-hote-bdd
  DB_USER=ton-utilisateur-bdd
  DB_PASSWORD=ton-mot-de-passe-bdd
  DB_NAME=ton-nom-bdd
  JWT_SECRET=ton-secret-jwt
  MAILTRAP_API_KEY=ta-cle-api-mailtrap
  GOOGLE_MAPS_API_KEY=ta-cle-api-google-maps
```

4. Lancer l'application :
  ```bash
  npm run dev
  ```
