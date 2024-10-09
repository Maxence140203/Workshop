-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mer. 09 oct. 2024 à 14:48
-- Version du serveur : 5.7.24
-- Version de PHP : 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `utilisateurs`
--

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `type` varchar(25) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `services`
--

INSERT INTO `services` (`id`, `nom`, `type`, `latitude`, `longitude`) VALUES
(1, 'Mobile Clinic', 'medical', 48.8566, 2.3522),
(2, 'Admin Vehicle', 'administrative', 48.8584, 2.354),
(3, 'Ambulance', 'medical', 48.86, 2.35),
(4, 'Medical Unit - Lozère', 'medical', 44.5143, 3.4994),
(5, 'Medical Unit - Cantal', 'medical', 45.0272, 2.6815),
(6, 'Medical Unit - Creuse', 'medical', 46.0897, 2.2005),
(7, 'Medical Unit - Nièvre', 'medical', 47.0521, 3.1365),
(8, 'Medical Unit - Aveyron', 'medical', 44.3584, 2.5705);

-- --------------------------------------------------------

--
-- Structure de la table `user_info`
--

CREATE TABLE `user_info` (
  `id` int(11) NOT NULL,
  `nom` varchar(20) NOT NULL,
  `prenom` varchar(20) NOT NULL,
  `age` int(150) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `telephone` varchar(10) NOT NULL,
  `adresse` varchar(75) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `user_info`
--

INSERT INTO `user_info` (`id`, `nom`, `prenom`, `age`, `email`, `password`, `telephone`, `adresse`) VALUES
(1, 'test', 'test', 12, 'test@test.com', '$2b$10$CUzqoH/YBVJhBvBfSBdejOibMc2taltql6rR3mHV4TpkaTAx9beSW', '0606060606', 'test'),
(2, 'test2', 'test2', 13, 'test2@test2.com', '$2b$10$uF3L.cKJDqt283EAwsByS.p7EcFU01N0HnBGyxIWX.6mekXDCK7xC', '0707070707', 'test2');

-- --------------------------------------------------------

--
-- Structure de la table `user_reservations`
--

CREATE TABLE `user_reservations` (
  `id_patient` int(11) NOT NULL,
  `id_soignant` int(11) NOT NULL,
  `date` date NOT NULL,
  `lieu` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
