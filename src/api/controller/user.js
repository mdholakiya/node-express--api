// import {pg,pool} from "pg"
// importpress"; express from "ex
import db from "../../config/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {body,Result,validationResult} from "express-validator";
import dotEnv from "../../config/enviroment.js";

let passdRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
let emailREgex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/

//for user home page
const user = (req, res) => {
    console.log("homepage")
    res.status(200).json({message:"welcome to user page"})
}

//signup
const userSignUp= async(req, res) => {
    const { name, email, password } = req.body;
    const err = validationResult(req);
    if (!err.isEmpty()) { 
        console.log(err.array())
        return res.status(400).json({ err: err.array() });
    }
    try {
    
    if(!passdRegex.test(password)){
        return res.status(404).json({mesage:"enter unique pass which include alterat one uper case,one lower case and one diggit"})
    }
       const result=await db.query("SELECT * FROM users WHERE email=$1",[email]);
       let user=result.rows[0]
        if (user) {
            return res.send("user already exist try to login")
        }
        else {
            const hashpass = await bcrypt.hash(password, 10);
            console.log(hashpass);  
            const result= await db.query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *", [name, email, hashpass]);
            console.log({ name, email, hashpass }, "stored");
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
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ err: err.array() });
    }
    const result=await db.query("SELECT * FROM users WHERE  email=$1 ",[email]);
    const users=result.rows[0]
    console.log(users,"kkkkkkkkkkkkkkkkkkk")
    try {
        if (!users || email !==user.email) {
            return res.status(400).json({ message: "user not found,enter valid email" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "invalid password,try again ,enter valid password" })
        }
        else{

            jwt.sign ({ id: user.id, email }, dotEnv.SECRET, { expiresIn: "1d" }, (err, token) => {
               console.log( "email:",email,"id:",user.id,"token:", token);
               res.status(200).json({message: "welcome to home page", token,user });
           });
        }

    } catch (error) {
        console.log("error", error);
         res.status(500).send("internal server error");
    }
};
//get user
const getUser=async(req,res)=>{
    try{
        const {email}=req.body;
        const result=await db.query('SELECT * FROM users where id =$1  ',[req.id])
        let user=result.rows[0]
        if( email ==user.email && user.id==req.id){
            res.status(200).json({message:"here is your  details",user})
        }
        else{
            res.status(400).json({message:"enter valid email"})
        }
    }catch(error){
        res.status(404).json({err:error})
    }
}

//update
const userUpdate=async(req, res) => {
    let { name, email, password } = req.body;
    try {
    const result=await db.query("SELECT * FROM users WHERE id=$1",[req.id]);
    const user=result.rows[0]
    if(!name && !email && !password){
        return res.status(404).json({message:"enter atleast one field for update "})
    }
    if(name==="" || name.trim()===""){
        return res.status(404).json({message:"enter valid name"})
    }
    if (password && !passdRegex.test(password)) {
        return res.status(400).json({ 
          message: "Enter a valid password (min 8 characters, include at least one uppercase, one lowercase, and one digit)" 
        });
    }
    if (email && !(emailREgex.test(email))) {
        return res.status(400).json({ message: "Enter a valid email address" });
    }
    if (!name){
        // return res.status(400).json({ message: "Name cannot be empty" }
        name= user.name;
    }
    if(!password){
        password= user.password
    }
        // console.log("here")

    if(!email){
       email=user.email
    }
        let hashpass="";
        if(!password.includes("$")){
             hashpass = await bcrypt.hash(password, 10);
        }
        const updatedResult=await db.query("UPDATE users SET name=$1,email=$2,password=$3 WHERE id=$4 RETURNING * ", [name, email, hashpass ==="" ? password : hashpass , req.id]);
        console.log(name, email, password,"updated users");

        return res.status(200).json({name, email, password, message: "updated stored" })
    } catch (error) {
     return   res.status(500).json({ message: "internal server error" })
    }
}

//delete
const userDelete= async (req, res) => {
    const {email}=req.body;
    const result=await db.query("SELECT * FROM users WHERE id=$1",[req.id]);
    console.log(result.rows[0].email,"//////////////////////////////////")
    try {
        if(email !==result.rows[0].email){
            res.status(400).json({message:"enter updated email"})
        }
            const deleteResult=await db.query("DELETE FROM users WHERE id=$1 RETURNING *",[req.id]);
            console.log(deleteResult.rows[0])
            res.status(200).json({ message: "user deleted successfully" })

        
    } catch (error) {
        res.status(404).json({ message: "data not deleted", error: error })
    }

}

export {user,userSignUp ,userLOgin,getUser,userUpdate,userDelete}