process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let popsicle = { name: "Popsicle", price:1.45 };

beforeEach(function() {
  items.push(popsicle);
});

afterEach(function() {
  // make sure this *mutates*, not redefines, `cats`
  items.length = 0;
});

describe("GET /items",() =>{
    test("Get all items", async () =>{
       const res = await request(app).get("/items")
       expect(res.statusCode).toBe(200)
       expect(res.body).toEqual({items: [popsicle]})
    })
})

describe("GET /items/:name",() =>{
    test("Get item by name", async () =>{
       const res = await request(app).get(`/items/${popsicle.name}`)
       expect(res.statusCode).toBe(200)
       expect(res.body).toEqual({item: popsicle})
    })
    test("Responds with 404 for invalid name", async()=>{
        const res = await request(app).get(`/items/pickle`)
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () =>{
    test("Creating an item", async()=>{
        const res = await request(app).post("/items").send({name: "cheerios", price:3.40})
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({added:{name: "cheerios", price:3.40}})
    })
    test("Responds with 400 if name is missing", async()=>{
        const res = await request(app).post("/items").send({})
        expect(res.statusCode).toBe(400)
    })
})

describe("/Patch /items", () =>{
    test("Updating an item", async()=>{
        const res = await request(app).patch(`/items/${popsicle.name}`).send({name:"new popsicle"})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({updated:{name:"new popsicle", price:1.45}})
    })
    test("Responds with 404 for invalid name", async()=>{
        const res = await request(app).patch(`/items/Pickle`).send({name:"new pickle"})
        expect(res.statusCode).toBe(404)
    })
})

describe('/DELETE /items/:name', () => {
    test("Deleting an item", async()=>{
        const res = await request(app).delete(`/items/${popsicle.name}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({message: "Deleted"})
    })
    test("Responds with 404 for invalid name", async()=>{
        const res = await request(app).delete(`/items/Pickle`)
        expect(res.statusCode).toBe(404)
    })
})
