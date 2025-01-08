
 const getUserByEmail=async(email)=>{
    const result=await db.query("SELECT * FROM users WHERE email=$1",[email]);
    return result.rows[0];  
}

const insertTOData=async(cus_id, email, city, age, contact)=>{
    const result = await db.query("INSERT INTO todo (cus_id,email,city,age,contat) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [cus_id=req.id, email, city, age, contact]);
        
        return result.rows[0];
}

const updateToDoData= async(email,city,age,contact,cus_id)=>{
    const result=await db.query("UPDATE todo SET email=$1, city=$2, age=$3, contat=$4 WHERE cus_id=$5 RETURNING *"
        ,[email=req.email,city,age,contact,cus_id=req.id]);

        return result.rows[0];
}

const deleteToDoData= async(cus_id)=>{
    const result= await db.query("DELETE FROM todo WHERE cus_id=$1", [cus_id=req.id]);
    return result;
}

export {getUserByEmail,insertTOData,updateToDoData,deleteToDoData}