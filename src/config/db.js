import pg from "pg";
// import env from 'dotenv'
import dotEnv from "./enviroment.js";

// const db = new pg.Client({
//   user:dotEnv.PG_USER,
//   password: dotEnv.PG_PASSWORD,
//   database: dotEnv.PG_DATABASE,
//   host: dotEnv.PG_HOST,
//   port:dotEnv.PG_PORT,
// });  

  // const db = new pg.Client({
  //     user:dotEnv.USER,
  //     host:dotEnv.HOST,
  //     database:dotEnv.DATABASE,
  //     password:dotEnv.PASSWORD,
  //     port:dotEnv.P_PORT
  // });
  // console.log(process.env,"env--------------");

  
//local db

// const db = new pg.Client({
//     user:dotEnv.USER,
//     host:dotEnv.HOST,
//     database:dotEnv.DATABASE,
//     password:dotEnv.PASSWORD,
//     port:dotEnv.P_PORT
// });


//live db
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized:false,
  }
});


db.connect(err => {
  if(err){
    console.log("Some error occured while connecting to the DB", err);
  }else{
    console.log("Db connected successfully");
  } 
}); 
   
export default db;