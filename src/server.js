import express from "express";
import bodyParser from "body-parser";
// import bcrypt from "bcrypt";
import dotEnv from "../src/config/env.js";
import db from "../src/config/db.js";
import userRouter from "../src/api/routes/user.js";
import todorouter from "../src/api/routes/toDo.js";



const app = express();
const port=dotEnv.PORT ||3000;

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 

//routs
app.use("/user", userRouter);
app.use("/toDo",todorouter);

// //connection
//     app.listen(port,()=>{
//         if(error){
//             console.log(error)
//         }else{
    
//             console.log(`server is listen on ${port}`)
//         }
//     })
// }

export{app,port};