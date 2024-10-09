import mysql from 'mysql2'
import dotenv from 'dotenv'
import {app} from './app.js'

dotenv.config({
    path: './.env'
})

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getCustomers() { 
    const [records] = await pool.query("select * from customer")
    return records
}

const port_val = process.env.PORT || 8080

app.listen( port_val, () => {
    console.log(`App is running on ${port_val}`);
} )