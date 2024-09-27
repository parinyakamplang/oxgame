-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Sep 17, 2024 at 07:42 PM
-- Server version: 9.0.1
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

CREATE TABLE `User` (
  `userID` int NOT NULL,
  `email` varchar(60) NOT NULL,
  `score` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `User`
  ADD PRIMARY KEY (`userID`);
ALTER TABLE `User`
  MODIFY `userID` int NOT NULL AUTO_INCREMENT;
COMMIT;

