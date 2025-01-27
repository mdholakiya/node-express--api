import pg from "pg"
// import db from "./config/db"

const db = new pg.Client({
    host: "localhost",
    port : 5432,
    user: "postgres",
    password: "DESKTOP1",
    database: "API"
})

    db.connect();

   db.query("Select * from demo",(err,res)=>{

          if(!err){
            console.log(res.rows);
           } else{
               console.log(err.message)
          }
       db.end;
   }
   )
