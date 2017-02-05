-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 21, 2016 at 05:39 PM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ticket_booking`
--

--
-- Dumping data for table `baggage_type`
--

INSERT INTO `baggage_type` (`id`, `provider_id`, `name`, `fare`, `created_at`, `updated_at`) VALUES
(1, 1, 'Hành lý 15kg', 130000, NULL, NULL),
(2, 2, 'Hành lý 20kg', 150000, NULL, NULL);

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `code`, `one_way`, `adult`, `children`, `infant`, `ticket_type_id`, `remark`, `created_at`, `updated_at`) VALUES
(1, 'ABC', 1, 1, 0, 0, 1, 'no no no', NULL, NULL),
(2, 'XYZ', 0, 1, 0, 0, 2, 'yes yes yes', NULL, NULL);

--
-- Dumping data for table `booking_detail`
--

INSERT INTO `booking_detail` (`id`, `booking_id`, `depart`, `departure`, `arrive`, `arrival`, `one_way`, `depart_duration`, `return_duration`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2016-11-22 00:00:00', 2, '2016-11-22 00:00:00', 1, 150, 0, NULL, NULL),
(2, 1, 1, '2016-11-22 00:00:00', 2, '2016-11-22 00:00:00', 1, 150, NULL, NULL, NULL);

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `booking_id`, `title`, `first_name`, `last_name`, `phone`, `email`, `created_at`, `updated_at`) VALUES
(1, 1, 'Mr', 'Nam', 'Le', '01223955955', 'banamlehsb@gmail.com', NULL, NULL),
(2, 2, 'Ms', 'Luan', 'Phan', '01696700422', 'luanheo@gmail.com', NULL, NULL);

--
-- Dumping data for table `fare`
--

INSERT INTO `fare` (`id`, `passenger_id`, `one_way`, `fare`, `charge`, `tax`, `baggage_type_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1000000, 100000, 15000, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 2, 1, 2000000, 100000, 10000, 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

--
-- Dumping data for table `location`
--


INSERT INTO `location` (`id`, `code`, `name`, `created_at`, `updated_at`) VALUES
(1, 'SGN', 'Hồ Chí Minh', '2016-11-24 23:28:12', '2016-11-24 23:28:12'),
(2, 'HAN', 'Hà Nội', '2016-11-24 23:28:21', '2016-11-24 23:28:21'),
(3, 'THD', 'Thanh Hóa', '2016-11-21 17:03:01', '2016-11-21 17:03:01'),
(4, 'BMV', 'Buôn Ma Thuột', '2016-11-24 23:29:20', '2016-11-24 23:29:20'),
(5, 'VCL', 'Chu Lai', '2016-11-24 23:29:20', '2016-11-24 23:29:20'),
(6, 'CAH', 'Cà Mau', '2016-11-24 23:29:20', '2016-11-24 23:29:20'),
(7, 'VCA', 'Cần Thơ', '2016-11-24 23:29:20', '2016-11-24 23:29:20'),
(8, 'HUI', 'Huế', '2016-11-24 23:29:20', '2016-11-24 23:29:20'),
(9, 'HPH', 'Hải Phòng', '2016-11-24 23:29:20', '2016-11-24 23:29:20'),
(10, 'CXR', 'Nha Trang', '2016-11-24 23:29:20', '2016-11-24 23:29:20'),
(11, 'PQC', 'Phú Quốc', '2016-11-24 23:29:20', '2016-11-24 23:29:20'),
(12, 'PXU', 'Pleiku', '2016-11-24 23:31:10', '2016-11-24 23:31:10'),
(13, 'UIH', 'Quy Nhơn', '2016-11-24 23:31:10', '2016-11-24 23:31:10'),
(14, 'VKG', 'Rạch Giá', '2016-11-24 23:31:10', '2016-11-24 23:31:10'),
(15, 'VII', 'Tp Vinh', '2016-11-24 23:31:10', '2016-11-24 23:31:10'),
(16, 'TBB', 'Tuy Hòa', '2016-11-24 23:31:10', '2016-11-24 23:31:10'),
(17, 'DIN', 'Điện Biên', '2016-11-24 23:31:10', '2016-11-24 23:31:10'),
(18, 'DLI', 'Đà Lạt', '2016-11-24 23:31:10', '2016-11-24 23:31:10'),
(19, 'DAD', 'Đà Nẵng', '2016-11-24 23:31:10', '2016-11-24 23:31:10'),
(20, 'VDH', 'Đồng Hới', '2016-11-24 23:31:10', '2016-11-24 23:31:10');

--
-- Dumping data for table `passenger`
--

INSERT INTO `passenger` (`id`, `booking_id`, `title`, `first_name`, `last_name`, `birthdate`, `phone`, `email`, `created_at`, `updated_at`) VALUES
(1, 1, 'Mr', 'Nam', 'Le', '2016-11-18', '01223955955', 'banamlehsb@gmail.com', NULL, NULL),
(2, 2, 'Ms', 'Luan', 'Phan', '2016-11-19', '123', '456', NULL, NULL);

--
-- Dumping data for table `provider`
--

INSERT INTO `provider` (`id`, `name`, `vat`, `admin_fee`, `adult_airport_fee`, `child_airport_fee`, `adult_security_fee`, `child_security_fee`, `other_tax`, `payment_fee`, `created_at`, `updated_at`) VALUES 
('1', 'Jetstar', '10', '100000', '70000', '35000', '10000', '5000', '0', '50000', CURRENT_DATE(), CURRENT_DATE()), 
('2', 'VietnamAirlines', '10', '50000', '70000', '35000', '0', '0', '10000', '50000', CURRENT_DATE(), CURRENT_DATE()),
('3', 'VietjetAir', '10', '100000', '70000', '35000', '10000', '5000', '0', '50000', CURRENT_DATE(), CURRENT_DATE());

--
-- Dumping data for table `ticket_type`
--

INSERT INTO `ticket_type` (`id`, `provider`, `name`, `created_at`, `updated_at`) VALUES
(1, 1, 'Eco', NULL, NULL),
(2, 2, 'SkyBoss', NULL, NULL);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
