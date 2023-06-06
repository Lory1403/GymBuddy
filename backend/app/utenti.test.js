const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/utente');

describe("GET /api/v1/utenti/me", () => {

    let userFindOne;
    let token;
    let tokenErrato;

    beforeAll( async () => {

        jest.setTimeout(8000);
        app.locals.db = await mongoose.connect(process.env.DB_URL);

        var payload = {
            email: "test@test.com",
            id: "1234"
        };

        var options = {
            expiresIn: 86400 // expires in 24 hours
        };

        token = jwt.sign(payload, process.env.SUPER_SECRET, options);
        tokenErrato = jwt.sign(payload, "password sbagliata", options);

        userFindOne = jest.spyOn(User, 'findOne').mockImplementation( async (loggedUser) => {
            if (loggedUser.email == "test@test.com") {
                return new User({
                    nome: "Test",
                    cognome: "Test",
                    email: "test@test.com",
                    password: "Test"
                });
            } else {
                return undefined;
            }
            
        });
    });

    afterAll( async () => {
        userFindOne.mockRestore();
    });

    it('Dovrebbe restituire token non fornito', async () => {
        await request(app)
            .get('/api/v1/utenti/me')
            .expect(401)
            .expect({
                success: false,
                message: "No token provided."
            });
    });

    it('Dovrebbe restituire token errato', async () => {
        await request(app)
            .get('/api/v1/utenti/me')
            .send({
                token: tokenErrato
            })
            .expect(403)
            .expect({
                success: false,
                message: "Failed to authenticate token."
            });
    });

    it('Dovrebbe restituire le informazioni dell\'utente', async () => {
        await request(app)
            .get('/api/v1/utenti/me')
            .send({
                token: token,
                loggedUser: {
                    email: "test@test.com"
                }
            })
            .expect(200)
            .expect( (res) => {
                expect(res.body.self).toMatch('api\/v1\/utenti\/');
                expect(res.body.email).toBe("test@test.com");
            });
        
    });
});

describe("POST /api/v1/utenti", () => {
    
    let userFindOne;
    let token;

    beforeAll( async () => {
        jest.setTimeout(8000);
        app.locals.db = await mongoose.connect(process.env.DB_URL);

        var payload = {
            email: "test@test.com",
            id: "1234"
        };

        var options = {
            expiresIn: 86400 // expires in 24 hours
        };

        token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        userFindOne = jest.spyOn(User, 'findOne').mockImplementation( async (req) => {
            if (req.email == "presente@test.com") {
                return new User({
                    nome: "Test",
                    cognome: "Test",
                    email: "test@test.com",
                    password: "Test"
                });
            } else {
                return undefined;
            }
            
        });
    });

    afterAll( async () => {
        userFindOne.mockRestore();
        mongoose.connection.close(true);
    });

    it('Dovrebbe restituire utente già esistente', async () => {
        await request(app)
            .post('/api/v1/utenti')
            .send({
                token: token,
                email: "presente@test.com"
            })
            .expect(409)
            .expect({
                success: false,
                message: "L'utente esiste già"
            });
    });

    it('Dovrebbe restituire utente creato', async () => {
        await request(app)
            .post('/api/v1/utenti')
            .send({
                nome: "Test",
                cognome: "Test",
                email: "test@test.com",
                password: "Password",
                ruolo: "reg",
                token: token
            })
            .expect(201)
            .expect( (res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe("Utente creato");
                expect(res.body.self).toMatch('api\/v1\/utenti\/');
            });
        
    });
});