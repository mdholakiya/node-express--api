import express from "express";
// import verifyToken  from "./middleware/userMiddleWare.js";
import verifyToken from "../../middleware/userMiddleWare.js";
import { user,userDelete, userLOgin, userSignUp,userUpdate } from "../controller/user.js";
const userRouter=express.Router();

userRouter.get("/",user);
userRouter.post("/signup",userSignUp)
userRouter.post("/login",userLOgin)
userRouter.patch("/update",verifyToken,userUpdate)
userRouter.delete("/delete",verifyToken,userDelete)


export default userRouter