import {pool} from "../index.js"
import { v4 as uuidv4 } from 'uuid';
import createUniqueIdGenerator from "../utils/id.utils.js"
import { spawn } from 'child_process'

const book_id_gen = createUniqueIdGenerator()

async function bookSearch(req,res) {
    const { query } = req.body
    const [records] = await pool.query(`select * from books where title = ?`, [query])
    const [records_author] = await pool.query(`select * from books where author = ?`, [query])
    console.log(records+records_author)
    return res.json(records + records_author)
}


async function recommend(req, res) {
    const ordered = ['Animal Farm', 'Animal Farm / 1984', 'Animal Dreams']; //Since orders table wasn't ready yet
    // const [ordered] = await pool.query(`select books.title from books join orders on books.book_id = orders.book_id where orders.customer_username = ?`, req.session.user)

    const recommendationsPromises = ordered.map((book) => {
        return new Promise((resolve, reject) => {
            let output = "";

            const pythonProcess = spawn('python', ['./recommender.py', book]);

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`Error: ${data}`);
                reject(data.toString());
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve(output);  
                } else {
                    reject(`Process exited with code ${code}`);
                }
            });
        });
    });

    try {
        const recommendations = await Promise.all(recommendationsPromises);
        res.json(recommendations);  
    } catch (error) {
        console.error("Error generating recommendations:", error);
        res.status(500).send("Error generating recommendations");
    }
}

async function viewBook(req, res) {
    const { id } = req.params
    const [record] = await pool.query(`select * from books where id = ?`, [id])
    return res.json(record[0])
}

async function newBook(req, res) {
    console.log("In newBook")
    const vendor_username = req.session.user;
    const { title, author, genre, plot, book_price, copies } = req.body;
    const [books] = await pool.query(`select title from books where title=?`, [title]);

    const coverLocalPath = req?.file?.path;
    let book_cover=null;

    if (coverLocalPath) {
        console.log("Book cover received ", coverLocalPath);
        book_cover = await uploadOnCloudinary(profileLocalPath);

        if (!book_cover) {
            console.log("Cloudinary upload failed!");
            return res.status(500).send(`Error uploading profile picture`);
        }
        console.log("Cloudinary URL received ", book_cover.url);
    } else {
        console.log("Book_cover path not received");
    }

    console.log(req.body)
    let query;
    if (books.length === 0) {
        const book_id = book_id_gen()
        console.log(book_id)
        [query] = await pool.query(`insert into books (book_id, title, author, genre, plot, book_cover, book_price, copies, vendor_username) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [book_id, title, author, genre, plot, book_cover?.url, book_price, copies, vendor_username])
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
async function updateBook(req, res) {
    console.log("In updateBook")
    const { title, author, genre, plot, book_price, copies } = req.body;

    console.log(req.body)
    const [query] = await pool.query(`update books set title = ?, author =?, genre = ?, plot = ?, book_price = ?, copies = ?`, [title, author, genre, plot, book_price, copies])
   console.log([query])
    return res.status(200).json({ success: true })
}

export { bookSearch, viewBook, newBook, recommend, updateBook }
