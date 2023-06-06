const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const palestra = require('./models/palestra');

describe('POST /api/v1/palestre', () => {
    const User = require('./models/utente');
    const Abbonamento = require('./models/abbonamento');

    let userFindOne;
    let abbonamentoFindOne;
    let token;

    beforeAll(async () => {
        var payload ={
            email: "test@test.com",
            googleID:"0000"
        }
        var options = {
            expiresIn: 86400
          }
          token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        userFindOne = jest.spyOn(User, 'findOne').mockImplementation( async (req) => {
            if (req.email == "test@test.com") {
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
    afterAll(async () =>{
        userFindOne.mockRestore();
    });

    it('Dovrebbe restituire palestra non trovato', async () => {
        await request(app)
            .post('/api/v1/palestre')
            .send({
                nome : 'not found',
                token: token
                
            })
            .expect({
                success: false,
                message: "Palestra not found"
            })
            .expect(400);
    });
    it('Palestra creata', async () =>{
        await request(app)
        .post('/api/v1/palestre')
        .send({
            token: token,
            nome: 'test',
            indirizzo: 'indirzzo',
    
            nome: 'utente',
            cognome: 'utente',
            email: 'test@test.com',
            password: 'test',
            role: 'amm',
            idPalestre: 'id'
        })
        .expect({
            success: true ,
            message: "Palestra creata"
        }).expect(201);
    });
});