
import * as chai from "chai";
let should = chai.should();
let expect = chai.expect;
import chaiHttp from "chai-http";
import moch, { Test } from "mocha";

import { app} from "../../server.js";
import db from "../../config/db.js";
import bcrypt from "bcrypt"
import dotEnv from "../../config/enviroment.js";


let http = chai.use(chaiHttp);


//demo
describe("expexted equality ", () => {
  it('should return equality', () => {
    let acc = 10;
    let actu = 10;
    expect(acc).to.be.equal(actu);
  });
})


//user rout home page
describe("test user rout ", () => {
  it('should return status 200 and a welcome message', (done) => {
    http.request.execute(app)
      .get('/user')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').eql("welcome to user page");
        done();
      });
  });


});


//user signup
describe("test user signup rout", () => {
  let testdata = {
    name: "testdata",
    email: "testdata@gmail.com",
    password: "Test1234"
  }
  before(async () => {
    await db.query ("DELETE FROM users WHERE email=$1", [testdata.email]); // Cleanup after the test
  });
  
  after( async() => {
    const hashpass = await  bcrypt.hash(testdata.password, 10);
    await db.query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3)", [testdata.name,testdata.email,hashpass]); // Ensure the test email is not in the DB
  });
  it("should return 200 if user is created successfully ",() => {
    http.request.execute("localhost:3000/user")
    .post('/signup')
    .send(testdata)
    .end((err, res) => {
      console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
        // expect(res).to.have.status(404)
        // expect(addData).to.deep.equal(testdata)
        console.log(",,,,,,,,,,,",res)
        expect(res).to.have.status(404)
        expect(res.body).to.have.property('name', testdata.name)
        expect(res.body).to.have.property('email', testdata.email)
        expect(res.body).to.have.property('password', testdata.password)
        expect(res.body).to.have.property('message',"user created successfully")

        if(err){
          console.log("err",err)
        }
    });
  });

  // it("should not create user if email already exist", () => {
  //   //insert user in to db
  //   // const hashPass = await bcrypt.hash(testdata.password, 10);
  //   // await db.query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3)", [testdata.name, testdata.email, hashPass]);
  //   // try {

  //   //   let res = await http.request.execute("localhost:3000/user").post('/signup').send(testdata);
  //   //   expect(res).to.have.status(403);
  //   //   expect(res.body).to.have.property("message", "user already exist try to login")

  //   // } catch (error) {
  //   //   console.log(error, "somethig wrong with user signup")
  //   // }

  //   http.request.execute("localhost:3000/user").post("/signup").send(testdata)
  //   .end((err,res)=>{
  //     expect(res).to.have.status(403)
  //     expect(res.body).to.have.property("message","user already exist try to login")

  //     if(err){
  //       console.log("error",err)
  //     };
  //   })
  // })

});


// describe("test user signup; rout", () => {
//   let details = {
//    name: "demo111",
//    email: "demo@gmail.com",
//    password: "Demodemo111111"
//  }
//  let result;
//  before(async() => {
//      result= await db.query('DELETE FROM users WHERE email = $1', [details.email]);
//    });

//   // console.log(result.rows[0],"lllllllllllllllllllllllllll")
//  it("should create new user,send status 200 ", async () => {
//   const hashpass = await bcrypt.hash(password, 10);
//   result = await db.query(
//   'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
//   [details.name, details.email, details.hashpass]
//  );
//  // console.log(result.rows[0])
// //  details.userId = result.rows[0].id;

//    try {
//      http.request.execute(app).post('/signup').send(details)
//      .end((err,res)=>{
//        expect(res).to.have.status(200)
//        expect(res.body).to.have.property('name', details.name)
//        expect(res.body).to.have.property('email',details.email)
//        expect(res.body).to.have.property('password', details.password)
//        expect(res.body).to.have.property('message', "user created successfully")
//      })
    
//   //  const result = await db.query("SELECT * FROM users WHERE email=$1", [details.email]);
//   //  expect(result.rows).to.have.lengthOf(1);
//   //  expect(result.rows[0].email).to.equal(details.email)
//    // console.log(result)
  
//  } catch (error) {
//      console.log(error,"somethig wrong with user signup")
//  }
 
//  });


//  it("should return validation error if invalid or empty field", () => {
//   //  let details = {
//   //    name: "demo111",//""//""
//   //    email: "",//wer@gmail.com"//""
//   //    password: "Demodemo111111" //""/""
//   //  }

//    http.request.execute(app)
//      .post('/user/signup')
//      .send(details)
//      .end((err, res) => {
//        expect(res).to.have.status(403)
//        expect(res.body).to.have.property("err")
       
//      });
//  });


//   it("should return error if user already exist",async()=>{
//    //for existing user
// //  details = {
// //    name: "demo111", 
// //    email: "demo111@gmail.com",
// //    password: "Demodemo111111" 
// //  };

//  try {
//    let res = await http.request.execute(app).post('/user/signup').send(details);
//    expect(res).to.have.status(403); // Expect a forbidden status code
//    expect(res.body).to.have.property('message').to.not.equal("user created successfully"); // Expect a different message
//  } catch (error) {
//    console.log("Error during signup for existing user:", error);
//  }
//   })

// });



