import verifyToken from "../../middleware/userMiddleWare.js";
import db from "../../config/db.js";

const checkData = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email=$1 ', [email]);
  return result.rows[0]
}

const checkUserId = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE id=$1 ", [id]);
  return result.rows[0]
}
const checkDataByIdEmail = async (id,email) => {
  const result = await db.query("SELECT * FROM users WHERE id=$1 AND email=$2 ", [id,email]);
  return result.rows[0]
}

const postData = async (name, email, password) => {
  const result = await db.query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *", [name, email, password]);
  return result.rows[0]
}

const updateData = async (name,email,password, id) => {
  const result = await db.query("UPDATE users SET name=COALESCE($1,name),email=COALESCE($2,email),password=COALESCE($3,password) WHERE id=$4 RETURNING * ", [name,email,password, id]);
  return result.rows[0]
  }

const deleteData=async(cus_id)=>{
  const result=await db.query("DELETE FROM users WHERE cus_id=$1" ,[cus_id]);
  return result.rows[0]
}
export { checkData, postData, checkDataByIdEmail,updateData,deleteData,checkUserId }