USE versevault;

CREATE TABLE customer (
    customer_username varchar(30) PRIMARY KEY,
    customer_email varchar(50) NOT NULL,
    customer_contact varchar(15) NOT NULL,
    customer_password varchar(80) NOT NULL,
    profile varchar(100) 
);

CREATE TABLE vendor (
    vendor_username varchar(30) PRIMARY KEY,
    vendor_email varchar(50) NOT NULL,
    vendor_contact varchar(15) NOT NULL,
    vendor_password varchar(80) NOT NULL,
    profile varchar(100) 
);

CREATE TABLE admin (
    admin_username varchar(30) PRIMARY KEY,
    admin_name varchar(30) NOT NULL,
    admin_password varchar(80) NOT NULL, 
);

CREATE TABLE books (
    book_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    author VARCHAR(50) NOT NULL,
    genre VARCHAR(30) NOT NULL,
    plot VARCHAR(2000) NOT NULL,
    book_price DECIMAL(10, 2) NOT NULL,
    vendor_username VARCHAR(20),
    book_cover varchar(100),
    FOREIGN KEY (vendor_username) REFERENCES vendor(vendor_username),
    copies INT
);

CREATE TABLE reviews (
    review_id VARCHAR(100) PRIMARY KEY,
    customer_username VARCHAR(20),
    book_id VARCHAR(100),
    content VARCHAR(2000),
    rating ENUM('1', '2', '3', '4', '5'),
    FOREIGN KEY (customer_username) REFERENCES customer(customer_username),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

CREATE TABLE orders (
    order_id VARCHAR(100) PRIMARY KEY,
    book_id VARCHAR(100),
    delivery_address VARCHAR(2000) NOT NULL,
    payment_status VARCHAR(10) NOT NULL,
    customer_username VARCHAR(20),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (customer_username) REFERENCES customer(customer_username)
);

ALTER TABLE orders ADD COLUMN mode_of_payment ENUM("Online", "Cash on delivery");
ALTER TABLE orders MODIFY COLUMN payment_status ENUM("Paid", "Pending");

DELIMITER //
CREATE TRIGGER vendor_delete 
BEFORE DELETE
ON vendor
FOR EACH ROW
BEGIN
    DELETE from books where vendor_username = OLD.vendor_username;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER check_total_inventory_before_order
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    DECLARE total_stock INT;
    SET total_stock = (SELECT SUM(copies) FROM books WHERE book_id = NEW.book_id);
    
    IF NEW.copies > total_stock THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order quantity exceeds available stock across all vendors.';
    END IF;
END;
//
DELIMITER ;


DELIMITER //
CREATE TRIGGER prevent_vendor_deletion_with_unfulfilled_orders
BEFORE DELETE ON vendor
FOR EACH ROW
BEGIN
    DECLARE pending_orders INT;
    SET pending_orders = (SELECT COUNT(*) 
                          FROM orders o
                          JOIN books b ON o.book_id = b.book_id 
                          WHERE b.vendor_username = OLD.vendor_username AND o.payment_status = 'Pending');
    
    IF pending_orders > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete vendor with unfulfilled orders.';
    END IF;
END;
//
DELIMITER ;



