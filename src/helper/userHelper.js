const getUserByEmail=async(email)=>{
    const result = await db.query("SELECT * FROM users WHERE email=$1", [email]); 
    return result.rows[0];  
}

const insertUserData=async(name,email,hashpass)=>{
    const result= await db.query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *", [name, email, hashpass]);
    return result.rows[0];
}

const updateUserData=async(name,email,password,id)=>{
const result=await db.query("UPDATE users SET name=$1,email=$2,password=$3 WHERE id=$4 RETURNING * ", [name, email, hashpass ==="" ? password : hashpass , id=req.id]);
    return result.rows[0];
}

const deleteUserData=async(id)=>{
    const result=await db.query('DELETE FROM users WHERE id=$1', [id=req.id]);
    return result;
}


export {getUserByEmail,insertUserData,updateUserData,deleteUserData};