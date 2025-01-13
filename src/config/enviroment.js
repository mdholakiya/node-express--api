import env from "dotenv";

env.config();

// // const dotEnv={
// //     PG_USER: process.env.PG_USER,
// //     PG_PASSWORD: process.env.PG_PASSWORD,
// //     PG_DATABASE: process.env.PG_DATABASE,
// //     hPG_HOSTost: process.env.PG_HOST,
// //     PG_PORT: process.env.PG_PORT,
// //     SECRET_KEY:process.env.SECRET_KEY,
// //     PORT:process.env.PORT
// // }
// console.log(env, "env file");

const dotEnv = {
      USER:process.env.PG_USER,
      HOST: process.env.PG_HOST,
      DATABASE:process.env.PG_DATABASE,
      PASSWORD:process.env.PG_PASSWORD,
      P_PORT: process.env.PG_PORT,
      //serverport
      PORT:process.env.SERVER_PORT,
      //token secretkey
      SECRET:process.env.SECRET_KEY
  }
  // console.log(dotEnv, "enviroment connected");
   

export default dotEnv;