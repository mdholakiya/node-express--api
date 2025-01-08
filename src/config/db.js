import pg from "pg";
// import env from 'dotenv'
import dotEnv from "./enviroment.js";


// env.config()
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
  
  const db = new pg.Client({
    user:dotEnv.USER,
    host:dotEnv.HOST,
    database:dotEnv.DATABASE,
    password:dotEnv.PASSWORD,
    port:dotEnv.PORT
});

// db.connect();
  
export default db;