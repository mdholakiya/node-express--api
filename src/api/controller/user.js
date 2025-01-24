import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from "express-validator";
// import { signUpValidation } from '../../helper/validators/userValidation.js';
import dotEnv from "../../config/enviroment.js";
import { checkData, checkDataByIdEmail, checkUserId, deleteData, postData, updateData } from "../../database/model/user.js";
import { signUpValidation,loginVAlidation } from '../../helper/validators/userValidation.js';

let passdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
let emailREgex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//for user home page
const user = (req, res) => {
    console.log("homepage")
    res.status(200).json({ message: "welcome to user page" })
}

//signup
const userSignUp = async (req, res) => {
    const { name, email, password } = req.body;
    const err = validationResult(req);
    if (!err.isEmpty()) {
        // console.log(err.array(),"kkkkkkkkkkkkkk")
        return res.status(404).json({ err: err.array() });
    }
    try {
        //SIMULATE ERROR FOR 500 CODE TEST CASE
        if (req.body.simulateError){ throw new Error('Simulated error'); }

        if (!passdRegex.test(password)) {
            return res.status(404).json({ message: "enter unique pass which include alterat one uper case,one lower case and one diggit" })
        }
        let user = await checkData(email);
        if (user) {
            return res.status(403).json({ message: "user already exist try to login" })
        }
        else {
            const hashpass = await bcrypt.hash(password, 10);
            let newUser = await postData(name, email, hashpass)
            // console.log(newUser, "stored");
            return res.status(200).json({ newUser, message: "user created successfully", });
        }

    } catch (error) {
        // console.log("error", error);
        res.status(500).json({ message: "internal server error", success: "false" ,});
    }
};

//login
const userLOgin = async (req, res) => {
    const { email, password } = req.body;
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ err: err.array() });
    }
    const user = await checkData(email)
    try {
        if (!user || email !== user.email) {
            return res.status(400).json({ message: "user not found,enter valid email" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "invalid password,try again ,enter valid password" })
        }
        else {

            jwt.sign({ id: user.id, email }, dotEnv.SECRET, { expiresIn: "2d", }, (err, token) => {

               // console.log("email:", email, "id:", user.id, "token:", token);
                res.status(200).json({ message: "welcome to home page", token, user });
            });
        }

    } catch (error) {
        console.log("error", error);
        res.status(500).send("internal server error");
    }
};
//get user
const getUser = async (req, res) => {
    let { email } = req.body;
    try {
        let user = await checkDataByIdEmail(req.id, email)
        if (email === user.email && user.id == req.id) {
            res.status(200).json({ message: "here is your  details", user })
        }
        else if (email !== user.email) {
            res.status(403).json({ message: "enter valid email,email is require" })
        }
    } catch (error) {
        res.status(404).json(error)
    }
}

//update
const userUpdate = async (req, res) => {
    let { name, email, password } = req.body;
    try {
        if (!name && !email && !password) {
            return res.status(400).json({ message: "enter atleast one field for update " })
        }
        if (name === "" || name.trim() === "") {
            return res.status(400).json({ message: "enter valid name" })
        }
        if (password && !passdRegex.test(password)) {
            return res.status(400).json({
                message: "Enter a valid password (min 8 characters, include at least one uppercase, one lowercase, and one digit)"
            });
        }
        if (email && !(emailREgex.test(email))) {
            return res.status(400).json({ message: "Enter a valid email address" });
        }
        let user = await checkUserId(req.id)
        let newName = user.name; 
        let newEmail = user.email; 
        let newPass = user.password;
        if (name) newName = name
        if (email) newEmail = email
        if (password) newPass = await bcrypt.hash(password, 10)

        const updateUser = await updateData(newName, newEmail, newPass || password, req.id)
       // console.log(updateUser, "updated users");
        return res.status(200).json({ updateUser, message: "updated stored" })
    } catch (error) {
        return res.status(500).json({ error: error, message: "internal server error" })
    }
}

//delete
const userDelete = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await checkDataByIdEmail(req.id,email)
        if (email !== user.email) {
            res.status(400).json({ message: "enter updated email" })
        } else {
            const deleteUser = await deleteData(req.id)
            res.status(200).json({ message: "user deleted successfully" })
        }
    } catch (error) {
        res.status(404).json({ message: "data not deleted", error: error })
    }

}

export { user, userSignUp, userLOgin, getUser, userUpdate, userDelete }