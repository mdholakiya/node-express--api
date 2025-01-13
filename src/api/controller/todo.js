import db from "../../config/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from "express-validator";

let contactRegex = /^(0|(\+91))?[7-9][0-9]{9}$/;

//login
const todoLogin = async (req, res) => {
    const { email, title, discription, contact } = req.body;
    // console.log(req.email)
    try {
        const result = await db.query("SELECT * FROM users WHERE id=$1", [req.id]);
        const user = result.rows[0]

        if (!email || email !== result.rows[0].email) {
            res.status(400).json({ mesage: " email field should not be empty ,enter valid and updated email " })
        }
        if (!title || !discription || !contact) {
            return res.status(400).send(" fillup all the fields for add details");
        }
        if (!contactRegex.test(contact)) {
            res.status(404).json({ message: "contact shold be 10 digit only ex:+91 1234567891 " })
        }
        if (email == user.email) {
            console.log("gggggggggggggggggggggggggggggggggggg")
            const todo=await db.query("SELECT * FROM todo WHERE cus_id=$1 AND title=$2 ",[user.id,title])
            if(!todo.rows[0]){
                const insertToDo = await db.query("INSERT INTO todo  (cus_id,email,contat,title,discription) VALUES($1,$2,$3,$4,$5) ",
                    [user.id,user.email,contact, title, discription]);
                    const todo=await db.query("SELECT * FROM todo WHERE cus_id=$1 AND title=$2 ",[user.id,title])
                    let todoUser = todo.rows[0]
                    console.log( todoUser, "added");
                    return res.status(200).json({todoUser,message: "data added successfully" })
                }
                if(todo.rows[0].title ==title){
                    res.status(400).json({message:"todo item already exist"})
                    console.log("todo item already exist")
            }
        }
        
    } catch (error) {
        res.status(500).json(error)
    }

}

//get todo data
const toDoSignUp = async (req, res) => {
    const { email } = req.body;
    const result = await db.query("SELECT * FROM todo WHERE cus_id=$1 ", [user.id]);
    console.log(result.rows[0].email)
    if (email !== result.rows[0].email || !email) {
        console.log("error")
        res.status(404).json({ message: " emiail is require ,enter you updated email ", })
    } else {
        console.log("done")
        res.status(200).json({ message: "welcome.... now you can add your todo" })
    }

}

//update
const toDoUpdate = async (req, res) => {
    const { email,contact, title, discription  } = req.body;
    try {
        const result = await db.query("SELECT * FROM users WHERE id=$1", [req.id]);
        const user=result.rows[0]

        let todo = await db.query('SELECT * FROM  todo WHERE cus_id=$1 ', [user.id])
        let todoUser = todo.rows[0]
        console.log(todoUser,"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")

        if (!email || email !== result.rows[0].email) {
            res.status(400).json({ mesage: " email field should not be empty ,ennter valid email " })
        }
        if (!title && !discription && !contact) {
            res.status(404).json({ message: "atleast one field is requuire to update details" });
        }
                    if(todoUser.id){
                        const updatedToDo = await db.query( "UPDATE todo SET email = $1, contat = COALESCE($2, contat), title = COALESCE($3, title), discription = COALESCE($4, discription) WHERE cus_id = $5 AND id=$6 RETURNING *",
                        [user.email, contact || todoUser.contat, title || todoUser.title, discription || todoUser.discription, user.id ,todoUser.id ] );
                        let updated=updatedToDo.rows[0];
                        console.log(updated)
                        return res.status(200).json({ message: "updated",updated})  
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
    const result = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (!email || email == !result.email) {
        res.status(404).json({ message: "enter updated email" })
    }
    try {
        const result = await db.query("DELETE FROM todo WHERE cus_id=$1", [req.id]);
        // if(!result.rows[0]){
        //     return res.status(404).json({message:"user not found,enter valid details"})
        // }
        console.log("deleted", result);
        return res.status(200).json({ message: "deleted" })
    } catch (error) {
        res.status(500).json({ message: "internal server error,try to login" })
    }

}


export { toDoSignUp, todoLogin, toDoUpdate, toDoDelete }