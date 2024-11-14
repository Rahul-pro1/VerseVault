import {pool} from "../index.js"
import { v4 as uuidv4 } from 'uuid';

async function bookSearch(req,res) {
    const { search } = req.body
    const [records] = await pool.query(`select * from books where title = ?`, [search])
    const [records_author] = await pool.query(`select * from books where author = ?`, [search])
    return res.json(records + records_author)
}

async function viewBook(req, res) {
    const { id } = req.params
    const [record] = await pool.query(`select * from books where id = ?`, [id])
    return res.json(record[0])
}

async function newBook(req, res) {
    const { vendor_username } = req.session.user;
    const { title, author, genre, plot, book_cover, book_price, copies } = req.body;
    const [books] = await pool.query(`select title from books where title=?`, [title]);
    let query, book_id;
    if (books.length === 0) {
        book_id=uuidv4()
        // console.log(`Book id is ${book_id.length}`);
        [query] = await pool.query(`insert into books (book_id, title, author, genre, plot, book_cover, book_price, copies, vendor_username) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [book_id, title, author, genre, plot, book_cover, book_price, copies, vendor_username])
    } else {
        [query] = await pool.query(`update books set copies=copies+? where title=?`, [copies, title])
    }
   console.log([query])
    return res.status(200).json({ success: true })
}

async function buy(req, res) {
    const { address, mode_of_payment, payment_status } = req.body;

    if (!(address && mode_of_payment && payment_status)) {
        console.log(`Info not received!`);
        return res.send(`Info not received!`);
    }

    if (req.session.book.length === 0) {
        console.log(`No books in shopping cart!`);
        return res.send(`No books in shopping cart!`);
    }

    const connection = await pool.getConnection();
    try {
        // Start transaction
        await connection.beginTransaction();

        let orderId;

        for (let book of req.session.book) {
            // Check if book exists
            const [isBooks] = await connection.query(`SELECT * FROM books WHERE book_id = ?`, [book.id]);
            if (isBooks.length === 0) {
                console.log(`Book id is invalid!`);
                return res.send(`Book id is invalid!`);
            }

            // Check if enough copies are available
            if (isBooks[0].copies < book.copies) {
                console.log(`Not enough copies available for book ID ${book.id}`);
                return res.send(`Not enough copies available for book ID ${book.id}`);
            }

            // Update copies in the books table
            await connection.query(`UPDATE books SET copies = copies - ? WHERE book_id = ?`, [book.copies, book.id]);

            // Generate unique order ID
            orderId = uuidv4();

            // Insert the order into the orders table
            await connection.query(
                `INSERT INTO orders (order_id, book_id, delivery_address, payment_status, customer_username, mode_of_payment) VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, book.id, address, payment_status, req.session.user, mode_of_payment]
            );

            req.session.book=req.session.book.filter( b => b.id !== book.id )
        }

        // Commit transaction
        await connection.commit();
        console.log("Order(s) placed successfully!");
        return res.send("Order(s) placed successfully!");
    } catch (error) {
        // Rollback transaction if something goes wrong
        await connection.rollback();
        console.error('Error processing the order:', error);
        return res.send('Error processing the order!');
    } finally {
        connection.release();
    }
}

export { bookSearch, viewBook, newBook, buy }