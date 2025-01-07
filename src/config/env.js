import env from "dotenv";

env.config();

// const dotEnv={
//     PG_USER: process.env.PG_USER,
//     PG_PASSWORD: process.env.PG_PASSWORD,
//     PG_DATABASE: process.env.PG_DATABASE,
//     hPG_HOSTost: process.env.PG_HOST,
//     PG_PORT: process.env.PG_PORT,
//     SECRET_KEY:process.env.SECRET_KEY,
//     PORT:process.env.PORT
// }

const dotEnv = {
      USER:process.env.PG_USER,
      HOST: process.env.PG_HOST,
      DATABASE:process.env.PG_HOST,
      PASSWORD:process.env.PG_HOST,
      PORT: 5432
  }

export default dotEnv;