import db from "../../config/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from "express-validator";
import { userById ,postData,dataById,dataByIdTitle, deleteData} from "../../database/model/todo.js";
import { updateData } from "../../database/model/user.js";

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
            // console.log("gggggggggggggggggggggggggggggggggggg")
            // const todo=await db.query("SELECT * FROM todo WHERE cus_id=$1 AND title=$2 ",[user.id,title])
            let todo= await dataByIdTitle(user.id,title)
            if(!todo){
                // const insertToDo = await db.query("INSERT INTO todo  (cus_id,email,contat,title,discription) VALUES($1,$2,$3,$4,$5) ",
                //     [user.id,user.email,contact, title, discription]);
                let postUser=await postData(user.id,email,contact,title,discription)
                // let todoUser = todo.rows[0]
                console.log( email,contact,title,discription, "added");
                // const todo=await dataByIdTitle(user.id,title)
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
    // const result = await db.query("SELECT * FROM users WHERE id=$1 ", [req.id]);
    const user=await userById(req.id)
    // const data=await db.query("SELECT * FROM todo WHERE cus_id=$1",[result.id])
    if (email !== user.email || !email) {
        console.log("error")
        res.status(404).json({ message: " emiail is require ,enter you updated email ", })
    } else {
        // const data=await db.query("SELECT * FROM todo WHERE cus_id=$1",[user.id])
        const todo=await dataById(user.id)
        // let todoData=todo;
        // console.log(todo)
        res.status(200).json({message: "here is your all todo items",todo })
    }

}

//update
const toDoUpdate = async (req, res) => {
    const { email,contact, title, discription  } = req.body;
    try {
        const user= await userById(req.id)
        // console.log(user.email)
        // let todoUser = todo.rows[0]
        
        if (!email || email !== user.email) {
            res.status(400).json({ mesage: " email field should not be empty ,ennter valid email " })
        }
        if (!title && !discription && !contact) {
            res.status(404).json({ message: "atleast one field is requuire to update details" });
        }
        let todo = await dataById(user.id)
        console.log(todo)
                    if(todo.lem){
                        // const updatedToDo = await db.query( "UPDATE todo SET email = $1, contat = COALESCE($2, contat), title = COALESCE($3, title), discription = COALESCE($4, discription) WHERE cus_id = $5 AND id=$6 RETURNING *",
                        // [user.email, contact || todoUser.contat, title || todoUser.title, discription || todoUser.discription, user.id ,todoUser.id ] );
                        // let updated=updatedToDo.rows[0];
                        // console.log(updated)
                        const todoUpdate = await updateData(user.email,contact,title,discription,req.id)
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
        // console.log(user,"llllllllllllllllllllllllllllllllllllllllll")
        if (!email || email !== user.email) {
        res.status(404).json({ message: "enter updated email" })
    }else{

        const data = deleteData(user.id);
        // if(!result.rows[0]){
        //     return res.status(404).json({message:"user not found,enter valid details"})
        // }
        console.log("deleted", data);
        return res.status(200).json({ message: "deleted" })
    }
    } catch (error) {
        res.status(500).json({ message: "internal server error,try to login" })
    }

}


export { toDoGet, todoLogin, toDoUpdate, toDoDelete }