import {pg,pool} from "pg";

const user=(req,res)=>{
    res.status(200).send("welcome to user page")
}

const registration= async (req,res)=>{
    const {name,email,password,city,age} = req.body;

    if(!name){
        return res.status(400).send("name is require")
    }
    if(!email){
        return res.status(400).send("email is require")
    }
    if(!password){
        return res.status(400).send("password is require") 
    }
    else{
        try {
            const result = await pool.query(
            'INSERT INTO users (name, email, password, city, age) VALUES ($1, $2, $3, $4, $5)',
            [name, email, password, city, age]
            );
            console.log({name,email,password,city,age})
            return res.status(201).json("inserted");
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    }   
}


 
export {user,registration}