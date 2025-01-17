import express from "express";
import  verifyToken  from "../../middleware/userMiddleWare.js";
import { toDoDelete, toDoGet, todoLogin, toDoUpdate } from "../controller/todo.js";

const todorouter=express.Router();


todorouter.use(verifyToken);

todorouter.post("/add",todoLogin);
todorouter.get("/data",toDoGet);
todorouter.patch("/upd",toDoUpdate);
todorouter.delete("/del",toDoDelete);

export default todorouter;