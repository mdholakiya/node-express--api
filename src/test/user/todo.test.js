import * as chai from "chai";
let should = chai.should();
let expect = chai.expect;
import chaiHttp from "chai-http";
import moch, { Test } from "mocha";

import { app } from "../../server.js";
import db from "../../config/db.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import dotEnv from "../../config/enviroment.js";
import verifyToken from "../../middleware/userMiddleWare.js";
import { toDoUpdate } from "../../api/controller/todo.js";


let http = chai.use(chaiHttp);

describe("todo crud operation", async () => {

    let tok = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE2MiwiZW1haWwiOiJ4eXh5eHl4eXh5QGdtYWlsLmNvbSIsImlhdCI6MTczNzYzODgzMSwiZXhwIjoxNzM3ODExNjMxfQ.npM_EzTBD5a6RW5mAUPHzdIsQJx8AKn4-UsV_zV6eN8";
    let userId = 1162;
    let cus_id=userId;
    let testTodo =  {
            email: "xyxyxyxyxy@gmail.com",
            contact: "8976543678",
            title: "New Task",
            discription: "Task Description"
        }
    let upatedTodo={
        email: "xyxyxyxyxy@gmail.com",
            contact: "3456789321",
            title: "updated Task",
            discription: "updated task Description"
    }
    

    before("todo crud operation", async () => {
        await db.query("DELETE  FROM todo WHERE email=$1 ", [testTodo.email]);
    });
    describe("login todo ", async () => {
        it("should successfully add new todo ", (done) => {
            http.request.execute("localhost:3000/toDo")
                .post("/add")
                .set("Authorization", `Bearer ${tok}`)
                .send(testTodo)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    console.log(res.body, "ooooooooooooooooooo")
                    expect(res.body).to.have.property('message').eql('data added successfully');
                    expect(res.body).to.have.property('email', testTodo.email)
                    expect(res.body).to.have.property('contact', testTodo.contact)
                    expect(res.body).to.have.property('title', testTodo.title)
                    expect(res.body).to.have.property('discription', testTodo.discription);
                    done();
                })
        })
    });

    describe("get todo data", () => {
        it("get todo data successfully", (done) => {
            http.request.execute("localhost:3000/toDo")
                .get("/data")
                .set("Authorization", `Bearer ${tok}`)
                .send({email:'xyxyxyxyxy@gmail.com'})
                .end((err, res) => {
                    console.log(res.body, "333333333333333333333333")
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').eql('here is your all todo items')
                    expect(res.body).to.have.property('todo')

                })
            done();
        })
    })
describe("update data",()=>{
    it('should updae user data with 200 code',(done)=>{
        http.request.execute("localhost:3000/toDo")
                .patch("/upd")
                .set("Authorization", `Bearer ${tok}`)
                // .send({email:'xyxyxyxyxy@gmail.com'})
                .send(upatedTodo)
                .end((err,res)=>{
                console.log(res.body,"8888888888888")
                expect(res).to.have.status(200)
                expect(res.body).to.have.property('todoUpdate').that.is.an("array");
                const newItem=res.body.todoUpdate[0]
                // expect(res.body.newItem).to.have.property('cus_id',upatedTodo.cus_id)
                expect(newItem).to.have.property("email",upatedTodo.email)
                expect(newItem).to.have.property("contat",upatedTodo.contact)
                expect(newItem).to.have.property("title",upatedTodo.title)
                expect(newItem).to.have.property("discription",upatedTodo.discription)
                expect(res.body).to.have.property('message','updated')
            })
            
        done()
    })
})

describe("delete todo",()=>{
    it('should delete todo data',(done)=>{
        http.request.execute("localhost:3000/toDo")
        .delete("/del")
        .set("Authorization", `Bearer ${tok}`)
        .send({ email:testTodo.email})
        .end((err,res)=>{
            console.log(res.body,"qqqqqqqqqqqqqq")
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message','deleted')
        })
        done()
    })
})

})  