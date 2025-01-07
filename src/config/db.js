import pg from "pg";
import dotEnv from "./env.js";

// const db = new pg.Client({
//   user:dotEnv.PG_USER,
//   password: dotEnv.PG_PASSWORD,
//   database: dotEnv.PG_DATABASE,
//   host: dotEnv.PG_HOST,
//   port:dotEnv.PG_PORT,
// });  

  const db = new pg.Client({
      user:dotEnv.USER,
      host:dotEnv.HOST,
      database:dotEnv.DATABASE,
      password:dotEnv.PASSWORD,
      port:dotEnv.PG_PORT
  });
  db.connect();
  
export default db;