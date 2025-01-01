import express from "express";
import bodyParser from "body-parser";
// import bcrypt from "bcrypt";
import db from "./configs/db.js";
import dotEnv from "./configs/env.js";
import userRouter from "./routes/userRout-rout.js";
import todorouter from "./routes/toDoRout.js";


const app = express();
const port=dotEnv.PORT;

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
   
//routs
app.use("/users", userRouter);
app.use("/toDo",todorouter);


app.listen(port, () => {
    console.log(`server connet with ${port}`)
})

