use versevault;

create table customer
(
    customer_username varchar(20) primary key,
    customer_email varchar(25) not null,
    customer_password varchar(50) not null 
);
