import express from "express";
import bodyParser from "body-parser";
// import bcrypt from "bcrypt";
// import db from "../src/config/db.js";
import dotEnv from "../src/config/enviroment.js";
// import env from 'dotenv'
import userRouter from "../src/api/routes/user.js";
import todorouter from "../src/api/routes/toDo.js";


// const serverStart = () => {

    const app = express();
    const port = dotEnv.PORT;
    // console.log(port, "port---------");
    //middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());

    //routs
    app.use("/user", userRouter);
    app.use("/toDo", todorouter);

    // //connection
    app.listen(port, (error) => {
        if (error) {
            console.log(error)
        } else {

            console.log(`server is listen on ${port}`)
        }
    })

// };
export  {app,port};

