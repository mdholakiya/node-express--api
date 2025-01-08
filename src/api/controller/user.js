// import {pg,pool} from "pg"
// importpress"; express from "ex
import db from "../../config/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {body,validationResult} from "express-validator";
import { getUserByEmail,insertUserData,updateUserData,deleteUserData } from "../../helper/userHelper.js";

let passdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
// const contactRegex=/^[0-9]{10}$/;

//for demo
const user = (req, res) => {
    console.log("homepage")
    res.status(200).send("welcome to user page")
}
//signup
 const userSignUp= async(req, res) => {
     const { name, email, password } = req.body;
    [
        body('email').isEmail().withMessage('enter valid email address'),
    
        body('password').isLength({ min: 8 }).withMessage("enter valid pass (Ex=Demo@123),atleat 8 character"),
    
        body('name').notEmpty().withMessage('Name is required')
    ]
    console.log({name,email,password});

    const err = validationResult(req);
    if (err.isEmpty()==false) {  //(!err.isEmpty())
        return res.status(400).json({ err: err.array() });
    }
    
    if(!passdRegex.test(password)){
        return res.status(404).json({mesage:"enter unique pass which include alterat one uper case,one lower case and one diggit"})
    }
    try {
       const userByEmail= await getUserByEmail(email)
        console.log(result, "/////////////////////////////////")
        if (result.rows.length > 0) {
            return res.send("user already exist try to login")
        }
        else {
            const hashpass = await bcrypt.hash(password, 10);
            console.log(hashpass);
            const insertUser =  await insertUserData(name,email,hashpass);
            console.log({ name, email, password }, "stored");
            return res.status(200).json({ name, email,password,message:"data added successfully",success:"true" });
        }

    } catch (error) {
        console.log("error", error);
         res.status(500).json({message:"internal server error",sucess:"false"});
    }
};

//login
const userLOgin= async(req, res) => {
    const { email, password } = req.body;
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 8 }).withMessage('enter valid password ,password is require')];

    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ err: err.array() });
    }

    try {
        const userByEmail= await getUserByEmail(email)
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "user not found,enter correct email" })
        }
        const isMatch = await bcrypt.compare(password, userByEmail.password);
        if (!isMatch) {
            return res.status(401).json({ message: "invalid password ,please try again" })
        }
        else{

            jwt.sign ({ id: userByEmail.id, email }, secret_key, { expiresIn: "1d" }, (err, token) => {
               console.log( "email:",email,"pass:", password,"toekn:", token);
               res.status(200).json({ token, email, password, message: "welcome to home page" });
           });
        }

    } catch (error) {
        console.log("error", error);
         res.status(500).send("internal server error");
    }
};

//update
const userUpdate=async(req, res) => {
    const userByEmail = await getUserByEmail(email)
    console.log(userByEmail,"llllllllllllllllllllllllllllllll")
    let { name, email, password } = req.body;
    if(!name && !email && !password){
        return res.status(404).json({message:"enter atleast one field for update "})
    }
    if(name==="" || name.trim()==""){
        return res.status(404).json({message:"enter valid name"})
    }
    if (!name){
     // return res.status(400).json({ message: "Name cannot be empty" }
        name=userByEmail.name;
    }
    if (password=="" ||!passdRegex.test(password)) {
        return res.status(400).json({ 
          message: "Enter a valid password (min 8 characters, include at least one uppercase, one lowercase, and one digit)" 
        });
      }
    if(!password){
        password = userByEmail.password
    }

    if (email && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        return res.status(400).json({ message: "Enter a valid email address" });
      }
    if(!email){
        email = result.rows[0].email
    }
    try {
        let hashpass="";
        if(!password.includes("$")){
             hashpass = await bcrypt.hash(password, 10);
        }
        const updateUser =await updateUserData(name,email,password,cus_id)
        console.log(name, email, password,"updated users")
        return res.status(200).json({name, email, password, message: "uupdated stored" })
    } catch (error) {
     return   res.status(500).json({ message: "internal server error" })
    }
}

//delete
const userDelete= async (req, res) => {
    const {email}=req.body;
    const userByEmail= await getUserByEmail(email)
    req.email=email;
    console.log(req.email,"//////////////////////////////////")
    if(email !==userByEmail.email){
        res.status(400).json({message:"enter updated email"})
    }
    try {
        const deleteUser = await deleteUserData(id)
        //    console.log(result.rows[0].id);

        res.status(200).json({ message: "user deleted successfully" })


    } catch (error) {
        res.status(404).json({ message: "data not deleted" })
    }

}

export { user,userSignUp ,userLOgin,userUpdate,userDelete}