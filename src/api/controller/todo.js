import db from "../../config/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from "express-validator";
import { userById ,postData,dataById,dataByIdTitle, deleteData, updateData, dataById1} from "../../database/model/todo.js";

let contactRegex = /^(0|(\+91))?[7-9][0-9]{9}$/;

//login
const todoLogin = async (req, res) => {
    const { email, title, discription, contact } = req.body;
    try {
        const user =await userById(req.id)
       
        if (!email || email !== user.email) {
            res.status(400).json({ mesage: " email field should not be empty ,enter valid and updated email " })
        }
        if (!title || !discription || !contact) {
             res.status(400).send(" fillup all the fields for add details");
        }
        if (contact && !contactRegex.test(contact)) {
            res.status(404).json({ message: "contact shold be 10 digit only ex:+91 1234567891 " })
        }
        if (email == user.email) {
            let todo= await dataByIdTitle(user.id,title)
            if(!todo){
                let todoPost=await postData(user.id,user.email,contact,title,discription)
                // let todoUser = todo.rows[0]
                console.log( email,contact,title,discription, "added");
                return res.status(200).json({message: "data added successfully",email,contact,title,discription })
            }
                if(todo.title ==title){
                    console.log("todo item already exist")
                    return res.status(400).json({message:"todo item already exist"})
            }
        }
        
    } catch (error) {
        res.status(500).json(error)
    }

}

//get todo data
const toDoGet = async (req, res) => {
    const { email } = req.body;
    const user=await userById(req.id)
    if (email !== user.email || !email) {
        console.log("error")
        res.status(404).json({ message: " emiail is require ,enter you updated email ", })
    } else {
        const todo=await dataById(user.id)
        res.status(200).json({message: "here is your all todo items",todo })
    }

}

//update
const toDoUpdate = async (req, res) => {
    const { email,contact, title, discription  } = req.body;
    try {
        const user= await userById(req.id)
        let todo = await dataById1(user.id)
        console.log(todo,"llllllllllll")
        

        if (!email || email !== user.email) {
            res.status(400).json({ mesage: " email field should not be empty ,ennter valid email " })
        }
        if (!title && !discription && !contact) {
            res.status(404).json({ message: "atleast one field is requuire to update details" });
        }
                    if(todo){
                        const todoUpdate = await updateData(user.email,contact,title,discription,user.id,todo.id)
                        return res.status(200).json({ message: "updated",todoUpdate})  
                    }else {
                        console.log("User ID mismatch, cannot update todo."); 
                        return res.status(403).json({ message: "User not authorized to update this todo." });
                    }
                    
                } catch (error) {
        res.status(500).json({ message: "internal servar error" })
    }

}

//delete
const toDoDelete = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userById(req.id)
        if (!email || email !== user.email) {
        res.status(404).json({ message: "enter updated email" })
    }else{

        const data = deleteData(user.id);
        console.log("deleted", data);
        return res.status(200).json({ message: "deleted" })
    }
    } catch (error) {
        res.status(500).json({ message: "internal server error,try to login" })
    }

}

export { toDoGet, todoLogin, toDoUpdate, toDoDelete }