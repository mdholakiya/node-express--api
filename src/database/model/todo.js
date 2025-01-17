import verifyToken from "../../middleware/userMiddleWare.js";
import db from "../../config/db.js";


const userById = async (id) => {
     const result = await db.query("SELECT * FROM users WHERE id=$1", [id]);
       return result.rows[0]
}

const dataById = async (cus_id) => {
    const result = await db.query("SELECT * FROM todo WHERE cus_id=$1", [cus_id]);
   return result.rows
}

const dataByIdTitle = async (id,title) => {
    const result=await db.query("SELECT * FROM todo WHERE cus_id=$1 AND title=$2 ",[id,title])
  return result.rows[0]
}

const postData = async (cus_id,email,contact,title,discription) => {
    const result = await db.query("INSERT INTO todo  (cus_id,email,contat,title,discription) VALUES($1,$2,$3,$4,$5) ",
        [cus_id,email,contact, title, discription]);
    return result.rows[0]
    }

const updateData = async ( email,contact,title,discription,cus_id) => {
    const result = await db.query( "UPDATE todo SET email = $1, contat = COALESCE($2, contat), title = COALESCE($3, title), discription = COALESCE($4, discription) WHERE cus_id = $5  RETURNING *",
        [email, contact , title , discription , cus_id] );
        return result.rows[0]
  }

const deleteData=async(id)=>{
    const result = await db.query("DELETE FROM todo WHERE cus_id=$1", [id]);
  return result.rows[0]
}
export { userById, dataById, dataByIdTitle,postData,updateData, deleteData }