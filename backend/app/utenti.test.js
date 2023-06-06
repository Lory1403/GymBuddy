const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/utente');

describe("GET /api/v1/utenti/me", () => {

    let userFindOne;

    beforeAll( async () => {
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

    it('Dovrebbe restituire utente non autenticato', async () => {
        await request(app)
            .get('/api/v1/utenti/me')
            .expect(428)
            .expect({
                success: false,
                message: "L'utente non è autenticato"
            });
    });

    it('Dovrebbe restituire le informazioni dell\'utente', async () => {
        await request(app)
            .get('/api/v1/utenti/me')
            .send({
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

    beforeAll( async () => {
        jest.setTimeout(8000);
        app.locals.db = await mongoose.connect(process.env.DB_URL);

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
                ruolo: "reg"
            })
            .expect(201)
            .expect( (res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe("Utente creato");
                expect(res.body.self).toMatch('api\/v1\/utenti\/');
            });
        
    });
});

// inserire utenti amministrativi in una palestra
// describe("", () => {
//     beforeAll( async () => {

//     });

//     afterAll( async () => {

//     });

//     it('', async () => {

//     });
// });