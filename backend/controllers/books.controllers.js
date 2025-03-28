import {pool} from "../index.js"
import { v4 as uuidv4 } from 'uuid';
import { spawn } from 'child_process'
import axios from 'axios'

async function bookSearch(req, res) {
    try {
        const { query } = req.body;
        const [records] = await pool.query(`SELECT * FROM books WHERE title = ?`, [query]);
        const [records_author] = await pool.query(`SELECT * FROM books WHERE author = ?`, [query]);
        const combinedRecords = [...records, ...records_author];
        return res.json(combinedRecords);
    } catch (error) {
        console.error("Error fetching book records:", error);
        return res.status(500).json({ error: "An error occurred while fetching records" });
    }
}

// async function recommend(req, res) {
//     // const ordered = ['Animal Farm', 'Animal Farm / 1984', 'Animal Dreams']; // Placeholder data since orders table wasn't ready yet
//     let [ordered] = await pool.query(`select books.title from books join orders on books.book_id = orders.book_id where orders.customer_username = ?`, req.session.user);
//     ordered = ordered.map(obj => {
//         return obj.title
//     })
//     console.log("ORDERED", ordered)

//     const recommendationsPromises = ordered.map((book) => {
//         return new Promise((resolve, reject) => {
//             let output = "";

//             const pythonProcess = spawn('python', ['./recommender.py', book]);

//             pythonProcess.stdout.on('data', (data) => {
//                 output += data.toString();
//             });

//             pythonProcess.stderr.on('data', (data) => {
//                 console.error(`Error: ${data}`);
//                 reject(data.toString());
//             });

//             pythonProcess.on('close', (code) => {
//                 if (code === 0) {
//                     resolve(output);
//                 } else {
//                     reject(`Process exited with code ${code}`);
//                 }
//             });
//         });
//     });

//     try {
//         let recommendations = await Promise.all(recommendationsPromises);

//         recommendations = recommendations.flatMap(item => {
//             try {
//                 return JSON.parse(item).map(innerArray => innerArray[0]);
//             } catch (error) {
//                 console.error("Error parsing JSON:", error);
//                 return [];
//             }
//         });

//         recommendations = await Promise.all(
//             recommendations.map(async (title) => {
//                 const [foundBook] = await pool.query('SELECT * FROM books WHERE title = ?', [title]);
//                 return foundBook.length > 0 ? foundBook[0] : null; // Return book details if found, otherwise null
//             })
//         );

//         recommendations = recommendations.filter(book => book !== null);
//         console.log(recommendations)
//         res.json(recommendations);
//     } catch (error) {
//         console.error("Error generating recommendations:", error);
//         res.status(500).send("Error generating recommendations");
//     }
// }

async function recommend(req,res) {
    const [ordered] = await pool.query(`select title from books join orders on books.book_id = orders.book_id where orders.customer_username = ?`, req.session.user )
    
    let books = []

    ordered.map( (book) => {
        if(!books.includes(book.title)){
            books.push(book.title)
        }
    } )

    console.log('Books to send to Flask:', books); 

    try {
        // Send the array of books to the Flask backend for recommendations
        const result = await axios.post('http://localhost:5000/book_recommend', {
            books: books
        });

        if (result.status !== 200) {
            console.log('No recommendations received');
            return res.status(500).send('Error fetching recommendations');
        }

        // If the request was successful, log and send the recommendations back
        // console.log('Recommendations:', result.data.recommendations);
        res.json(result.data);

    } catch (error) {
        // console.error('Error during request to Flask backend:', error);
        res.status(500).send('Error fetching recommendations');
    }

}

async function viewBook(req, res) {
    console.log("In viewBook")
    const { id } = req.params
    console.log()
    const [record] = await pool.query(`select * from books where book_id = ?`, [id])
    const [result] = await pool.query(`CALL GetAverageRating(?, @avg_rating)`, [id]);
    const [avgRatingRow] = await pool.query(`SELECT @avg_rating AS avg_rating`);
    const [reviews] = await pool.query(`select * from reviews where book_id=?`, [id])
    const rec = record[0]
    rec.avg_rating = avgRatingRow[0].avg_rating
    rec.reviews = reviews
    console.log("REC", rec)
    return res.json(rec)
}

async function newBook(req, res) {
    console.log("In newBook")

    let vendor_username

    if(req.session.user && req.session.role === "vendor"){
        vendor_username = req.session.user;
    }

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
        const book_id = uuidv4()
        console.log(book_id)
        const book_cover_url = req.body.book_cover ? req.body.book_cover.url : null;
        [query] = await pool.query(`insert into books (book_id, title, author, genre, plot, book_cover, book_price, copies, vendor_username) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [book_id, title, author, genre, plot, book_cover_url, book_price, copies, vendor_username])
    } else {
        [query] = await pool.query(`update books set copies=copies+? where title=?`, [copies, title])
    }
   console.log([query])
    return res.status(200).json({ success: true })
}

async function buy(req, res) {
    console.log("In /buy", req.session.book)
    const { address, mode_of_payment } = req.body;
    let payment_status;

    if (mode_of_payment === "Online") payment_status = "Paid"
    else payment_status = "Pending"

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
        await connection.beginTransaction();

        let orderId;

        for (let book of req.session.book) {
            const [isBooks] = await connection.query(`SELECT * FROM books WHERE book_id = ?`, [book.id]);
            if (isBooks.length === 0) {
                console.log(`Book id is invalid!`);
                return res.send(`Book id is invalid!`);
            }

            const [result] = await pool.query(`SELECT IsCopiesGreaterThan(?, ?) AS is_greater`, [book.id, 1]);
            console.log(result[0].is_greater); 

            if (!result[0].is_greater) {
                console.log(`Not enough copies available for book ID ${book.id}`);
                return res.send(`Not enough copies available for book ID ${book.id}`);
            }

            await connection.query(`UPDATE books SET copies = copies - ? WHERE book_id = ?`, [book.copies, book.book_id]);
            
            if (mode_of_payment == 'Online') {
                await connection.query(`UPDATE customer SET tokens = tokens - ?*? WHERE customer_username = ?`, [book.copies, isBooks[0].book_price, req.session.user]);
            }

            orderId = uuidv4();

            await connection.query(
                `INSERT INTO orders (order_id, book_id, delivery_address, payment_status, customer_username, mode_of_payment) VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, book.id, address, payment_status, req.session.user, mode_of_payment]
            );
            

            req.session.book=req.session.book.filter( b => b.id !== book.id )
        }

        await connection.commit();
        console.log("Order(s) placed successfully!");
        return res.send("Order(s) placed successfully!");
    } catch (error) {
        await connection.rollback();
        console.error('Error processing the order:', error);
        return res.send('Error processing the order!');
    } finally {
        connection.release();
    }
}

async function updateBook(req, res) {
    console.log("In updateBook");
    const { title, author, genre, plot, book_price, copies } = req.body;
    const { id } = req.params

    console.log(id);

    try {
        const [query] = await pool.query(
            `UPDATE books SET title = ?, author = ?, genre = ?, plot = ?, book_price = ?, copies = ? WHERE book_id = ?`,
            [title, author, genre, plot, book_price, copies, id]
        );

        if (query.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error updating book:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}


async function getVendorBooks(req, res) {
    console.log("In getVendorBooks")
    try {
        const [records] = await pool.query(`SELECT * FROM books WHERE vendor_username = ?`, [req.session.user]);
        return res.json(records);
    } catch (error) {
        console.error("Error fetching book records:", error);
        return res.status(500).json({ error: "An error occurred while fetching records" });
    }
}

async function addReviews(req, res) {
    console.log("In addReviews")
    const review_id = uuidv4()
    const { content, rating } = req.body
    const { id } = req.params
    const customer_username = req.session.user

    const [query] = await pool.query(`insert into reviews (review_id, customer_username, book_id, content, rating) values (?, ?, ?, ?, ?)`, [review_id, customer_username, id, content, rating])
    console.log(query)
    return res.status(200).json({ success: true })
}


export { bookSearch, viewBook, newBook, recommend, updateBook, buy, getVendorBooks, addReviews }
