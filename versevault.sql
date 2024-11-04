USE versevault;

CREATE TABLE customer (
    customer_username VARCHAR(20) PRIMARY KEY,
    customer_name VARCHAR(30) NOT NULL,
    customer_email VARCHAR(50) NOT NULL,
    customer_contact VARCHAR(15) NOT NULL,
    customer_password VARCHAR(80) NOT NULL,
    profile VARCHAR(100)
);

CREATE TABLE vendor (
    vendor_id VARCHAR(20) PRIMARY KEY,
    vendor_name VARCHAR(30) NOT NULL,
    vendor_email VARCHAR(50) NOT NULL,
    vendor_contact VARCHAR(15) NOT NULL,
    vendor_password VARCHAR(80) NOT NULL 
);

CREATE TABLE admin (
    admin_username VARCHAR(20) PRIMARY KEY,
    admin_name VARCHAR(30) NOT NULL,
    admin_password VARCHAR(80) NOT NULL
);

CREATE TABLE books (
    book_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    author VARCHAR(20) NOT NULL,
    genre VARCHAR(30) NOT NULL,
    plot VARCHAR(2000) NOT NULL,
    book_price DECIMAL(10, 2) NOT NULL,
    vendor_id VARCHAR(20),
    book_cover varchar(100),
    FOREIGN KEY (vendor_id) REFERENCES vendor(vendor_id)
);

CREATE TABLE reviews (
    review_id VARCHAR(10) PRIMARY KEY,
    customer_username VARCHAR(20),
    book_id VARCHAR(10),
    content VARCHAR(2000),
    rating ENUM('1', '2', '3', '4', '5'),
    FOREIGN KEY (customer_username) REFERENCES customer(customer_username),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

CREATE TABLE orders (
    order_id VARCHAR(10) PRIMARY KEY,
    book_id VARCHAR(10),
    delivery_address VARCHAR(2000) NOT NULL,
    payment_status VARCHAR(10) NOT NULL,
    customer_username VARCHAR(20),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (customer_username) REFERENCES customer(customer_username)
);
