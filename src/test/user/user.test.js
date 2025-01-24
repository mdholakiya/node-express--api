
// import * as chai from "chai";
// let should = chai.should();
// let expect = chai.expect;
// import chaiHttp from "chai-http";
// import moch, { Test } from "mocha";

// import { app } from "../../server.js";
// import db from "../../config/db.js";
// import jwt from 'jsonwebtoken';
// import bcrypt from "bcrypt"
// import dotEnv from "../../config/enviroment.js";
// import verifyToken from "../../middleware/userMiddleWare.js";


// let http = chai.use(chaiHttp);


// //demo
// describe("expexted equality ", () => {
//   it('should return equality', () => {
//     let acc = 10;
//     let actu = 10;
//     expect(acc).to.be.equal(actu);
//   });
// })

// //user rout home page
// describe("test user rout ", () => {
//   it('should return status 200 and a welcome message', (done) => {
//     http.request.execute(app)
//       .get('/user')
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property('message').eql("welcome to user page");
//         done();
//       });
//   });


// });
// // console.log(token)
// describe("user crud operation", async () => {
//   let tok;
//   let userId;

//   let testdata = {
//     name: "zyzy",
//     email: "zyzy@gmail.com",
//     password: "Zyzy12345"
//   }

//   let newData={
//     id:userId,
//     name:"aaaa",
//    email:"aaa@gmail.com",
//    password:"Aaa123eee"
//    };
  
//   // after(async () => {
//   //   // Cleanup the test user
//   //   await db.query("DELETE FROM users WHERE email=$1", [testdata.email]);
//   // });
//   before(async () => {
//     await db.query("DELETE  FROM users WHERE email=$1 ", [testdata.email]);
//    });
  
//   //user signup
//   describe("test user signup rout", () => {
//     it("should return 200 if user is created successfully ", (done) => {
//       http.request.execute("localhost:3000/user")
//         .post('/signup')
//         .send(testdata)
//         .end((err, res) => {
//           console.log(res.body,"........................")
//           expect(res).to.have.status(200);
//           expect(res.body).to.have.property('newUser');
//           expect(res.body.newUser).to.have.property('id');
//           expect(res.body.newUser).to.have.property('name', testdata.name);
//           expect(res.body.newUser).to.have.property('email', testdata.email);
//           //expect(res.body.newUser).to.have.property('password', hashpass);
//           expect(res.body).to.have.property('message', "user created successfully")
//           done()
//           if (err) {
//             console.log("err", err)
//             done(err)
//           }
//         });
//     });

//     it("should not create user if email already exist", (done) => {
//       http.request.execute("localhost:3000/user")
//         .post('/signup')
//         .send(testdata)
//         .then((res) => {
//           expect(res).to.have.status(403);
//           expect(res.body).to.have.property('message', 'user already exist try to login');
//           // expect(res).to.be.json;
//           // done()
//           return db.query("SELECT * FROM users where email=$1", [testdata.email])
//         })
//         .then((result) => {
//           let user = result.rows[0]
//           console.log(user, "iiiiiiiiiiiiiiii")
//           // expect(res).to.have.status(403);
//           expect(user).to.exist;
//           expect(user).to.have.property("name", testdata.name);
//           expect(user).to.have.property("email", testdata.email);
//           done()
//         })
//         .catch((err) => {
//           console.log("err", err)
//           done(err);
//         })
//     });

//     it("sholud return 404 if field validation fail", (done) => {
//       //name validation
//       http.request.execute("localhost:3000/user")
//         .post('/signup')
//         .send({
//           email: "zyzy@gmail.com",
//           password: "Zyzy12345"
//         })
//         .end((err, res) => {
//           console.log(res.body, "llllllllllllllllllllllll")
//           expect(res).to.have.status(404);
//           expect(res.body).to.have.property("err");
//           expect(res.body.err[0].msg).to.equal('Name is required')

//         });

//       //invalidemail validation
//       http.request.execute("localhost:3000/user")
//         .post('/signup')
//         .send({
//           name: "zyzy",
//           email: "zyzy@",
//           password: "Zyzy12345"
//         })
//         .end((err, res) => {
//           expect(res).to.have.status(404);
//           console.log(res.body, "555555555555555555555555555")
//           expect(res.body).to.have.property("err");
//           expect(res.body.err[0].msg).to.equal('enter valid email address')
//         })

//       //invalid password format
//       http.request.execute("localhost:3000/user")
//         .post('/signup')
//         .send({
//           name: "zyzy",
//           email: "zyzy@gmail.com",
//           password: "zyzy"
//         })
//         .end((err, res) => {
//           expect(res).to.have.status(404);
//           console.log(res.body, "777777777777777777777")
//           expect(res.body).to.have.property("err");
//           expect(res.body.err[0].msg).to.equal('password lenth should be atleast 8 char')
//         })

//       //invalid pass for reegex
//       http.request.execute("localhost:3000/user")
//         .post('/signup')
//         .send({
//           name: "zyzy",
//           email: "zyzy@gmail.com",
//           password: "zyzyztyu"
//         })
//         .end((err, res) => {
//           expect(res).to.have.status(404);
//           console.log(res.body, "888888888888888888888")
//           expect(res.body).to.have.property("message");
//           expect(res.body.message).to.equal('enter unique pass which include alterat one uper case,one lower case and one diggit')
//           done();
//           if (err) {
//             console.log("err", err)
//             done(err)
//           }
//         })
//     })

//     it('should return 500 if internal server error', (done) => {
//       http.request.execute("localhost:3000/user")
//         .post('/signup')
//         .send({
//           name: "zyzy",
//           email: "zyzy@gmail.com",
//           password: "Zyzy12345",
//           simulateError: true
//         })
//         .end((err, res) => {
//           expect(res).to.have.status(500);
//           console.log(res.body, "99999999999999999")
//           expect(res.body).to.have.property('message').eql("internal server error");
//           expect(res.body).to.have.property('success').eql("false");
//           done();
//           if (err) {
//             console.log("err", err)
//             done(err)
//           }
//         })
//     })
//   });

//   //  //login rout
//   describe("test user login rout", () => {
//     before(async () => {
//       // const result=await db.query('SELECT * FROM users where email=$1',[testdata.email]);
//       // userId = result.rows[0].id;
//       // testdata.id=userId;
//       // //console.log(userId, testdata.id,"+++++++++++++++++++++++")
//       //  console.log(testdata,";;;;;;;;;;;;;;;")
//       //   token= jwt.sign({ id: userId }, 'your-secret-key', { expiresIn: '1d' })
//       //  console.log(token)
//     })
//     it("should login and generate token if user valid",(done) => {
//       http.request.execute("localhost:3000/user")
//         .post("/login")
//         .send({ email: testdata.email, password: "Zyzy12345" })
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           console.log(res.body,"lllllllllllllllllll")
//           expect(res.body).to.have.property('message').eql('welcome to home page')
//           expect(res.body).to.have.property('token');
//           expect(res.body).to.have.property('user');
//           expect(res.body.user).to.have.property('email', testdata.email)
//           done()
//           if (err) {
//             console.log("err", err)
//             done(err)
//           }
//           tok=res.body.token
//           console.log(tok,"qqqqqqqqqqqqqqqqqq")
//           const decoded = jwt.verify(tok, dotEnv.SECRET);
//           console.log(decoded,"ffffffffffffff")
//           userId=decoded.id;
//           console.log(userId,"gtfgfgfg");
//         })
//       })
//     });
//     //get user
//     describe("test user get rout", () => {
//     it("should return data after valid email id ",(done) => {
//         http.request.execute("localhost:3000/user")
//         .get("/data")
//         .set("Authorization",`Bearer ${tok}`)
//         .send({email:testdata.email})
//         .end((err,res)=>{
//           console.log(res.body,"]]]]]]]]]]]]]]")
//           expect(res).to.have.status(200)
//           expect(res.body).to.have.property('message','here is your  details')
//           expect(res.body).to.have.property('user')
//           expect(res.body.user).to.have.property('email',testdata.email);
//           expect(res.body.user).to.have.property('id',userId)
//           done();
//         })
//     })
//   })
// //UPDATE USER
//    describe("update user data",()=>{
    
//   before(async () => {
//     await db.query("DELETE FROM users where email=$1",[newData.email])
    
//     });
//     it("should update user and store new data",(done)=>{
//       // console.log(newData,"===============")
//       http.request.execute("localhost:3000/user")
//       .patch("/update")
//       .set("Authorization",`Bearer ${tok}`)
//       .send(newData)
//       .end((err,res) => {
//         expect(res).to.have.status(200);
//         console.log(res.body,"lllllllllllllllllll")
//         expect(res.body).to.have.property("message", "updated stored");
//         expect(res.body).to.have.property("updateUser");
//         expect(res.body.updateUser).to.have.property("name", newData.name);
//         expect(res.body.updateUser).to.have.property("email", newData.email);
//        // expect(res.body.updateUser).to.have.property("id", userId);
//         done();
//         if(err){
//           console.log(err)
//         }
//     });
//   });
//   });

//  //DELETE USER
// describe("delte uer rout after delete todo data ",()=>{
//   it("delete user and dend status code 200",(done)=>{
//     http.request.execute("localhost:3000/user")
//     .delete("/delete")
//     .set('Authorization', `Bearer ${tok}`) 
//     .send({ email:newData.email})
//      .end((err, res) => {
//       expect(res).to.have.status(200); 
//       expect(res.body).to.have.property('message', 'user deleted successfully');
//     done()
//   });
// })
// })
// })