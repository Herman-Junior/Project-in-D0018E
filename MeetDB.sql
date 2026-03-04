-- Active: 1771429691299@@127.0.0.1@3306@MeetDatabase
    CREATE DATABASE IF NOT EXISTS MeetDatabase;
    DROP DATABASE MeetDatabase;
    USE MeetDatabase;
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
        address VARCHAR(100),
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
    created_at DATETIME DEFAULT NOW(),
    address_id INT,
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (address_id) REFERENCES ADDRESS(address_id),
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
    snapshot_price INT NOT NULL DEFAULT 0,
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

INSERT INTO CATEGORY (category_name) 
VALUES ('Seal') 
ON DUPLICATE KEY UPDATE category_name='seal';

-- 3. Lägg in en produkt
INSERT INTO PRODUCTS (category_id, name, price, description) 
VALUES (2, 'saad', 4434, 'lae.');

-- 4. Lägg in lagersaldo (valfritt, men bra för din Inventory-relation)
INSERT INTO INVENTORY (product_id, amount, unit_type) 
VALUES (2, 50, 'st');

SELECT * FROM CATEGORY;

SELECT * FROM PRODUCTS;

SELECT * FROM INVENTORY;

UPDATE USERS SET team = 1 WHERE email = 'admin@gmail.com';

INSERT INTO USERS (username, email, password_hash, team)
VALUES ('admin', 'admin@gmail.com', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

SELECT * FROM USERS WHERE email = 'admin@gmail.com';


UPDATE USERS SET team = 1 WHERE email = 'admin@gmail.com';

SELECT * FROM USERS WHERE email = 'admin@gmail.com';

DELETE FROM USERS WHERE email = 'admin@gmail.com';

