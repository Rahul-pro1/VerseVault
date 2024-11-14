import { pool } from "../index.js"

async function vendor_delete(req, res) {
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

export { vendor_delete, getVendors }