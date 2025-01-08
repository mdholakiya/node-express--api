import db from "../../config/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {body,validationResult} from "express-validator";
import { getUserByEmail,insertTOData,updateToDoData,deleteToDoData } from "../../helper/toDoHelper.js";

//signup
const toDoSignUp=async(req, res) => {
    const {email}=req.body;
    // console.log(req.email);
   const userByEmail= await getUserByEmail(email);
       if(email!==userByEmail.email ||!email){
           res.status(404).json({ message: " emiail is require ,enter you updated email " })
       }else{
           res.status(200).json({message:"welcome.... now you can edit your todo"})
       }
       
   }

//login
const todoLogin= async (req, res) => {
    const { email, city, age, contact } = req.body;
    // console.log(req.email)
    const userByEmail= await getUserByEmail(email);
    console.log(userByEmail.email)
    if( !email || email!==userByEmail.email){
        res.status(400).json({mesage:" email field should not be empty ,enter valid and updated email "})
    }
    if ( !city || !age || !contact) {
        return res.status(404).send(" fillup all the fields for add details");
    }
    if(!contactRegex.test(contact)){
        res.status(404).json({message:"contact shold be 10 digit only "})
    }
    
    
    try {
        const InsertData= await insertTOData(cus_id, email, city, age, contact)
        // console.log(result)
        if (userByEmail.email ===email) {
            console.log(userByEmail);
            return res.status(200).json({ data:InsertData, mesage: "data added successfully" })
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
    const userByEmail= await getUserByEmail(email);
    if( !email || email!==userByEmail.email){
        res.status(400).json({mesage:" email field should not be empty ,ennter valid email "})
    }
    
    try {
        const updateData=await updateToDoData(email,city,age,contact,cus_id);
            console.log( "data:",updateData)
                res.status(200).json({ message: "updated",email,city,age,contact})
        
    } catch (error) {
        res.status(500).json({message:"internal servar error"})
    }
}

//delete
const toDoDelete= async (req, res) => {
    const {email}=req.body;
    const userByEmail= await getUserByEmail(email);
    if(!email ||email==!userByEmail.email){
        res.status(404).json({message:"enter updated email"})
    }
    try {
        const deleteData=await deleteToDoData(cus_id);
        // if(!result.rows[0]){
        //     return res.status(404).json({message:"user not found,enter valid details"})
        // }
        console.log("deleted",deleteData);
        return res.status(200).json({ message: "deleted" })
    } catch (error) {
        res.status(500).json({ message: "internal server error,try to login" })
    }

}


export {toDoSignUp,todoLogin,toDoUpdate,toDoDelete}