import jwt from "jsonwebtoken";
import dotEnv from "../config/enviroment.js";
// import env from 'dotenv'

//jwt token
function verifyToken( req, res, next) {
 
    const bearerHeader = req.headers["authorization"];
    // console.log(bearerHeader);

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ")[1]
        // console.log(bearer, "----------------------------------");
        req.token = bearer;
        console.log(req.token);
            const decoded = jwt.verify(req.token, dotEnv.SECRET);
            console.log("decode token:", decoded)
            req.id = decoded.id;
            req.email = decoded.email;
            // console.log(userEmail, "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
            next()

            
        }
        else{
            res.json(404).json({message:"try to login again"})
        }
    // } catch (error) {
    //     res.status(403).json({ error: "token expore try to login" })
    // }

}


export default verifyToken;