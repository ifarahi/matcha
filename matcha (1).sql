-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Sep 14, 2019 at 08:17 PM
-- Server version: 5.7.26
-- PHP Version: 7.2.19

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

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tag` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `user_id`, `tag`) VALUES
(1, 2, 'love'),
(2, 2, 'travel'),
(3, 2, 'music'),
(4, 2, 'reading'),
(5, 2, 'programming'),
(6, 4, 'love'),
(7, 4, 'travel'),
(8, 4, 'music'),
(9, 4, 'reading'),
(10, 4, 'programming');

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
  `age` int(10) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `longitude` varchar(255) NOT NULL DEFAULT '0',
  `latitude` varchar(255) NOT NULL DEFAULT '0',
  `is_verified` int(11) DEFAULT NULL,
  `is_first_visit` int(11) DEFAULT '1',
  `verify_email_token` varchar(255) NOT NULL DEFAULT '0',
  `forget_pass_token` varchar(255) NOT NULL DEFAULT '0',
  `bio` varchar(600) NOT NULL DEFAULT '0',
  `sexual_preferences` varchar(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `gender`, `age`, `email`, `password`, `longitude`, `latitude`, `is_verified`, `is_first_visit`, `verify_email_token`, `forget_pass_token`, `bio`, `sexual_preferences`) VALUES
(2, 'farahi', 'ismail', 'drecho', 'men', 25, 'ifarahi@gmail.com', '$2b$10$6qdzUQ0twOWdBOvAzItKKuCWjIDnSiXO6EIE4znSatDuQwclY3Pmm', '0', '0', 1, 0, '1U4QXe9Qv5GdYW1uL2EEIIhejdvd7QvX', '0', 'im interested in web technologies as the new afsdgdfgdfgdf', 'oldwomens'),
(3, 'farahi', 'ismail', 'ifarahi', 'men', NULL, 'dr0farahi@gmail.com', '$2b$10$IWKxqEhle2Ojs2D2qnmFZOYfvAJsAxAEUfKgr/Fc3H9f5ZBQqO706', '0', '0', NULL, 1, 'QLlLc3CBY92kdRzHXFM3arlinz25HTfm', '0', '0', '0'),
(4, 'farahi', 'ismail', 'ismaail', 'men', 25, '6ef1fb68eb@hellomail.fun', '$2b$10$t.s0MupL/paXOkWgBA3ReOhw/KuVQMvxRpte2kLQq0treasmTx4Oy', '0', '0', 1, 0, 'ljOvwCk17sL8Ik9qGVJk6V6VPZ28xX4m', 'fI0U3IfL9UPZM7ax', 'im interested in web technologies as the new afsdgdfgdfgdf', 'girls');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
