-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : ven. 11 oct. 2024 à 09:43
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
  `longitude` float NOT NULL,
  `id_soignant` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `services`
--

INSERT INTO `services` (`id`, `nom`, `type`, `latitude`, `longitude`, `id_soignant`) VALUES
(1, 'Mobile Clinic', 'medical', 48.8566, 2.3522, NULL),
(2, 'Admin Vehicle', 'administrative', 48.8584, 2.354, NULL),
(3, 'Ambulance', 'medical', 48.86, 2.35, NULL),
(4, 'Medical Unit - Lozère', 'medical', 44.5143, 3.4994, NULL),
(5, 'Medical Unit - Cantal', 'medical', 45.0272, 2.6815, NULL),
(6, 'Medical Unit - Creuse', 'medical', 46.0897, 2.2005, NULL),
(7, 'Medical Unit - Nièvre', 'medical', 47.0521, 3.1365, NULL),
(8, 'Medical Unit - Aveyron', 'medical', 44.3584, 2.5705, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user_info`
--

CREATE TABLE `user_info` (
  `id` int(11) NOT NULL,
  `medecin` tinyint(1) NOT NULL DEFAULT '0',
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

INSERT INTO `user_info` (`id`, `medecin`, `nom`, `prenom`, `age`, `email`, `password`, `telephone`, `adresse`) VALUES
(1, 0, 'test', 'test', 12, 'test@test.com', '$2b$10$CUzqoH/YBVJhBvBfSBdejOibMc2taltql6rR3mHV4TpkaTAx9beSW', '0606060606', 'test'),
(2, 0, 'test2', 'test2', 13, 'test2@test2.com', '$2b$10$uF3L.cKJDqt283EAwsByS.p7EcFU01N0HnBGyxIWX.6mekXDCK7xC', '0707070707', 'test2'),
(3, 1, 'Mr', 'Mr', 52, 'mr@mr.com', '$2b$10$WvOKDYofxycwy6TgRSV9NuMEXgT0Z9EytoLvdFrBUPrExINT3w15u', '0000000000', 'vehicule'),
(4, 0, 'poizat', 'maxence', 21, 'maxoupoizat@gmail.com', '$2b$10$y.MTF0vt4SJ0pwWNeLX6aeEVtV00KtbHWQEmzL/6dBjeh49UxXL/W', '0000000000', '139 rue de la croix des rosiers, Montpellier'),
(5, 0, 'poizat', 'maxence', 21, 'test1@test.com', '$2b$10$PP7g7bjI0QAL13tc8SaXCu.tXwcB3YXRfwq8iwTY6N3nrQrKNicIy', '0000000', 'France');

-- --------------------------------------------------------

--
-- Structure de la table `user_reservations`
--

CREATE TABLE `user_reservations` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `id_user` int(11) NOT NULL,
  `date` date NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `user_reservations`
--

INSERT INTO `user_reservations` (`id`, `nom`, `id_user`, `date`, `latitude`, `longitude`) VALUES
(1, 'Campagne Vaccination', 3, '2024-10-08', 45.2741, 0.646879),
(2, 'Tests PCR', 3, '2024-10-08', 45.5252, 1.73269),
(3, 'Dépistage cancer', 3, '2024-10-08', 45.4396, 0.110112),
(4, 'Aide à domicile', 3, '2024-10-25', 47.8979, 1.90773),
(5, 'Aide administrative', 3, '2024-10-14', 46.8019, 4.02509),
(6, 'Radio à domicile', 3, '2024-10-11', 43.6112, 3.82873),
(7, 'test', 3, '2024-10-18', 43.6107, 3.83123),
(8, 'test2', 3, '2024-10-24', 43.611, 3.83028),
(9, '', 3, '2024-10-23', 43.6111, 3.82955),
(10, 'testtest', 3, '2024-10-17', 43.6106, 3.83171),
(11, 'email', 3, '2024-10-17', 43.6105, 3.83219),
(12, 'test', 3, '2024-10-22', 43.611, 3.83078),
(13, 'test', 3, '2024-10-23', 43.6107, 3.83079),
(14, 'Vaccination', 3, '2024-10-15', 45.5472, 2.31165);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_service_soignant` (`id_soignant`);

--
-- Index pour la table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user_reservations`
--
ALTER TABLE `user_reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_patient` (`id_user`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `user_reservations`
--
ALTER TABLE `user_reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `fk_service_soignant` FOREIGN KEY (`id_soignant`) REFERENCES `user_info` (`id`);

--
-- Contraintes pour la table `user_reservations`
--
ALTER TABLE `user_reservations`
  ADD CONSTRAINT `fk_patient` FOREIGN KEY (`id_user`) REFERENCES `user_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
