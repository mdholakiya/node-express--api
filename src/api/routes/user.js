import express from "express";
// import verifyToken  from "./middleware/userMiddleWare.js";
import verifyToken from "../../middleware/userMiddleWare.js";
import { getUser, user,userDelete, userLOgin, userSignUp,userUpdate } from "../controller/user.js";
import { signUpValidation,loginVAlidation } from "../../helper/validators/userValidation.js";


const userRouter=express.Router();

userRouter.get("/",user);
userRouter.post("/signup",signUpValidation(),userSignUp)
userRouter.post("/login",loginVAlidation(),userLOgin)
userRouter.get("/data",verifyToken,getUser)
userRouter.patch("/update",verifyToken,userUpdate)
userRouter.delete("/delete",verifyToken,userDelete)


export default userRouter