/*
 Navicat Premium Data Transfer

 Source Server         : study
 Source Server Type    : MySQL
 Source Server Version : 50646
 Source Host           : localhost:3306
 Source Schema         : umi

 Target Server Type    : MySQL
 Target Server Version : 50646
 File Encoding         : 65001

 Date: 03/04/2020 14:28:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for access_token
-- ----------------------------
DROP TABLE IF EXISTS `access_token`;
CREATE TABLE `access_token` (
  `access_token` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '访问的token',
  `expires_at` varchar(30) COLLATE utf8_bin NOT NULL COMMENT '过期时间',
  `client_id` varchar(11) COLLATE utf8_bin NOT NULL COMMENT '客户端id',
  `user_id` varchar(11) COLLATE utf8_bin NOT NULL COMMENT '用户的id',
  PRIMARY KEY (`access_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `account` varchar(20) COLLATE utf8_bin NOT NULL,
  `password` varchar(32) COLLATE utf8_bin NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for casbin_rule
-- ----------------------------
DROP TABLE IF EXISTS `casbin_rule`;
CREATE TABLE `casbin_rule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ptype` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `v0` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '角色id',
  `v1` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '访问路径',
  `v2` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '请求方法',
  `v3` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `v4` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `v5` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=414 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `path` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `action` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `description` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL COMMENT '1：顶级菜单，2：二级菜单，3：访问权限',
  `code` varchar(20) COLLATE utf8_bin DEFAULT NULL COMMENT '菜单权限key',
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '0:正常1：删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=478 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for refresh_token
-- ----------------------------
DROP TABLE IF EXISTS `refresh_token`;
CREATE TABLE `refresh_token` (
  `refresh_token` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '刷新token',
  `expires_at` varchar(30) COLLATE utf8_bin NOT NULL COMMENT '过期时间',
  `client_id` varchar(11) COLLATE utf8_bin NOT NULL COMMENT '客户端id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  PRIMARY KEY (`refresh_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_bin NOT NULL,
  `access_codes` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '访问权限id',
  `codes` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '菜单权限code',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

SET FOREIGN_KEY_CHECKS = 1;
