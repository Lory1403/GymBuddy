const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const palestra = require('./models/palestra');

describe('POST /api/v1/palestre', () => {

    let token;

    beforeAll( async () => {
        jest.setTimeout(8000);
        app.locals.db = await mongoose.connect(process.env.DB_URL);

        var payload ={
            email: "test@test.com",
            googleID:"0000"
        }
        var options = {
            expiresIn: 86400
          }
        token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    });
    
    afterAll(async () =>{
        mongoose.connection.close(true);
    });

    it('Dovrebbe restituire palestra creata', async () =>{
        await request(app)
            .post('/api/v1/palestre')
            .send({
                token: token,
                nome: 'test',
                indirizzo: 'indirizzo',
                nomeAmm: 'utente',
                cognomeAmm: 'utente',
                emailAmm: 'test@test.com',
                passwordAmm: 'test'
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.message).toBe(true);
                expect(res.body.message).toBe("Palestra e amministratore creati");
                expect(res.body.self).toMatch('api\/v1\/palestre\/');
                expect(res.body.nome).toBe('test');
                expect(res.body.personale).toBeInstanceOf(Array);
                expect(res.body.indirizzo).toBe("indirizzo");
            });
    });
});


// it('Dovrebbe restituire palestra non trovato', async () => {
//     await request(app)
//         .post('/api/v1/palestre')
//         .send({
//             nome : 'not found',
//             token: token
            
//         })
//         .expect({
//             success: false,
//             message: "Palestra not found"
//         })
//         .expect(400);
// });