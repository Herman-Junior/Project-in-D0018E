-- Active: 1772115014074@@127.0.0.1@3306
CREATE DATABASE IF NOT EXISTS MeetDatabase;
USE MeetDatabase;-- Active: 1763569423496@@localhost@3306@meetdatabase
CREATE DATABASE IF NOT EXISTS MeetDatabase;
USE MeetDatabase;
DROP DATABASE MeetDatabase;
-- USERS TABLE
CREATE TABLE USERS (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    email VARCHAR(100) UNIQUE,
    team BOOLEAN
);

-- CATEGORY TABLE
CREATE TABLE CATEGORY (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) UNIQUE
);

-- PRODUCTS TABLE
CREATE TABLE PRODUCTS (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(100) UNIQUE,
    price INT,
    description VARCHAR(255),
    is_public BOOLEAN DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES CATEGORY(category_id)
);

DROP TABLE PRODUCTS;
-- INVENTORY TABLE
CREATE TABLE INVENTORY (
    product_id INT PRIMARY KEY,
    amount FLOAT,
    unit_type VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
);

-- ADDRESS TABLE
CREATE TABLE ADDRESS (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    country VARCHAR(100),
    state VARCHAR(100),
    city VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

-- ORDER TABLE
CREATE TABLE ORDERS (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    method VARCHAR(50),
    total_price INT,
    payment_details VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);


-- CART TABLE
CREATE TABLE CART (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    quantity FLOAT,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
);

-- ORDER ITEMS TABLE
CREATE TABLE ORDER_ITEMS (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity FLOAT,
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id),
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
);

-- REVIEW TABLE
CREATE TABLE REVIEW (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    user_id INT,
    rating INT,
    comment VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

SELECT * FROM PRODUCTS;

SELECT * FROM USERS;

SELECT * FROM CART;

USE MeetDatabase;


DROP TABLE IF EXISTS ORDER_ITEMS;
DROP TABLE IF EXISTS CART;
DROP TABLE IF EXISTS ORDERS;
DROP TABLE IF EXISTS REVIEW;
DROP TABLE IF EXISTS ADDRESS;
DROP TABLE IF EXISTS INVENTORY;
DROP TABLE IF EXISTS PRODUCTS;
DROP TABLE IF EXISTS CATEGORY;
DROP TABLE IF EXISTS USERS;


SHOW TABLES;

SELECT * FROM PRODUCTS;
USE MeetDatabase;
-- Create category first

-- Add products
INSERT INTO PRODUCTS (name, price, description, category_id) 
VALUES ('Delue Board', 120, 'Premium Selection', 1);

INSERT INTO CATEGORY (category_name) 
VALUES ('Boards') 
ON DUPLICATE KEY UPDATE category_name='Boards';

-- 3. Lägg in en produkt
INSERT INTO PRODUCTS (category_id, name, price, description) 
VALUES (1, 'Delue Board', 599, 'Premium selection of meats for the discerning palate.');

-- 4. Lägg in lagersaldo (valfritt, men bra för din Inventory-relation)
INSERT INTO INVENTORY (product_id, amount, unit_type) 
VALUES (LAST_INSERT_ID(), 50, 'st');

DROP DATABASE MeetDatabase;
DROP DATABASE MeetDatabase;
-- USERS TABLE
CREATE TABLE USERS (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    email VARCHAR(100) UNIQUE,
    team BOOLEAN
);

-- CATEGORY TABLE
CREATE TABLE CATEGORY (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) UNIQUE
);

-- PRODUCTS TABLE
CREATE TABLE PRODUCTS (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(100) UNIQUE,
    price INT,
    description VARCHAR(255),
    is_public BOOLEAN DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES CATEGORY(category_id)
);

DROP TABLE PRODUCTS;
-- INVENTORY TABLE
CREATE TABLE INVENTORY (
    product_id INT PRIMARY KEY,
    amount FLOAT,
    unit_type VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
);

-- ADDRESS TABLE
CREATE TABLE ADDRESS (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    country VARCHAR(100),
    state VARCHAR(100),
    city VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

-- ORDER TABLE
CREATE TABLE ORDERS (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    method VARCHAR(50),
    total_price INT,
    payment_details VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

-- CART TABLE
CREATE TABLE CART (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    quantity FLOAT,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
);

-- ORDER ITEMS TABLE
CREATE TABLE ORDER_ITEMS (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity FLOAT,
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id),
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
);

-- REVIEW TABLE
CREATE TABLE REVIEW (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    user_id INT,
    rating INT,
    comment VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

SELECT * FROM PRODUCTS;

SELECT * FROM USERS;

SELECT * FROM CART;

USE MeetDatabase;


DROP TABLE IF EXISTS ORDER_ITEMS;
DROP TABLE IF EXISTS CART;
DROP TABLE IF EXISTS ORDERS;
DROP TABLE IF EXISTS REVIEW;
DROP TABLE IF EXISTS ADDRESS;
DROP TABLE IF EXISTS INVENTORY;
DROP TABLE IF EXISTS PRODUCTS;
DROP TABLE IF EXISTS CATEGORY;
DROP TABLE IF EXISTS USERS;


SHOW TABLES;

SELECT * FROM PRODUCTS;
USE MeetDatabase;
-- Create category first

-- Add products
INSERT INTO PRODUCTS (name, price, description, category_id) 
VALUES ('Delue Board', 120, 'Premium Selection', 1);

INSERT INTO CATEGORY (category_name) 
VALUES ('Boards') 
ON DUPLICATE KEY UPDATE category_name='Boards';

-- 3. Lägg in en produkt
INSERT INTO PRODUCTS (category_id, name, price, description) 
VALUES (1, 'Delue Board', 599, 'Premium selection of meats for the discerning palate.');

-- 4. Lägg in lagersaldo (valfritt, men bra för din Inventory-relation)
INSERT INTO INVENTORY (product_id, amount, unit_type) 
VALUES (LAST_INSERT_ID(), 50, 'st');

DROP DATABASE MeetDatabase;
