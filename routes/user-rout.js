import express from "express";
import { registration, user } from "../controller/user.js";

const router=express.Router()

router.get("/",user)
router.post("/signup",registration)




export default router