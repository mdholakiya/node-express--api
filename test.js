// import express from "express";
// import bodyParser from "body-parser";
// import env from "dotenv";
// import jwt, { decode } from "jsonwebtoken";
// import {body,validationResult} from "express-validator";
// import bcrypt from "bcrypt";
// import pg from "pg";
// import router from "./routes/home-rout.js";


// env.config();

// const db = new pg.Client({
//     user: process.env.PG_USER,
//     password: process.env.PG_PASSWORD,
//     database: process.env.PG_DATABASE,
//     host: process.env.PG_HOST,
//     port: process.env.PG_PORT,
// });  

// // const db = new pg.Client({
// //     user: "postgres",
// //     host: "localhost",
// //     database: "apis",
// //     password: "DESKTOP1",
// //     port: 5432,
// // });
// db.connect();

// const secret_key = "mansi1234"
// const app = express();
// const port = 3000;

// //middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
   
// const passdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
// const contactRegex=/^[0-9]{10}$/;

// //routs
// app.use("/home", router)

// app.post("/signup", [

//     body('email').isEmail().withMessage('enter valid email address'),

//     body('password').isLength({ min: 8 }).withMessage("enter valid pass (Ex=Demo@123),atleat 8 character"),

//     body('name').notEmpty().withMessage('Name is required')

// ], async (req, res) => {
//     const { name, email, password } = req.body;
//     console.log({name,email,password});

//     const err = validationResult(req);
//     if (err.isEmpty()==false) {  //(!err.isEmpty())
//         return res.status(400).json({ err: err.array() });
//     }
    
//     if(!passdRegex.test(password)){
//         return res.status(404).json({mesage:"enter unique pass which include alterat one uper case,one lower case and one diggit"})
//     }
//     try {
//         const result = await db.query("SELECT * FROM users WHERE email=$1", [email])
//         console.log(result, "/////////////////////////////////")
//         if (result.rows.length > 0) {
//             return res.send("user already exist try to login")
//         }
//         else {
//             const hashpass = await bcrypt.hash(password, 10);
//             console.log(hashpass);
//             const result = await db.query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *", [name, email, hashpass]);
//             console.log({ name, email, password }, "stored");
//             return res.status(200).json({ name, email,password,message:"data added successfully",success:"true" });
//         }

//     } catch (error) {
//         console.log("error", error);
//          res.status(500).json({message:"internal server error",sucess:"false"});
//     }
// });

// //login
// app.post("/login",[
//     body('email').isEmail().withMessage('Invalid email address'),
//     body('password').isLength({ min: 8 }).withMessage('enter valid password ,password is require')],
//      async(req, res) => {

//     const { email, password } = req.body;

//     const err = validationResult(req);
//     if (!err.isEmpty()) {
//         return res.status(400).json({ err: err.array() });
//     }

//     try {
//         const result = await db.query("SELECT * FROM users WHERE email=$1", [email])
//         if (result.rows.length === 0) {
//             return res.status(400).json({ message: "user not found,enter correct email" })
//         }
//         const isMatch = await bcrypt.compare(password, result.rows[0].password);
//         if (!isMatch) {
//             return res.status(401).json({ message: "invalid password ,please try again" })
//         }
//         else{

//             jwt.sign ({ id: result.rows[0].id, email }, secret_key, { expiresIn: "1d" }, (err, token) => {
//                console.log( "email:",email,"pass:", password,"toekn:", token);
//                res.status(200).json({ token, email, password, message: "welcome to home page" });
//            });
//         }

//     } catch (error) {
//         console.log("error", error);
//          res.status(500).send("internal server error");
//     }
// })


// app.patch("/update", verifyToken,async (req, res) => {
//     const result=await db.query('SELECT * FROM users wHERE id=$1',[req.id]);
//     console.log(result.rows[0],"llllllllllllllllllllllllllllllll")
//     let { name, email, password } = req.body;
//     if(!name && !email && !password){
//         return res.status(404).json({message:"enter atleast one field for update "})
//     }
//     if(name==="" || name.trim()==""){
//         return res.status(404).json({message:"enter valid name"})
//     }
//     if (!name){
//      // return res.status(400).json({ message: "Name cannot be empty" }
//         name=result.rows[0].name;
//     }
//     if (password=="" ||!passdRegex.test(password)) {
//         return res.status(400).json({ 
//           message: "Enter a valid password (min 8 characters, include at least one uppercase, one lowercase, and one digit)" 
//         });
//       }
//     if(!password){
//         password = result.rows[0].password
//     }

//     if (email && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
//         return res.status(400).json({ message: "Enter a valid email address" });
//       }
//     if(!email){
//         email = result.rows[0].email
//     }
//     try {
//         let hashpass="";
//         if(!password.includes("$")){
//              hashpass = await bcrypt.hash(password, 10);
//         }
//         const result = await db.query("UPDATE users SET name=$1,email=$2,password=$3 WHERE id=$4 RETURNING * ", [name, email, hashpass ==="" ? password : hashpass , req.id])

//         console.log(name, email, password,"updated users")
//         return res.status(200).json({name, email, password, message: "uupdated stored" })
//     } catch (error) {
//      return   res.status(500).json({ message: "internal server error" })
//     }
// })

// app.delete("/delete", verifyToken, async (req, res) => {
//     const {email}=req.body;
//     const result=await db.query('SELECT * FROM users WHERE email=$1',[email])
//     req.email=email;
//     console.log(req.email,"//////////////////////////////////")
//     if(email !==result.rows[0].email){
//         res.status(400).json({message:"enter updated email"})
//     }
//     try {
//         const result = await db.query('DELETE FROM users WHERE id=$1', [req.id]);
//         //    console.log(result.rows[0].id);

//         res.status(200).json({ message: "user deleted successfully" })


//     } catch (error) {
//         res.status(404).json({ message: "data not deleted" })
//     }

// })

// //to-do crup operation


// app.get("/data",verifyToken,async(req, res) => {
//     const {email}=req.body;
//     // console.log(req.email);
//     const result=await db.query("SELECT * FROM users WHERE email=$1",[email])
//     if(email!==result.rows[0].email ||!email){
//         res.status(404).json({ message: " emiail is require ,enter you updated email " })
//     }else{
//         res.status(200).json({message:"welcome.... now you can edit your todo"})
//     }
    
// })

// app.post("/todo", verifyToken, async (req, res) => {
//     const { email, city, age, contact } = req.body;
//     // console.log(req.email)
//     const result=await db.query("SELECT * FROM users WHERE email=$1",[email])
//     console.log(result.rows[0].email)
//     if( !email || email!==result.rows[0].email){
//         res.status(400).json({mesage:" email field should not be empty ,enter valid and updated email "})
//     }
//     if ( !city || !age || !contact) {
//         return res.status(404).send(" fillup all the fields for add details");
//     }
//     if(!contactRegex.test(contact)){
//         res.status(404).json({message:"contact shold be 10 digit only "})
//     }
    
    
//     try {
//         const result = await db.query("INSERT INTO todo (cus_id,email,city,age,contat) VALUES ($1,$2,$3,$4,$5) RETURNING *",
//             [req.id, email, city, age, contact]);
//         // console.log(result)
//         if (result.rows[0].email ===email) {
//             console.log(result.rows[0]);
//             return res.status(200).json({ data: result.rows[0], mesage: "data added successfully" })
//         }

//     } catch (error) {
//         res.status(500).json(error)
//     }

// })

// app.patch("/upd",verifyToken,async (req, res) => {
//     const { email, city, age, contact } = req.body;
//     if ( !city && !age && !contact) {
//         return res.status(404).send("enter atleast one filed to update details");
//     }
//     const result=await db.query("SELECT * FROM users WHERE email=$1",[email])
//     if( !email || email!==result.rows[0].email){
//         res.status(400).json({mesage:" email field should not be empty ,ennter valid email "})
//     }
    
//     try {
//         const result=await db.query("UPDATE todo SET email=$1, city=$2, age=$3, contat=$4 WHERE cus_id=$5 RETURNING *"
//             ,[req.email,city,age,contact,req.id]);
//             console.log( "data:",email,city,age,contact)
//                 res.status(200).json({ message: "updated",email,city,age,contact})
        
//     } catch (error) {
//         res.status(500).json({message:"internal servar error"})
//     }
// })

// app.delete("/del", verifyToken, async (req, res) => {
//     const {email}=req.body;
//     const result=await db.query("SELECT * FROM users WHERE email=$1",[email])
//     if(!email ||email==!result.rows[0].email){
//         res.status(404).json({message:"enter updated email"})
//     }
//     try {
//         const result= await db.query("DELETE FROM todo WHERE cus_id=$1", [req.id]);
//         // if(!result.rows[0]){
//         //     return res.status(404).json({message:"user not found,enter valid details"})
//         // }
//         console.log("deleted");
//         return res.status(200).json({ message: "deleted" })
//     } catch (error) {
//         res.status(500).json({ message: "internal server error,try to login" })
//     }

// })

// //jwt token function
// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers["authorization"];
//     // console.log(req.headers)
//     console.log(bearerHeader);

//     if (typeof bearerHeader !== "undefined") {
//         const bearer = bearerHeader.split(" ")[1]
//         console.log(bearer, "----------------------------------");
//         req.token = bearer;
//         console.log(req.token);

//         const decoded = jwt.verify(req.token, secret_key);
//         req.id = decoded.id;
//         req.email = decoded.email;
//         console.log("decode token:", decoded)
//         // console.log(userEmail, "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
//         next()

//     }
//     else{

//         res.json({error:"internal sever error try to login up again"})

//     }
// }


// app.listen(port, () => {
//     console.log(`server connet with ${port}`)
// })