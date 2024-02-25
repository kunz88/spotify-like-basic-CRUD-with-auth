import request from "supertest";
import app, { connection } from "../app";
import * as assert from "assert";
import { User } from "../models/User";
import { v4 as uuidv4 } from 'uuid'


// primo capitolo test per end point POST Auth Signup
describe("Auth Signup", () => {
    before(async () => {
        await connection;
    });
    after(async () => {
        if (String(process.env.NODE_ENV).trim() === "test") {// controllo sul NODE_ENV che sto utilizzando
            await User.deleteMany();//elimino tutti gli utenti dal database ogni volta che finisco i test   
        }
    });
    it("Status is running 200", async () => {
        const { status } = await request(app).get("/status");
        assert.equal(status, 200);
    });
    it("POST /auth/signup 400 wrong password", async () => {
        const { status } = await request(app).post("/auth/signup").send({// invio l'utente nel corpo della richiesta
            name: "Carlo",
            email: "pippo@gmail.com",
            password: "passwordinsicura",
        });
        assert.equal(status, 400);
    });
    it("POST /auth/signup 400 missing name", async () => {
        const { status } = await request(app).post("/auth/signup").send({
            email: "pippo@gmail.com",
            password: "@389729nNJs",
        });
        assert.equal(status, 400);
    });
    it("POST /auth/signup 201", async () => {
        const { status, body } = await request(app).post("/auth/signup").send({
            name: "Carlo",
            email: "pippo@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        assert.equal(status, 201);
    });
    it("POST /auth/signup 409 duplicate email", async () => {
        const params = {
            name: "Carlo",
            email: "caiopippo@gmail.com",
            password: "Yoq@ndowi21389G",
        };
        await request(app).post("/auth/signup").send(params);
        const { status } = await request(app).post("/auth/signup").send(params);

        assert.equal(status, 409);
    });
});

// secondo capitolo test,end point POST Auth login
describe("Auth Login", () => {
    before(async () => {
        await connection;
    });
    after(async () => {
        if (String(process.env.NODE_ENV).trim() === "test") {
            await User.deleteMany();
        }
    });
    it("Status is running 200", async () => {
        const { status } = await request(app).get("/status");
        assert.equal(status, 200);
    });
    it("POST /auth/login 200 valid credential", async () => {
        await request(app).post("/auth/signup").send({// creo un utente 
            name: "Carlo",
            email: "pippo@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        const user = await User.findOne({ email: "pippo@gmail.com" });//chiamo il database per prendere l'utente creato 


        await request(app).get(`/auth/emailValidation/${user!.confirmedUuid}`);//valido l'utente
        const { status } = await request(app).post("/auth/login").send({// testo l'endpoint per il login dell'utente
            email: "pippo@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        assert.equal(status, 200);

    });
    it("POST /auth/login 401 wrong password", async () => {
        await request(app).post("/auth/signup").send({// creo un utente 
            name: "Stefno",
            email: "pluto@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        const user = await User.findOne({ email: "pluto@gmail.com" });//chiamo il database per prendere l'utente creato 

        await request(app).get(`/auth/emailValidation/${user!.confirmedUuid}`);//valido l'utente
        const { status } = await request(app).post("/auth/login").send({
            email: "pluto@gmail.com",
            password: "Yoq@ndowi21389G++",
        });
        assert.equal(status, 401);

    });
    it("POST /auth/login 401 wrong email", async () => {
        await request(app).post("/auth/signup").send({// creo un utente 
            name: "Gianni",
            email: "minni@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        const user = await User.findOne({ email: "minni@gmail.com" });//chiamo il database per prendere l'utente creato 
        await request(app).get(`/auth/emailValidation/${user!.confirmedUuid}`);//valido l'utente
        const { status } = await request(app).post("/auth/login").send({
            email: "monno@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        assert.equal(status, 401);

    });
    it("POST /auth/login missing field 400 email", async () => {
        await request(app).post("/auth/signup").send({// creo un utente 
            name: "Franco",
            email: "paperino@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        const user = await User.findOne({ email: "paperino@gmail.com" });//chiamo il database per prendere l'utente creato 

        await request(app).get(`/auth/emailValidation/${user!.confirmedUuid}`);//valido l'utente
        const { status } = await request(app).post("/auth/login").send({
            password: "Yoq@ndowi21389G"
        });
        assert.equal(status, 400);

    });
    it("POST /auth/signup 400 missing field password", async () => {
        await request(app).post("/auth/signup").send({// creo un utente 
            name: "Franco",
            email: "goku@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        const user = await User.findOne({ email: "goku@gmail.com" });//chiamo il database per prendere l'utente creato 
        await request(app).get(`/auth/emailValidation/${user!.confirmedUuid}`);//valido l'utente
        const { status } = await request(app).post("/auth/login").send({
            email: "goku@gmail.com"
        });
        assert.equal(status, 400);

    });
});

// terzo capitolo test endpoint di validazione mail
describe("Auth Validation email", () => {
    before(async () => {
        await connection;
    });
    after(async () => {
        if (String(process.env.NODE_ENV).trim() === "test") {
            await User.deleteMany();
        }
    });
    it("Status is running 200", async () => {
        const { status } = await request(app).get("/status");
        assert.equal(status, 200);
    });
    it("GET /auth/login 200 valid uuid", async () => {
        await request(app).post("/auth/signup").send({// creo un utente 
            name: "Carlo",
            email: "pippo@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        const user = await User.findOne({ email: "pippo@gmail.com" });//chiamo il database per prendere l'utente creato 
        const { status } = await request(app).get(`/auth/emailValidation/${user!.confirmedUuid}`);//valido l'utente
        assert.equal(status, 200);

    });
    it("GET /auth/login invalid uuid 400", async () => {
        const confirmedUuid = "1234567"
        const { status } = await request(app).get(`/auth/emailValidation/${confirmedUuid}`);//valido l'utente
        assert.equal(status, 400);
    });
    it("GET /auth/login valid uuid but user not found 404", async () => {
        const confirmedUuid = uuidv4()
        const { status } = await request(app).get(`/auth/emailValidation/${confirmedUuid}`);//valido l'utente
        assert.equal(status, 404);
    });
});

// quarto ed ultimo capitolo test validazione utente loggato
describe("testing auth/me logged user open session", () => {
    before(async () => {
        await connection;
    });
    after(async () => {
        if (String(process.env.NODE_ENV).trim() === "test") {
            await User.deleteMany();
        }
    });
    it("Status is running 200", async () => {
        const { status } = await request(app).get("/status");
        assert.equal(status, 200);
    });
    it("GET /auth/me 200 valid JWT in the header", async () => {
        await request(app).post("/auth/signup").send({// creo un utente 
            name: "Carlo",
            email: "pippo@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        const user = await User.findOne({ email: "pippo@gmail.com" });//chiamo il database per prendere l'utente creato 
        await request(app).get(`/auth/emailValidation/${user!.confirmedUuid}`);//valido l'utente
        const { body } = await request(app).post("/auth/login").send({//login dell'utente
            email: "pippo@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        const { status } = await request(app).get("/auth/me").set('token', body.token)
        assert.equal(status, 200);

    });
    it("GET /auth/me 401 invalid JWT in the header", async () => {
        await request(app).post("/auth/signup").send({// creo un utente 
            name: "Carlo",
            email: "pluto@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        const user = await User.findOne({ email: "pluto@gmail.com" });//chiamo il database per prendere l'utente creato 
        await request(app).get(`/auth/emailValidation/${user!.confirmedUuid}`);//valido l'utente
        await request(app).post("/auth/login").send({//login dell'utente
            email: "pluto@gmail.com",
            password: "Yoq@ndowi21389G",
        });
        const invalidToken = "pippo"// creo un token non valido
        const { status } = await request(app).get("/auth/me").set('token', invalidToken) // triggero il middleware auth che ritorna status 404
        assert.equal(status, 401);

    });
}); 