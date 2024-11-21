import { pool } from "../index.js"

async function vendor_delete(req, res) {
  console.log("In vendors delete")
  const { username } = req.params
  const [query] = await pool.query(`delete from vendor where vendor_username=?`, [username])
  console.log(query)
  return res.status(200).json({ success: true })
}

async function getVendors(req, res) {
  console.log("In getVendors")
  const [vendors] = await pool.query(`select * from vendor`)
  console.log("Vendors", vendors)
  return res.json(vendors)
}

async function getCustomers(req, res) {
  console.log("In getCustomers")
  const [customers] = await pool.query(`select * from customer`)
  return res.json(customers)
}

async function addTokens(req, res) {
  console.log("In addTokens")
  const { username } = req.params
  const [query] = await pool.query(`update customer set tokens = tokens + 1 where customer_username=?`, [username])
  return res.status(200).json({ success: true })
}

export { vendor_delete, getVendors, getCustomers, addTokens }