import express from "express";
import  verifyToken  from "../middleware/userMIddleWare.js";
import { toDoDelete, todoLogin, toDoSignUp, toDoUpdate } from "../controller/todo-controller.js";

const todorouter=express.Router();

todorouter.get("/home",verifyToken,toDoSignUp);
todorouter.post("/toDo",verifyToken,todoLogin);
todorouter.patch("/upd",verifyToken,toDoUpdate);
todorouter.delete("/del",verifyToken,toDoDelete);

export default todorouter;