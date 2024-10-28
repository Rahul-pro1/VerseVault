import {pool} from "../index.js"
import bcryptjs from "bcryptjs"
import validator from "validator";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

async function getCustomers(req,res) { 
    console.log(`In getCustomers`);
    
    const [records] = await pool.query("select * from customer")

    return res.json(records)
}

async function registration(req,res){

    console.log(`In registration`);

    const {customer_username,customer_email,customer_password, confirm_password} = req.body

    console.log(customer_username,customer_email,customer_password, confirm_password);

    if(!(customer_username,customer_email,customer_password, confirm_password)){
        console.log(`Field not entered!`);
        return res.status(400).send(`Field not send!`)
    }

    const validEmail = validator.isEmail(customer_email)

    if(!validEmail){
        console.log(`Wrong email format!`);
        return res.status(400).send(`Wrong email format!`)
    }

    pool.query(`SELECT * FROM customer WHERE customer_email=? AND customer_username=?`, 
        [customer_email, customer_username], async (err, result) => {
        if(err) throw err

        if(result.length > 0){
            console.log(`User already exists!`);
            return res.status(400).json({msg:`User already exists!`})
        }
    })

    if(!(customer_password===confirm_password)){
        console.log(`Confirm password wrong!`);
        return res.status(400).send(`Confirm password wrong!`)
    }

    const password = await bcryptjs.hash(customer_password,10)

    const profileLocalPath = req?.file?.path
    let profile

    if(!profileLocalPath){
        console.log("Profile path not received");
    }
    else{
        console.log("Profile path received ", profileLocalPath);

        profile = await uploadOnCloudinary(profileLocalPath)

        if(!profile){
            console.log("Cloudinary not received!");
        }
        console.log("Cloudinary received ", profile.url);
    }

    await pool.query(
        `INSERT INTO customer (customer_username, customer_email, customer_password, profile) VALUES (?, ?, ?, ?)`,
        [customer_username, customer_email, password, profile?.url || ""]
    );

    return res
    .status(200)
    .json({success:true})
}

export {getCustomers, registration}