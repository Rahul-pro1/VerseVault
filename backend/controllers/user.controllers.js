import {pool} from "../index.js"
import bcryptjs from "bcryptjs"
import validator from "validator";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

async function getCustomers(req,res) { 
    console.log(`In getCustomers`);
    
    const [records] = await pool.query("select * from customer")

    return res.json(records)
}

async function userRegistration(req, res) {
    console.log(`In registration`);

    let { username, email, user_password, confirm_password, contact, isVendor } = req.body;

    console.log(username, email, user_password, confirm_password, contact, isVendor);

    if (!(username && email && user_password && confirm_password && contact)) {
        console.log(`Field not entered!`);
        return res.status(400).send(`Field not entered!`);
    }

    const validEmail = validator.isEmail(email);
    const validContact = validator.isMobilePhone(contact, "en-IN");

    if (!validEmail) {
        console.log(`Wrong email format!`);
        return res.status(400).send(`Wrong email format!`);
    }

    if (!validContact) {
        console.log(`Wrong phone number format!`);
        return res.status(400).send(`Wrong phone number format!`);
    }

    if (user_password !== confirm_password) {
        console.log(`Confirm password wrong!`);
        return res.status(400).send(`Confirm password wrong!`);
    }

    const password = await bcryptjs.hash(user_password, 10);

    const profileLocalPath = req?.file?.path;
    let profile;

    if (profileLocalPath) {
        console.log("Profile path received ", profileLocalPath);
        profile = await uploadOnCloudinary(profileLocalPath);

        if (!profile) {
            console.log("Cloudinary upload failed!");
            return res.status(500).send(`Error uploading profile picture`);
        }
        console.log("Cloudinary URL received ", profile.url);
    } else {
        console.log("Profile path not received");
    }

    isVendor= (isVendor === "true") ? true : false

    // Check if the user already exists in the respective table based on isVendor
    let query = (isVendor)
        ? `SELECT * FROM vendor WHERE vendor_email = ? AND vendor_username = ? AND vendor_contact = ?`
        : `SELECT * FROM customer WHERE customer_email = ? AND customer_username = ? AND customer_contact = ?`;
    
    const [result] = await pool.query(query, [email, username, contact]);
    
    if (result.length > 0) {
        console.log(`User already exists!`);
        return res.status(400).json({ msg: `User already exists!` });
    }

    // Insert user into the appropriate table based on isVendor
    if (isVendor ) {
        await pool.query(
            `INSERT INTO vendor (vendor_username, vendor_email, vendor_password, vendor_contact, profile) VALUES (?, ?, ?, ?, ?)`,
            [username, email, password, contact, profile?.url || ""]
        );
    } else {
        await pool.query(
            `INSERT INTO customer (customer_username, customer_email, customer_password, customer_contact, profile) VALUES (?, ?, ?, ?, ?)`,
            [username, email, password, contact, profile?.url || ""]
        );
    }

    return res.status(200).json({ success: true });
}

async function userLogin(req, res) {
    const { username, password } = req.body;

    console.log(username, password);

    if (!(username && password)) {
        return res.status(400).json({ success: false, message: 'Credentials not entered!' });
    }

    const [user] = await pool.query(`SELECT * FROM customer WHERE customer_username = ?`, [username]);

    if (!user || user.length === 0) {
        return res.status(404).json({ success: false, message: "User doesn't exist!" });
    }

    // Check if user exists and compare passwords
    const valid_user = await bcryptjs.compare(password, user[0].customer_password);

    if (!valid_user) {
        return res.status(401).json({ success: false, message: 'Username or password is incorrect!' });
    }

    console.log(`In Login, checking user ${req.session.user}`);

    if(req.session.user !== username){
        console.log("In IF!");
        
        req.session.user = username;

        console.log(`After login ${req.session.user}`);
    }

    return res.status(200).json({ success: true });
}

async function userLogout(req,res) {

    console.log(`In logout`);

    if(req.session){
        console.log(`In Logout checking req.session ${req.session.user}`);
        req.session.destroy( (err) => {
            if(err){
                return res.status(500).send(`Failed to log out!`)
            }

            console.log(`After logout ${req.session}`);

            return res
            .status(200)
            .clearCookie('cookie')
            .json({"success":true})
        } )
    }
    else{
        return res
        .send(`Could not log out user`)
    }
        
}

async function shoppingCart(req,res){
    const {book_id} = req.body

    if(!book_id){
        console.log(`book is not received!`);
        return res.status(400).send(`book is not received!`)
    }

    console.log(`Book is ${book_id}`);

    if(!req.session.book){
        req.session.book = []
    }

    req.session.book.push(book_id)

    return res
    .status(200)
    .json({"success":true})
}

export {getCustomers, userRegistration, userLogin, userLogout, shoppingCart}