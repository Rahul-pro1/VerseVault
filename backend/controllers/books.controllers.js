import {pool} from "../index.js"

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
    let query;
    if (books.length === 0) {
        [query] = await pool.query(`insert into books (title, author, genre, plot, book_cover, book_price, copies, vendor_username) values (?, ?, ?, ?, ?, ?, ?, ?)'`, [title, author, genre, plot, book_cover, book_price, copies, vendor_username])
    } else {
        [query] = await pool.query(`update books set copies=copies+? where title=?`, [copies, title])
    }
   console.log([query])
    return res.status(200).json({ success: true })
}

export { bookSearch, viewBook, newBook }