USE versevault;

alter table vendor add column vendor_id varchar(20) PRIMARY KEY;

CREATE TABLE books (
    book_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(50) NOT NULL UNIQUE,
    author VARCHAR(20) NOT NULL,
    genre VARCHAR(30) NOT NULL,
    plot VARCHAR(2000) NOT NULL,
    book_price DECIMAL(10, 2) NOT NULL,
    vendor_username VARCHAR(20),
    book_cover varchar(100),
    FOREIGN KEY (vendor_username) REFERENCES vendor(vendor_username),
    copies INT
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
