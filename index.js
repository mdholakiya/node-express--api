import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import {Pool,pg} from "pg";
import router from "./routes/user-rout.js";
env.config();

const pool = new Pool.Client ({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
})
pool.connect()
const app = express();
const port = process.env.PORT || 4999;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())


// app.use(model)
app.use("/user",router)

app.listen(port,()=>{
    console.log(`server connet with ${port}`)
})