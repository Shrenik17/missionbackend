CREATE DATABASE IF NOT EXISTS general_database;

USE general_database;

CREATE USER 'general_user'@'localhost' IDENTIFIED BY 'User@123';

GRANT ALL PRIVILEGES ON general_database.* TO 'general_user'@'localhost' WITH GRANT OPTION;

CREATE TABLE IF NOT EXISTS users(
	user_id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_name text NOT NULL,
    user_email varchar(100) NOT NULL unique,
    user_password varchar(100) NOT NULL,
    index(user_id)
);