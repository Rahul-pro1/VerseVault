import {pool} from "../index.js"

async function bookSearch(req,res) {

    console.log(`In book search`);

    const { search } = req.body;
    const [records] = await pool.query(`select * from books where title = ?`, [search])
    const [records_author] = await pool.query(`select * from books where author = ?`, [search]);
    return res.json(records + records_author)
}

export { bookSearch }