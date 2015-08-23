-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 05, 2014 at 10:37 PM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `bankofrorybd`
--
CREATE DATABASE `bankofrorybd` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `bankofrorybd`;

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `ADD_NEW_ACCOUNT`(fname varchar(100), lname varchar(100), 
	email varchar(255),age int(11), street varchar(100),city varchar(100),country varchar(100),pass varchar(255))
BEGIN
INSERT INTO users VALUES(NULL,fname,lname,email,age,street,city,country,pass,3);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CHECK_LOGIN_DETAILS`(username_input VARCHAR(255),password_input VARCHAR(255)  )
BEGIN
SELECT * FROM users where email = username_input AND password = password_input;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DELETE_ACCOUNT`(custnum NUMERIC)
BEGIN
DELETE FROM users WHERE account_no = custnum;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DEPOSIT_MONEY`(acc_id NUMERIC, amount decimal(13,2))
BEGIN
UPDATE `account` SET balance = balance + amount WHERE users_account_no = acc_id;
INSERT INTO transactions (transactions_time, transaction_type, transaction_amount, users_account_no)
VALUES (CURRENT_TIMESTAMP,'Deposit Money', amount,acc_id);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_ACCOUNTS`()
BEGIN
SELECT a.id, u.account_no, u.first_name, u.last_name, u.age, u.country,a.balance, a.account_type_id FROM
users as u join account as a WHERE u.account_no = a.users_account_no AND u.user_roles_role_id > 2;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_ACCOUNT_INFO`(usernum NUMERIC)
BEGIN
SELECT u.account_no,u.first_name,u.last_name,u.email,u.age,u.street,u.city,u.country,a.balance,a.id,
a.account_type_id FROM users as u join account as a WHERE 
u.account_no = a.users_account_no AND u.account_no = usernum;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_ACCOUNT_TYPES`()
BEGIN
SELECT * FROM account_type;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_CURRENT_BALANCE`(user_id NUMERIC)
BEGIN
SELECT balance FROM account as a WHERE a.users_account_no = user_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_DEPOSIT_DATE`(search_date varchar(255))
BEGIN
SELECT a.id, u.first_name, u.last_name,t.transaction_id, t.transactions_time, t.transaction_type, t.transaction_amount FROM 
transactions as t JOIN account as a JOIN users as u where a.users_account_no = u.account_no 
AND a.id = t.account_id AND u.user_roles_role_id > 2 
AND STR_TO_DATE( search_date,  '%Y-%m-%d' ) = DATE(t.transactions_time) AND t.transaction_type = 'Deposit Money';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_DEPOSIT_DAY`()
BEGIN
SELECT  DISTINCT(DATE(t.transactions_time)) as dates FROM transactions as t WHERE t.transaction_type = 'Deposit Money';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_LAST_ACCOUNT_ID`()
BEGIN
SELECT account_no FROM users ORDER BY account_no DESC LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_ROLES`()
BEGIN
SELECT * FROM user_roles;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_TICKET_INFO`()
BEGIN
SELECT a.id,u.first_name,u.last_name,u.country,at.type FROM users as u join account as a join
account_type as at WHERE u.account_no = a.users_account_no AND 
a.account_type_id = at.id AND u.user_roles_role_id > 2 group by a.id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_Top_BALANCES`()
BEGIN
SELECT a.id,u.first_name,u.last_name,u.country,a.balance, at.type, Count(t.account_id) as no_of_trans FROM users as u join account as a join
account_type as at join transactions as t WHERE u.account_no = a.users_account_no AND 
a.account_type_id = at.id AND a.id = t.account_id AND u.user_roles_role_id > 2 group by a.id order by balance desc;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_Top_REGIONS`()
BEGIN
SELECT Count(DISTINCT u.account_no) as total_cust,u.country,
Sum(DISTINCT a.balance) as total_bal, Count(t.account_id) as no_of_trans FROM users as u join account as a join
account_type as at join transactions as t WHERE u.account_no = a.users_account_no AND 
a.account_type_id = at.id AND a.id = t.account_id AND u.user_roles_role_id > 2 group by u.country order by total_bal desc;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_TRANSACTIONS`(user_id NUMERIC)
BEGIN
SELECT t.transaction_id, t.transactions_time, t.transaction_type, t.transaction_amount, t.account_id FROM 
transactions as t JOIN account as a where a.users_account_no = user_id AND a.id = t.account_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_WITHDRAWS_DAY`()
BEGIN
SELECT  DISTINCT(DATE(t.transactions_time)) as dates FROM transactions as t WHERE t.transaction_type = 'Withdraw Money';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_WITHDRAW_DATE`(search_date varchar(255))
BEGIN
SELECT a.id, u.first_name, u.last_name,t.transaction_id, t.transactions_time, t.transaction_type, t.transaction_amount FROM 
transactions as t JOIN account as a JOIN users as u where a.users_account_no = u.account_no 
AND a.id = t.account_id AND u.user_roles_role_id > 2 
AND STR_TO_DATE( search_date,  '%Y-%m-%d' ) = DATE(t.transactions_time) AND t.transaction_type = 'Withdraw Money';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPDATE_ACCOUNT`(id NUMERIC, fname varchar(100), lname varchar(100),age int(11), street varchar(100),
city varchar(100),counrty varchar(100))
BEGIN
UPDATE `users` SET first_name = fname , last_name = lname,age = age, street = street,
city = city, country = counrty WHERE account_no = id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPDATE_ACCOUNT_PASS`(id NUMERIC, new_pass varchar(255))
BEGIN
UPDATE users SET password = new_pass WHERE account_no = id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPDATE_ACCOUNT_type`(id NUMERIC, type NUMERIC)
BEGIN
UPDATE `account` SET account_type_id = type WHERE users_account_no = id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPDATE_BALANCE`(acc_id NUMERIC, amount decimal(13,2))
BEGIN
UPDATE `account` SET balance = amount WHERE id = acc_id;
INSERT INTO transactions (transactions_time, transaction_type, transaction_amount, account_id)
VALUES (CURRENT_TIMESTAMP,'Changes Balance', amount,acc_id);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `WITHDRAW_MONEY`(acc_id NUMERIC, amount decimal(13,2))
BEGIN
UPDATE `account` SET balance = balance - amount WHERE users_account_no = acc_id;
INSERT INTO transactions (transactions_time, transaction_type, transaction_amount, users_account_no)
VALUES (CURRENT_TIMESTAMP,'Withdraw Money', amount,acc_id);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE IF NOT EXISTS `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `users_account_no` int(11) NOT NULL,
  `balance` decimal(13,2) NOT NULL DEFAULT '0.00',
  `account_type_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`account_type_id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_acc_trans_users1_idx` (`users_account_no`),
  KEY `fk_account_account_type1_idx` (`account_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `users_account_no`, `balance`, `account_type_id`) VALUES
(5, 1, 0.00, 1),
(6, 2, 0.00, 1),
(7, 3, 535.00, 2),
(8, 4, 25.00, 1),
(9, 5, 100.00, 1),
(10, 6, 100.00, 1),
(11, 7, 490.00, 1),
(12, 8, 182.98, 1),
(13, 9, 172.16, 2),
(14, 10, 593.00, 1),
(15, 11, 70.00, 1),
(16, 12, 29.01, 1),
(17, 13, 400.00, 1);

--
-- Triggers `account`
--
DROP TRIGGER IF EXISTS `delete_account`;
DELIMITER //
CREATE TRIGGER `delete_account` BEFORE DELETE ON `account`
 FOR EACH ROW DELETE FROM transactions
    WHERE account_id = old.id
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `account_type`
--

CREATE TABLE IF NOT EXISTS `account_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `type_UNIQUE` (`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `account_type`
--

INSERT INTO `account_type` (`id`, `type`) VALUES
(1, 'Current'),
(2, 'Student');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE IF NOT EXISTS `transactions` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `transactions_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `transaction_type` varchar(255) NOT NULL,
  `transaction_amount` decimal(13,2) NOT NULL DEFAULT '0.00',
  `users_account_no` int(11) NOT NULL,
  PRIMARY KEY (`transaction_id`),
  UNIQUE KEY `tranactions_UNIQUE` (`transaction_id`),
  KEY `fk_transactions_users_account1_nox` (`users_account_no`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=99 ;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `transactions_time`, `transaction_type`, `transaction_amount`, `account_id`) VALUES
(5, '2014-11-22 01:05:29', 'Open Account', 0.00, 5),
(6, '2014-11-22 01:05:29', 'Open Account', 0.00, 6),
(7, '2014-11-22 01:05:29', 'Open Account', 0.00, 7),
(8, '2014-11-22 01:05:29', 'Open Account', 0.00, 8),
(19, '2014-11-22 01:26:45', 'Deposit Money', 10.00, 7),
(20, '2014-11-22 01:27:02', 'Deposit Money', 10.00, 7),
(25, '2014-11-23 21:21:46', 'Deposit Money', 10.00, 7),
(26, '2014-11-23 21:23:10', 'Deposit Money', 10.00, 7),
(27, '2014-11-23 21:29:48', 'Deposit Money', 10.00, 7),
(37, '2014-11-23 21:50:04', 'Deposit Money', 13.50, 7),
(41, '2014-11-23 21:54:30', 'Deposit Money', 0.50, 7),
(42, '2014-11-23 21:55:19', 'Deposit Money', 2.00, 7),
(43, '2014-11-23 21:58:18', 'Deposit Money', 10.00, 7),
(44, '2014-11-23 22:00:43', 'Withdraw Money', 10.00, 7),
(45, '2014-11-23 22:01:47', 'Withdraw Money', 5.50, 7),
(46, '2014-11-23 22:46:47', 'Deposit Money', 10.50, 7),
(47, '2014-11-23 22:47:12', 'Withdraw Money', 6.00, 7),
(48, '2014-11-24 13:27:25', 'Withdraw Money', 5.00, 7),
(49, '2014-11-24 13:29:27', 'Withdraw Money', 5.00, 7),
(50, '2014-11-24 13:30:46', 'Deposit Money', 10.00, 7),
(51, '2014-11-25 13:26:29', 'Withdraw Money', 10.00, 7),
(52, '2014-11-26 15:48:45', 'Deposit Money', 20.00, 7),
(53, '2014-11-26 15:50:21', 'Withdraw Money', 30.00, 7),
(54, '2014-11-26 18:31:57', 'Open Account', 0.00, 9),
(55, '2014-11-26 18:36:34', 'Open Account', 0.00, 10),
(56, '2014-11-26 19:48:47', 'Deposit Money', 100.00, 10),
(57, '2014-11-27 10:09:44', 'Deposit Money', 50.00, 9),
(58, '2014-11-27 16:41:17', 'Deposit Money', 10.50, 8),
(59, '2014-11-27 16:41:43', 'Deposit Money', 2.00, 8),
(60, '2014-11-27 19:34:31', 'Deposit Money', 10.50, 8),
(61, '2014-11-27 19:39:25', 'Withdraw Money', 10.00, 8),
(62, '2014-11-27 19:53:14', 'Withdraw Money', 30.00, 8),
(63, '2014-11-27 19:53:40', 'Deposit Money', 20.00, 8),
(64, '2014-11-27 19:54:01', 'Withdraw Money', 4.00, 8),
(65, '2014-11-27 19:58:41', 'Deposit Money', 5.00, 8),
(66, '2014-11-27 19:59:02', 'Withdraw Money', 4.00, 8),
(67, '2014-11-27 19:59:24', 'Deposit Money', 23.00, 8),
(68, '2014-11-27 21:04:24', 'Withdraw Money', 3.00, 8),
(69, '2014-11-27 21:04:39', 'Deposit Money', 5.00, 8),
(70, '2014-11-28 23:17:19', 'Deposit Money', 10.50, 7),
(71, '2014-11-28 23:17:38', 'Withdraw Money', 0.50, 7),
(72, '2014-12-02 16:08:48', 'Changes Balance', 100.00, 9),
(73, '2014-12-02 21:31:10', 'Open Account', 0.00, 11),
(74, '2014-12-02 21:31:29', 'Deposit Money', 500.00, 11),
(75, '2014-12-02 21:31:44', 'Withdraw Money', 10.00, 11),
(76, '2014-12-02 21:35:25', 'Open Account', 0.00, 12),
(77, '2014-12-02 21:35:52', 'Deposit Money', 65.00, 12),
(78, '2014-12-02 21:36:07', 'Deposit Money', 17.99, 12),
(79, '2014-12-02 21:36:20', 'Deposit Money', 99.99, 12),
(80, '2014-12-02 21:37:55', 'Open Account', 0.00, 13),
(81, '2014-12-02 21:38:10', 'Deposit Money', 33.33, 13),
(82, '2014-12-02 21:38:19', 'Deposit Money', 33.33, 13),
(83, '2014-12-02 21:39:27', 'Deposit Money', 10.50, 13),
(84, '2014-12-02 21:43:11', 'Open Account', 0.00, 14),
(85, '2014-12-02 21:43:28', 'Deposit Money', 700.00, 14),
(86, '2014-12-02 21:44:22', 'Withdraw Money', 100.00, 14),
(87, '2014-12-02 21:44:36', 'Withdraw Money', 7.00, 14),
(88, '2014-12-02 21:49:03', 'Open Account', 0.00, 15),
(89, '2014-12-02 21:49:25', 'Deposit Money', 70.00, 15),
(90, '2014-12-02 21:51:19', 'Open Account', 0.00, 16),
(91, '2014-12-02 21:51:36', 'Deposit Money', 33.00, 16),
(92, '2014-12-02 21:51:44', 'Withdraw Money', 3.99, 16),
(93, '2014-12-02 21:52:08', 'Deposit Money', 400.00, 7),
(94, '2014-12-02 22:50:50', 'Changes Balance', 172.16, 13),
(95, '2014-12-02 22:53:48', 'Open Account', 0.00, 17),
(96, '2014-12-02 22:54:07', 'Deposit Money', 400.00, 17);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE IF NOT EXISTS `user_roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(45) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_id_UNIQUE` (`role_id`),
  UNIQUE KEY `role_UNIQUE` (`role`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`role_id`, `role`) VALUES
(1, 'admin'),
(2, 'support'),
(3, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `account_no` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `street` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_roles_role_id` int(11) NOT NULL,
  PRIMARY KEY (`account_no`,`user_roles_role_id`),
  UNIQUE KEY `account_no_UNIQUE` (`account_no`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_users_user_roles1_idx` (`user_roles_role_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`account_no`, `first_name`, `last_name`, `email`, `age`, `street`, `city`, `country`, `password`, `user_roles_role_id`) VALUES
(1, 'Admin', 'MGMT', 'admin@bankofrory.com', 38, 'Glebe St', 'Birr', 'Ireland', 'c93ccd78b2076528346216b3b2f701e6', 1),
(2, 'Team', 'Support', 'support@bankofrory.com', 50, 'Glebe St', 'Birr', 'Ireland', '6df134d687f503fd656074dd969a677a', 2),
(3, 'Liam', 'Brady', 'liam@example.com', 29, 'Main St', 'Athlone', 'Ireland', 'fcea920f7412b5da7be0cf42b8c93759', 3),
(4, 'Billy', 'Batgate', 'billy@ait.ie', 34, 'Main St', 'Athlone', 'Ireland', 'fcea920f7412b5da7be0cf42b8c93759', 3),
(5, 'Mary', 'Willis', 'mary@example.com', 54, '1050 Broadway', 'New York', 'USA', 'fcea920f7412b5da7be0cf42b8c93759', 3),
(6, 'Jack', 'Ryan', 'jack@example.com', 34, '1984 Broadway', 'New York', 'USA', 'fcea920f7412b5da7be0cf42b8c93759', 3),
(7, 'David', 'Adams', 'david@gmail.com', 34, 'Glebe St', 'Birr', 'Ireland', 'fcea920f7412b5da7be0cf42b8c93759', 3),
(8, 'Ann', 'Lawson', 'Ann@avon.com', 54, 'Main St', 'London', 'England', 'fcea920f7412b5da7be0cf42b8c93759', 3),
(9, 'Eddie', 'Enright', 'eddie@birr.net', 38, '1 Emmet St', 'Birr', 'Ireland', 'fcea920f7412b5da7be0cf42b8c93759', 3),
(10, 'Sir William', 'Bailey', 'will@yourbank.com', 76, '10 Downing Street', 'London', 'England', 'fcea920f7412b5da7be0cf42b8c93759', 3),
(11, 'Britney S.', 'Pierce', 'britney@et.com', 21, '2 Central Park West', 'New York', 'USA', 'fcea920f7412b5da7be0cf42b8c93759', 3),
(12, 'James', 'Morrison', 'James@example.com', 33, 'Love Street', 'Athlone', 'Ireland', 'fcea920f7412b5da7be0cf42b8c93759', 3),
(13, 'Jan', 'Var Plank', 'jan@example.com', 56, '21 Dutch Rd', 'Amsterdam', 'Holland', 'fcea920f7412b5da7be0cf42b8c93759', 3);

--
-- Triggers `users`
--
DROP TRIGGER IF EXISTS `starting_off_acc`;
DELIMITER //
CREATE TRIGGER `starting_off_acc` AFTER INSERT ON `users`
 FOR EACH ROW BEGIN
 INSERT INTO account VALUES(NULL,new.account_no,0.00,1);
 SET @last_id_in_account = LAST_INSERT_ID();
INSERT INTO transactions VALUES(NULL,CURRENT_TIMESTAMP,'Open Account',0.00,@last_id_in_account);

END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `delete_user`;
DELIMITER //
CREATE TRIGGER `delete_user` BEFORE DELETE ON `users`
 FOR EACH ROW DELETE FROM account
    WHERE users_account_no = old.account_no
//
DELIMITER ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `fk_account_account_type1` FOREIGN KEY (`account_type_id`) REFERENCES `account_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_acc_trans_users1` FOREIGN KEY (`users_account_no`) REFERENCES `users` (`account_no`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_transactions_account1` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_user_roles1` FOREIGN KEY (`user_roles_role_id`) REFERENCES `user_roles` (`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
