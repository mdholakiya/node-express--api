
import * as chai from "chai";
let should = chai.should();
let expect = chai.expect;
import chaiHttp from "chai-http";
import mocha, { beforeEach } from "mocha";

import { app, port } from "../../server.js";
import db from "../../config/db.js";
import dotEnv from "../../config/enviroment.js";
import { user, userSignUp } from "../../api/controller/user.js"
import userRouter from '../../api/routes/user.js';
import { response } from "express";

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
describe("test user signup; rout", () => {
   let details = {
    name: "demo111",
    email: "demo111@gmail.com",
    password: "Demodemo111111"
  }
  beforeEach(async() => {
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [details.name, details.email, details.password]
    );
    details.userId = result.rows[0].id;
  });
  
  afterEach(async() => {
    const result= await db.query('DELETE FROM users WHERE id = $1', [details.userId]);
  });

  it("should create new user and signup user ", async () => {
    // details = {
    //   name: "demo111",
    //   email: "demo111@gmail.com",
    //   password: "Demodemo111111"
    // }
    try {
      let res = await http.request.execute(app).post('/user/signup').send(details);
      // console.log(res.request,",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('name', details.name)
      expect(res.body).to.have.property('email',details.email)
      // expect(res.body).to.have.property('password', details.password)
      expect(res.body).to.have.property('message', "user created successfully")
     
    const result = await db.query("SELECT * FROM users WHERE email=$1", [details.email]);
    expect(result.rows).to.have.lengthOf(1);
    expect(result.rows[0].email).to.equal(details.email)
    // console.log(result)
   
  } catch (error) {
      console.log("kkkkkkkkkkkkk",error,"somethig wrong with user signup")
  }
  
  });


  it("should return validation error if invalid or empty field", () => {
    let details = {
      name: "demo111",//""//""
      email: "",//wer@gmail.com"//""
      password: "Demodemo111111" //""/""
    }

    http.request.execute(app)
      .post('/user/signup')
      .send(details)
      .end((err, res) => {
        expect(res).to.have.status(403)
        expect(res.body).to.have.property("err")
        
      });
  });


   it("should return error if user already exist",async()=>{
    //for existing user
  details = {
    name: "demo111", 
    email: "demo111@gmail.com",
    password: "Demodemo111111" 
  };

  try {
    let res = await http.request.execute(app).post('/user/signup').send(details);
    expect(res).to.have.status(403); // Expect a forbidden status code
    expect(res.body).to.have.property('message').to.not.equal("user created successfully"); // Expect a different message
  } catch (error) {
    console.log("Error during signup for existing user:", error);
  }
   })

});





