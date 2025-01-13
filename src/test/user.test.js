
import * as chai from "chai";                                                                                                                                                                                                                                                                                
let should = chai.should();
let expect = chai.expect;
import chaiHttp from "chai-http";
import mocha from "mocha";

import {app,port} from "../server.js";
import dotEnv from "../config/enviroment.js";
import { user,userSignUp } from "../api/controller/user.js"
import userRouter from '../api/routes/user.js';

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
describe("test user rout ",()=>{
  it('should return status 200 and a welcome message', (done)=>{
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
describe("test signup rout",()=>{
  it("should not post if not  fill-up require fields ",(done)=>{
    let details={
      email:"demo@gmail.com",
      password:"Abc@123t",
      name:"demo"
    }
    http.request.execute(app)
    .post('/user/signup')
    .send(details)
    .end((err,res)=>{
    res.should.have.status(400);
    res.body.should.be.a('Object');
    res.body.should.have.property('error')
    res.body.errors.should.have.property('success');
    

    })
  })

})





