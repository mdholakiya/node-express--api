// import {pg,pool} from "pg"
// import express from "express";


//for demo
const user=(req,res)=>{
    console.log("homepage")
    res.status(200).send("welcome to user page")
}
export {user}