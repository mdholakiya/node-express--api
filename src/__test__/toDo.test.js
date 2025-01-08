import { toDoSignUp } from "../api/controller/todo.js";
import { getUserByEmail,insertTOData,updateToDoData,deleteToDoData } from "../../helper/toDoHelper.js";

const req={
    body:{
        email:"mansi@gmail.com"
    }
}
it("should send statuscode of 404 if email is not entered",async()=>{
    // toDoSignUp();
})