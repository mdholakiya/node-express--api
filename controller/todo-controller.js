import db from "../configs/db.js"
import dotEnv from "../configs/env.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {body,validationResult} from "express-validator";

const toDoSignUp=async(req, res) => {
    const {email}=req.body;
    // console.log(req.email);
    const result=await db.query("SELECT * FROM users WHERE email=$1",[email])
    if(email!==result.rows[0].email ||!email){
        res.status(404).json({ message: " emiail is require ,enter you updated email " })
    }else{
        res.status(200).json({message:"welcome.... now you can edit your todo"})
    }
    
}

//signup
const todoLogin= async (req, res) => {
    const { email, city, age, contact } = req.body;
    // console.log(req.email)
    const result=await db.query("SELECT * FROM users WHERE email=$1",[email])
    console.log(result.rows[0].email)
    if( !email || email!==result.rows[0].email){
        res.status(400).json({mesage:" email field should not be empty ,enter valid and updated email "})
    }
    if ( !city || !age || !contact) {
        return res.status(404).send(" fillup all the fields for add details");
    }
    if(!contactRegex.test(contact)){
        res.status(404).json({message:"contact shold be 10 digit only "})
    }
    
    
    try {
        const result = await db.query("INSERT INTO todo (cus_id,email,city,age,contat) VALUES ($1,$2,$3,$4,$5) RETURNING *",
            [req.id, email, city, age, contact]);
        // console.log(result)
        if (result.rows[0].email ===email) {
            console.log(result.rows[0]);
            return res.status(200).json({ data: result.rows[0], mesage: "data added successfully" })
        }

    } catch (error) {
        res.status(500).json(error)
    }

}

//update
const toDoUpdate =async (req, res) => {
    const { email, city, age, contact } = req.body;
    if ( !city && !age && !contact) {
        return res.status(404).send("enter atleast one filed to update details");
    }
    const result=await db.query("SELECT * FROM users WHERE email=$1",[email])
    if( !email || email!==result.rows[0].email){
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
}

//delete
const toDoDelete= async (req, res) => {
    const {email}=req.body;
    const result=await db.query("SELECT * FROM users WHERE email=$1",[email])
    if(!email ||email==!result.rows[0].email){
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

}


export {toDoSignUp,todoLogin,toDoUpdate,toDoDelete}