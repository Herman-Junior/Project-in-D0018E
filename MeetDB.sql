CREATE DATABASE MeetDatabase;
USE MeetDatabase;

-- USERS TABLE
CREATE TABLE USERS (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
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
    FOREIGN KEY (category_id) REFERENCES CATEGORY(category_id)
);

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