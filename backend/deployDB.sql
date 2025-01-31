-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: notes
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('3630d347-9483-4105-adf4-2aeadf51430b','251f38d6399ba2ddf51973c68049e20fd93b002b1ffc3da5bce647aea21f73d9','2025-01-18 15:13:52.080','20250118110308_init',NULL,NULL,'2025-01-18 15:13:52.025',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `note`
--

DROP TABLE IF EXISTS `note`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `note` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `folder` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `note`
--

LOCK TABLES `note` WRITE;
/*!40000 ALTER TABLE `note` DISABLE KEYS */;
INSERT INTO `note` VALUES (7,'C','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737375599/notes/sgbtvn51fimvznlmk8sc.pdf','1','C','BCA','Notes','notes','2025-01-20 12:19:51.770','2025-01-20 12:19:51.770'),(8,'C','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737375667/Notes/v1m4vmwjmes9scash9bg.pdf','2023','C','BCA','Notes','Notes','2025-01-20 12:20:59.551','2025-01-20 12:20:59.551'),(9,'DSA','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737375904/Notes/wtjyp5u23obsovp67pvz.pdf','2023','DSA','BCA','Notes','Notes','2025-01-20 12:24:57.020','2025-01-20 12:24:57.020'),(10,'Environmental Studies','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737455486/Notes/tdf9u41pq4ihlclerfpw.pdf','2023','Environmental Studies','BCA','Notes','Notes','2025-01-21 10:31:17.881','2025-01-21 10:31:17.881'),(11,'Operating System','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737455552/Question/n18vsc1do6ni7bqpeefi.pdf','2023','Operating System ','BCA','Question','Question','2025-01-21 10:32:23.970','2025-01-21 10:32:23.970'),(12,'Computer Networks','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737456230/Notes/srlnxqbar6yovdn5ylbj.pdf','2023','Computer Networks','BCA','Notes','Notes','2025-01-21 10:43:42.149','2025-01-21 10:43:42.149'),(13,'Physics','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737458317/Notes/qbc2qqohlzajymgvybhg.pdf','2023','Physics','BCA','Notes','Notes','2025-01-21 11:18:29.016','2025-01-21 11:18:29.016'),(14,'Data Structures and Algorithms ','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737458628/Notes/xatzkwhx1mp4x7nyzsjp.pdf','2023','Data Structures and Algorithms ','BCA','Notes','Notes','2025-01-21 11:23:39.850','2025-01-21 11:23:39.850'),(15,'PYQ ','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737458755/Question/gvgy8hexhxjdbeo9lbny.pdf','2023','All Sub Question Papers','BCA','Question','Question','2025-01-21 11:25:46.985','2025-01-21 11:25:46.985'),(16,'PYQ','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737458812/Questions/snmyt4mowvrt9lt1rfh0.pdf','2024','All Sub Question Papers','BCA','Questions','Questions','2025-01-21 11:26:43.789','2025-01-21 11:26:43.789'),(17,'C++','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737459017/Notes/az1l2oenjstorhbn4u1y.pdf','2024','C++','BCA','Notes','Notes','2025-01-21 11:30:09.095','2025-01-21 11:30:09.095'),(18,'Discrete Structures ','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737459198/Questions/d0pujxiyqdsadnt8xxsj.pdf','2024','Discrete Structures ','BCA','Questions','Questions','2025-01-21 11:33:09.287','2025-01-21 11:33:09.287'),(19,'Wireless Communication ','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737459351/Notes/zq2lqx4sf2cyki3fupdc.pdf','2024','Wireless Communication','BCA','Notes','Notes','2025-01-21 11:35:42.203','2025-01-21 11:35:42.203'),(20,'Artificial Intelligence ','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737459503/Notes/byjb7w3xs7u88yrxvwzr.pdf','2024','Artificial Intelligence','BCA','Notes','Notes','2025-01-21 11:38:13.903','2025-01-21 11:38:13.903'),(21,'Internet & Web Technology ','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737459607/Notes/vmwgovgt4nmgzzqqkb0d.pdf','2024','Internet & Web Technology ','BCA','Notes','Notes','2025-01-21 11:39:58.504','2025-01-21 11:39:58.504'),(22,'Cyber Crime and Cyber Law','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737459764/Notes/eisvilzaz6hguklwxvfw.pdf','2024','Cyber Crime and Cyber Law','BCA','Notes','Notes','2025-01-21 11:42:35.272','2025-01-21 11:42:35.272'),(23,'Linux','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737466771/Notes/rntutvkjbdebkfpb3idy.pdf','2023','Linux','BCA','Notes','Notes','2025-01-21 13:39:23.510','2025-01-21 13:39:23.510'),(24,'Discrete Structure ','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737467114/Notes/zvb9wlahc4spzu9twer1.pdf','2024','Discrete Structure ','BCA','Notes','Notes','2025-01-21 13:45:05.973','2025-01-21 13:45:05.973'),(25,'Math Formula Sheet','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737467218/Notes/pdmag2qrulxaulkdboxf.pdf','2024','Maths Formula Sheet','BCA','Notes','Notes','2025-01-21 13:46:49.907','2025-01-21 13:46:49.907'),(26,'BCA SEM-IV','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737467396/Question/qk0qcstgyaqhiz16zvri.pdf','2024','Question Papers','BCA','Question','Question','2025-01-21 13:49:48.013','2025-01-21 13:49:48.013'),(27,'Digital Marketing','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737467480/Notes/x5wllpdbzcak5wozl1ut.pdf','2025','Digital Marketing ','BCA','Notes','Notes','2025-01-21 13:51:12.108','2025-01-21 13:51:12.108'),(28,'Software Engineering','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737467534/Notes/wvfozozha23mru4acsn4.pdf','2025','Software Engineering','BCA','Notes','Notes','2025-01-21 13:52:07.543','2025-01-21 13:52:07.543'),(29,'Java','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737467622/Notes/exutcx7rbnrur4mnfmt1.pdf','2025','Java','BCA','Notes','Notes','2025-01-21 13:53:33.868','2025-01-21 13:53:33.868'),(30,'PYQ','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737467702/Questions/oyyavvrzbfhjvekmghmy.pdf','2025','All Subjects Question Papers','BCA','Questions','Questions','2025-01-21 13:54:53.938','2025-01-21 13:54:53.938'),(31,'Python','https://res.cloudinary.com/dfivdwpoh/raw/upload/v1737987142/Notes/lb6zjdsmympycqm5rcci.pdf','2023','Python','BCA','Notes','Notes','2025-01-27 14:12:05.773','2025-01-27 14:12:05.773');
/*!40000 ALTER TABLE `note` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-30 18:09:56
