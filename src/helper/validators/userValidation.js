import {body } from "express-validator";
import express from "express"
const signUpValidation=()=>[
        
        body('name').notEmpty().withMessage('Name is required'),
        
        body('email').isEmail().withMessage('enter valid email address'),
        
        body('password').isLength({ min: 8 }).withMessage("password lenth should be atleast 8 char")
        // .matches(passdRegex).withMessage("enter valid pass (Ex=Demo123DEno),atleat 8 character of one uper case,one lower case and one diggit")
]
// console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

const loginVAlidation= ()=> [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 8 }).withMessage('password lenth should be atleast 8 char ,')
];   




export{signUpValidation,loginVAlidation}
