use versevault;

create table customer
(
    customer_username varchar(20) primary key,
    customer_name varchar(25) not null,
    customer_contact varchar(14) not null unique,
    customer_password varchar(50) not null 
);

insert into customer values
('rahulsiv', 'Rahul Sivakumar', '+91 1234567890', 'abcd'),
('prabhatdeshmukh', 'Prabhat Deshmukh', '+91 2345678901', 'abcd'),
('pranavpd', 'Pranav Dambal', '+91 345678012', 'abcd');


