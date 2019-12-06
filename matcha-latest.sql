-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Nov 22, 2019 at 03:12 PM
-- Server version: 5.7.28
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `matcha`
--

DELIMITER $$
--
-- Functions
--
CREATE DEFINER=`root`@`%` FUNCTION `f_fameRating` (`userId` INT) RETURNS INT(11) BEGIN
	DECLARE rating INT;

	SELECT COUNT(*) INTO @matchesCount FROM `matches` WHERE userId IN (`user_one`, `user_two`);
	SELECT COUNT(*) INTO @likesCount FROM `likes` WHERE `user_likes` = userId;
	SELECT COUNT(*) INTO @likedCount FROM `likes` WHERE `user_liked` = userId;
	SET rating = 0;

	IF @matchesCount >= 10 THEN
		SET rating = rating + 1;
	END IF;
	IF @likesCount >= 20 THEN
		SET rating = rating + 1;
	END IF;
	IF @likedCount >= 20 THEN
		SET rating = rating + 1;
	END IF;
    IF rating = 3 THEN
		SET rating = rating + 1;
	END IF;
	RETURN rating;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `blocks`
--

CREATE TABLE `blocks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `blocked_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `blocks`
--

INSERT INTO `blocks` (`id`, `user_id`, `blocked_id`) VALUES
(2, 20, 20),
(6, 20, 45),
(8, 20, 45),
(9, 20, 40);

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `image` varchar(800) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `user_id`, `image`) VALUES
(115, 21, '7cca6ada-85ca-4edb-b9ba-9b9f345ed271-1574179734501.jpeg'),
(116, 21, '5a3ef0c7-7b5b-4f7d-8f50-ff013c68fc51-1574179738469.png'),
(117, 21, 'a3bd02e8-e491-416d-a6e9-426ff192ae86-1574179742104.png'),
(122, 20, 'd3df7983-29e6-4705-bdbb-9a84427e9f64-1574263511129.png'),
(126, 26, '40ec67e8-3c7b-4a32-a161-5d97d5557269-1574265404636.png'),
(127, 26, '8e49fa38-7083-45ed-a3bc-d87688eef7bb-1574265464913.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `user_liked` int(11) NOT NULL,
  `user_likes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `id` int(11) NOT NULL,
  `user_one` int(11) NOT NULL,
  `user_two` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `matches`
--

INSERT INTO `matches` (`id`, `user_one`, `user_two`) VALUES
(1, 20, 25);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(19, 'ai'),
(20, 'bde'),
(15, 'dance'),
(21, 'ijijk'),
(17, 'love'),
(16, 'music'),
(18, 'travel');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `profile_picture` varchar(800) DEFAULT 'defaultProfilePicture.png',
  `password` varchar(255) NOT NULL,
  `longitude` varchar(255) NOT NULL DEFAULT '0',
  `latitude` varchar(255) NOT NULL DEFAULT '0',
  `is_verified` int(11) NOT NULL DEFAULT '0',
  `is_first_visit` int(11) DEFAULT '1',
  `verify_email_token` varchar(255) NOT NULL DEFAULT '0',
  `forget_pass_token` varchar(255) NOT NULL DEFAULT '0',
  `bio` varchar(600) NOT NULL DEFAULT '0',
  `sexual_preferences` varchar(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `gender`, `birthdate`, `email`, `profile_picture`, `password`, `longitude`, `latitude`, `is_verified`, `is_first_visit`, `verify_email_token`, `forget_pass_token`, `bio`, `sexual_preferences`) VALUES
(20, 'farahi', 'ismail', 'ifarahi', 'Other', '2002-11-18', 'dr0farahi@gmail.com', 'defaultProfilePicture.png', '$2b$10$Rk51dTntL6s4eA.7N8sNLuTz/pzKpNoDs1hxmp48kQ1e7Vl8.YVDe', '-6.897878200000001', '32.88210300000001', 1, 0, 'yDpQ2Z55X7aJWH6hTEpzQeq8oArloWFA', '0', 'gdfgdf hdfhdfh dfhdfhdgfh ghghgdh dghdg ', 'Other'),
(21, 'fisrtname', 'lastname', 'username', 'Men', '2001-11-19', 'email@gmail.com', '5a3ef0c7-7b5b-4f7d-8f50-ff013c68fc51-1574179738469.png', '$2b$10$ClIAglHI.QUG4nQJ9Gic9ulJAvVmcPd9gfbQg.9IqPADUP9NYwkBi', '-6.8978601', '32.882113499999996', 1, 0, '9BWBcZmoeO97hTcxchloODUOHUVTtvTz', '0', 'this is just a fake profiel to test the app', 'Men'),
(22, 'nouha', 'daoud', 'ndaoud', 'Women', '1995-04-22', 'nouha@gmail.com', 'defaultProfilePicture.png', '$2b$10$XCNzha7RvFKfjXJNsVeXzeWTqf49HA7qhKx9qmsPFb5K4BNmbqC3C', '0', '0', 1, 0, 'huxibVkmKAeLhv0q5PExyy0X5b3M1JFx', '0', '0', '0'),
(23, 'tazi', 'sfaqlo', 'sfaqlo', 'Men', '1998-01-06', 'saqlo@gmail.com', 'defaultProfilePicture.png', '$2b$10$tmy2AvYnmvJePa1.qMOyju7d6X17/xlyPdYCpv8f0k5q7su3eghlG', '0', '0', 1, 0, 'GizVSjDPGLhWVKr4qi9Fe2X9QOzs5q6o', '0', '0', '0'),
(24, 'noname', 'nolast', 'nouser', 'Men', '1992-05-30', 'nouser@gmail.com', 'defaultProfilePicture.png', '$2b$10$lczYZZf2dU4w08N.pU4JE.XgpBNM54Yse3GVQYQhjYAYsI4t4i7WC', '0', '0', 1, 0, 'jeUQ05D1U8RHUcui9rylCQw2ZILxsg1b', '0', '0', '0'),
(25, 'drabi', 'asmae', 'adrabi', 'Women', '1990-04-21', 'drabi@gmail.com', 'defaultProfilePicture.png', '$2b$10$BT2gZEda/QhY8opOvEjAqO9UowpIhsksKe1FyEfnC9006jdGOalVe', '-6.897860499999999', '32.882123199999995', 1, 0, 'YOD7se5KHBakMPZ8Z5yHJMJPS5h4cVCw', '0', '0', '0'),
(26, 'firstname', 'dsgdsgdf', 'ismaail', 'Men', '2001-11-01', 'ismaail@gmail.com', 'defaultProfilePicture.png', '$2b$10$V4oIpUdIy2kp.8XB4uhvXOOMuEUHTfFmxbzu53WNy48w/mDemNGXG', '-6.8978663', '32.8821209', 1, 0, 'LaEKFVkP3iAQMdMv56JNDTdliq4hhNLD', '0', 'hdfgklhjfghlgkh d;hk l;fgk fgkl ;jhfg jdfgkj', 'Women');

-- --------------------------------------------------------

--
-- Table structure for table `user_tags`
--

CREATE TABLE `user_tags` (
  `id` int(11) NOT NULL,
  `tag_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_tags`
--

INSERT INTO `user_tags` (`id`, `tag_id`, `user_id`) VALUES
(21, 17, 20),
(22, 18, 20),
(23, 16, 20),
(24, 15, 21),
(25, 19, 21),
(26, 20, 21),
(27, 19, 26),
(28, 20, 26),
(29, 16, 26),
(32, 21, 26);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blocks`
--
ALTER TABLE `blocks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_tags`
--
ALTER TABLE `user_tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tag_id` (`tag_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blocks`
--
ALTER TABLE `blocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `user_tags`
--
ALTER TABLE `user_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_tags`
--
ALTER TABLE `user_tags`
  ADD CONSTRAINT `user_tags_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`),
  ADD CONSTRAINT `user_tags_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
