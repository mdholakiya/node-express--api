import verifyToken from "../../middleware/userMiddleWare.js";
import db from "../../config/db.js";

//user data by id
const userById = async (id) => {
     const result = await db.query("SELECT * FROM users WHERE id=$1", [id]);
       return result.rows[0]
}

//todo data by cus-id
const dataById = async (cus_id) => {
    const result = await db.query("SELECT * FROM todo WHERE cus_id=$1", [cus_id]);
   return result.rows
}
// single todo data by cus-id
const dataById1 =async (cus_id)=>{
  const result = await db.query("SELECT * FROM todo WHERE cus_id=$1 ", [cus_id]);
  return result.rows[0]
}

//todo daata by cus-id/title
const dataByIdTitle = async (cus_id,title) => {
    const result=await db.query("SELECT * FROM todo WHERE cus_id=$1 AND title=$2 ",[cus_id,title])
  return result.rows[0]
}

//todo data add
const postData = async (cus_id,email,contact,title,discription) => {
    const result = await db.query("INSERT INTO todo  (cus_id,email,contat,title,discription) VALUES($1,$2,$3,$4,$5) ",
        [cus_id,email,contact, title, discription]);
    return result.rows[0]
    }

//todo data update
const updateData = async ( email,contact,title,discription,cus_id,id) => {
    const result = await db.query( "UPDATE todo SET email = $1, contat = COALESCE($2, contat), title = COALESCE($3, title), discription = COALESCE($4, discription) WHERE cus_id = $5 AND id=$6 RETURNING *",
        [email, contact , title , discription , cus_id ,id] );
        // console.log(result.rows[0].id)
        return result.rows
  }
//todo data delete
const deleteData=async(id)=>{
    const result = await db.query("DELETE FROM todo WHERE cus_id=$1", [id]);
  return result.rows[0]
}

export { userById, dataById, dataByIdTitle,postData,updateData, deleteData,dataById1 }