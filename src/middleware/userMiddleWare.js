import jwt from "jsonwebtoken";
import dotEnv from "../config/enviroment.js";
// import env from 'dotenv'

//jwt token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    // console.log(bearerHeader);

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ")[1]
        // console.log(bearer, "----------------------------------");
        req.token = bearer;
        console.log(req.token);

        const decoded = jwt.verify(req.token, dotEnv.SECRET);
          req.id = decoded.id;
          req.email = decoded.email;
        console.log("decode token:", decoded)
        // console.log(userEmail, "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
        next()

    }
    else{

        res.json({error:"internal sever error try to login up again"})

    }
}


export default verifyToken;