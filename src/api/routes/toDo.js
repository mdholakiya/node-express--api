import express from "express";
import  verifyToken  from "../../middleware/userMiddleWare.js";
import { toDoDelete, todoLogin, toDoSignUp, toDoUpdate } from "../controller/todo.js";

const todorouter=express.Router();


todorouter.use(verifyToken);

todorouter.get("/data",toDoSignUp);
todorouter.post("/add",todoLogin);
todorouter.patch("/upd",toDoUpdate);
todorouter.delete("/del",toDoDelete);

export default todorouter;