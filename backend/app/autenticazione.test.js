const request = require('supertest');
const app = require('./app');

describe('POST /api/v1/autenticazioni', () => {

    const User = require('./models/utente');
    
    let userFindOne;

    beforeAll( async () => {
        userFindOne = jest.spyOn(User, 'findOne').mockImplementation( (obj) => {
            return Promise.resolve(new User({
                nome: "Test",
                cognome: "Test",
                email: "test@test.com",
                password: "Test"
            }));
        });
    });

    afterAll(async () => {
        userFindOne.mockRestore();
    });


    test('POST /api/v1/autenticazioni, dovrebbe restituire il token firmato', async () => {
        const response = await request(app)
            .post('/api/v1/autenticazioni')
            .send({
                email: 'test@test.com',
                password: 'Test'
            })
            .expect(200);
        expect(response.body.token).toBeDefined();
    });
});

// utente non trovato
describe('POST /api/v1/autenticazioni', () => {

    const User = require('./models/utente');
    
    let userFindOne;

    beforeAll( async () => {
        userFindOne = jest.spyOn(User, 'findOne').mockImplementation( (obj) => {
            return null;
        });
    });

    afterAll(async () => {
        userFindOne.mockRestore();
    });


    test('POST /api/v1/autenticazioni, dovrebbe restituire utente non trovato', async () => {
        const response = await request(app)
            .post('/api/v1/autenticazioni')
            .send({
                email: 'test@test.com',
                password: 'Test'
            })
            .expect({
                success: false,
                message: "Authentication failed. User not found."
            })
            .expect(401);
    });
});


// password sbagliata
describe('POST /api/v1/autenticazioni', () => {

    const User = require('./models/utente');
    
    let userFindOne;

    beforeAll( async () => {
        userFindOne = jest.spyOn(User, 'findOne').mockImplementation( (obj) => {
            return Promise.resolve(new User({
                nome: "Test",
                cognome: "Test",
                email: "test@test.com",
                password: "Test"
            }));
        });
    });

    afterAll(async () => {
        userFindOne.mockRestore();
    });


    test('POST /api/v1/autenticazioni, dovrebbe restituire utente non trovato', async () => {
        const response = await request(app)
            .post('/api/v1/autenticazioni')
            .send({
                email: 'test@test.com',
                password: 'PasswordErrata'
            })
            .expect({
                success: false,
                message: "Authentication failed. Wrong password."
            })
            .expect(401);
    });
});

