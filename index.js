import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import jwt, { decode } from "jsonwebtoken";
import {body,validationResult} from "express-validator";
// import { jwtDecode } from "jwt-decode";
import bcrypt from "bcrypt";
import pg from "pg";
import router from "./routes/user-rout.js";


env.config();

// const db = new pg.Client({
//     user: process.env.PG_USER,
//     password: process.env.PG_PASSWORD,
//     database: process.env.PG_DATABASE,
//     host: process.env.PG_HOST,
//     port: process.env.PG_PORT,
// });  

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "apis",
    password: "DESKTOP1",
    port: 5432,
});
db.connect();

const secret_key = "mansi1234"
const app = express();
const port = 3000;

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const validationPass = (password)=>{
    const regex=("/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/", "i");
     return regex.check(password);
}
//routs
app.use("/home", router)

app.post("/signup", [

    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters '),
    body('name').notEmpty().withMessage('Name is required')
], async (req, res) => {
    const { name, email, password } = req.body;
    console.log({name,email,password})
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ err: err.array() });
    }
    if(!validationPass(password)){
        return res.status(404).json({message:"enter valid pass (Ex=Demo@123)"})
    }
    // if (!name || !email || !password ) {
    //     return res.status(400).send("name email and password is require")
    // }
    try {
        const result = await db.query("SELECT * FROM users WHERE email=$1", [email])
        console.log(result, "/////////////////////////////////")
        if (result.rows.length > 0) {
            return res.send("user already exist try to login")
        }
        else {
            const hashpass = await bcrypt.hash(validationPass, 10);
            console.log(hashpass);
            const result = await db.query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *", [name, email, validationPass]);
            console.log({ name, email, password }, "stored");
            return res.status(200).json({ name, email, validationPass,message:"data added successfully",success:"true" });
        }

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({message:"internal server error",sucess:"false"});
    }
});

//login
app.post("/login",[
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')],verifyToken, async (req, res) => {

    const { email, password } = req.body;
    // if (!email || !password ) {
    //     return res.status(404).json({
    //         message: "email and password is require"
    //     })
    // }
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ err: err.array() });
    }
    try {
        const result = await db.query("SELECT * FROM users WHERE email=$1", [email])
        //return res.status(200).json(result);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "user not exist,enter correct email" })
        }
        const isMatch = await bcrypt.compare(password, result.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "invalid password ,please try again" })
        }

        else {
            {
                jwt.sign({ id: result.rows[0].id, email }, secret_key, { expiresIn: "1d" }, (err, token) => {
                    res.status(200).json({ token, email, password, message: "welcome to home page" });
                    console.log("added", { email, password, token }, "//////////////////////////////");
                });

            }

        }

    } catch (error) {
        console.log("error", error);
        return res.status(500).send("internal server error");
    }
})


app.patch("/update",verifyToken,async (req, res) => {
    const { name, email, password } = req.body;
    if( !email ){
        res.status(400).json({mesage:" email field should not be empty ,ennter valid email "})
    }
    try {

        const hashpass = await bcrypt.hash(password, 10);
        const result = await db.query("UPDATE users SET name=$1,email=$2,password=$3 WHERE id=$4 RETURNING * ", [name, email, hashpass, req.id])
        // console.log(req.id,"hhhhhhhhhhhhhhhhhhhhhhhhhh")
        console.log(name, email, password,"updated users")
        res.status(200).json({ name, email, password, message: "uupdated stored" })
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
})

app.delete("/delete", verifyToken, async (req, res) => {
    const {email}=req.body;
    if(email!==req.email){
        res.status(400).json({message:"enter updated email"})
    }
    try {
        const result = await db.query('DELETE FROM users WHERE id=$1', [req.id]);
        //    console.log(result.rows[0].id);

        res.status(200).json({ message: "user deleted successfully" })


    } catch (error) {
        res.status(404).json({ message: "data not deleted" })
    }

})

//to-do crup operation


app.get("/data",verifyToken,(req, res) => {
    const {email}=req.body;
    if(email!==req.email ||!email){
        res.status(404).json({ message: " emiail is require ,enter you updated email " })
    }else{
        res.status(200).json({message:"add you updated email"})
    }
    
})

app.post("/todo", verifyToken, async (req, res) => {
    const { email, city, age, contact } = req.body;
    if (!email || !city || !age || !contact) {
        return res.status(404).send("please fillup all the fields");
    }
    try {
        const result = await db.query("INSERT INTO todo (cus_id,email,city,age,contat) VALUES ($1,$2,$3,$4,$5) RETURNING *",
            [req.id, email, city, age, contact]);
        // console.log(result)
        if (result.rows[0].email === req.email) {
            console.log(result.rows[0]);
            return res.status(200).json({ data: result.rows[0], mesage: "data added successfully" })
        }

    } catch (error) {
        res.status(500).json(error)
    }

})

app.patch("/upd",verifyToken,async (req, res) => {
    const { email, city, age, contact } = req.body;
    // if (!email || !city || !age || !contact) {
    //     return res.status(404).send("please fillup all the fields");
    // }
    if( !email || email!==req.email){
        res.status(400).json({mesage:" email field should not be empty ,ennter valid email "})
    }
    
    try {
        const result=await db.query("UPDATE todo SET email=$1, city=$2, age=$3, contat=$4 WHERE cus_id=$5 RETURNING *"
            ,[req.email,city,age,contact,req.id]);
            console.log( "data:",email,city,age,contact)
                res.status(200).json({ message: "updated",email,city,age,contact})
        
    } catch (error) {
        res.status(500).json({message:"internal servar error"})
    }
})

app.delete("/del", verifyToken, async (req, res) => {
    const {email}=req.body;
    if(!email){
        res.status(404).json({message:"enter updated email"})
    }
    try {
        const result= await db.query("DELETE FROM todo WHERE cus_id=$1", [req.id]);
        // if(!result.rows[0]){
        //     return res.status(404).json({message:"user not found,enter valid details"})
        // }
        console.log("deleted");
        return res.status(200).json({ message: "deleted" })
    } catch (error) {
        res.status(500).json({ message: "internal server error,try to login" })
    }

})

//jwt token function
function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    // console.log(req.headers)
    console.log(bearerHeader);

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ")[1]
        console.log(bearer, "----------------------------------");
        req.token = bearer;
        console.log(req.token);

        const decoded = jwt.verify(req.token, secret_key);
        req.id = decoded.id;
        req.email = decoded.email;
        console.log("decode token:", decoded)
        // console.log(userEmail, "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
        next()

    }
    else {

        res.json("token expire")

    }
}


app.listen(port, () => {
    console.log(`server connet with ${port}`)
})

