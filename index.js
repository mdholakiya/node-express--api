import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pg from "pg";
import router from "./routes/user-rout.js";


env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
});
db.connect();

const sectet_key = "mansi1234"
const app = express();
const port = 4999;


//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

//routs
app.use("/home", router)

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(404).send("name email and password is require")
        }
        const result = await db.query("SELECT * FROM users WHERE email=$1", [email])
        if (result.rows.length > 0) {
            res.send("user already exist try to login")
        }
        else {
            const hashpass = await bcrypt.hash(password, 10)
            const result = await db.query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *", [name, email, hashpass]);
            console.log(result.rows[0], "stored");
            return res.status(200).send(result.rows[0]);
        }
    } catch (error) {
        console.log("error", error);
        return res.status(500).send("internal server error");
    }
})


app.post("/login", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(404).send(" email and password is require")
    }
    try {
        jwt.sign({ name, email, password }, sectet_key, { expiresIn: "300s" }, (err, token) => {
            res.status(200).json({ token, name, email, password })
            console.log({ email, password });
        });
        // const result = db.query('SELECT * FROM users WHERE email=$1 AND password=$2', [email, hashpass])
        // const ischeck = await bcrypt.compare(password, hashpass);

        // // if (ischeck) { res.send("welcome to our page")}
    } catch (error) {
        console.log("error", error);
        return res.status(500).send("internal server error");
    }
})
//to-do crup operation


app.post("/to-do", verifyUser, (req, res) => {
    const { name, city, age } = req.body
    const result = db.query("INSERT INTO  todo (name,city,age) VALUES ($1,$2,$3) RETURNING *",[name,city,age]);
    res.status(200).send(result.rows[0])

    jwt.verify(req.token, sectet_key, (err, data) => {
        if (err) {
            res.send("authorization error,try to login")
        } else {
            res.json({ mess: "access", data })
        }
    })
});


function verifyUser(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader)
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ")
        console.log(bearer);
        const token = bearer[1];
        req.token = token;
        next();
    }
    else {
        res.json("token expire")
    }

}

app.listen(port, () => {
    console.log(`server connet with ${port}`)
})