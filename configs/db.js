import pg from "pg";
import dotEnv from "./env.js";

const db = new pg.Client({
  user:dotEnv.PG_USER,
  password: dotEnv.PG_PASSWORD,
  database: dotEnv.PG_DATABASE,
  host: dotEnv.PG_HOST,
  port:dotEnv.PG_PORT,
});  

  // const db = new pg.Client({
  //     user: "postgres",
  //     host: "localhost",
  //     database: "apis",
  //     password: "DESKTOP1",
  //     port: 5432
  // });

  db.connect();

// if(db.connect){res.send("conned")}else{ res.send(error)}

export default db;