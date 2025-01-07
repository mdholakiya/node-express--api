
import {app,port} from "./server.js"
//connect to server

app.listen(port,(error)=>{
    if(error){
        console.log(error)
    }else{
        console.log(`server is running on ${port}`)
    }
});
