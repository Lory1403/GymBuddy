const request  = require('supertest');
const app      = require('./app');
const mongoose = require('mongoose');

//VERIFICA METODO POST
describe('POST /api/v1/registrazione', () => {

    const User = require('./models/utente');

    let userFindOne;

    beforeAll( async () => {
        jest.setTimeout(8000);
        app.locals.db = await mongoose.connect(process.env.DB_URL);
    
        userFindOne = jest.spyOn(User, 'findOne').mockImplementation( async (req) => {
            if(req.email == 'utenteEsistente@gmail.com'){
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
        mongoose.connection.close(true);
    });

    // Utente già esistente 
    it('Dovrebbe restituire utente esistente', async () => {
        await request(app)
                .post('/api/v1/registrazioni')
                .send({
                    nome: 'Test',
                    cognome: 'Test',
                    email: 'utenteEsistente@gmail.com',
                    password: 'password'
                })
                .expect(409)
                .expect({
                    success: false,
                    message: "Registrazione fallita. L'utente esiste già."
        });
    }); 

    //Utente inserito
    it('Dovrebbe restituire utente inserito', async () => {
        await request(app)
                .post('/api/v1/registrazioni')
                .send({
                    nome: 'Test',
                    cognome: 'Test',
                    email: 'test@gmail.com',
                    password: 'password'
                })
                .expect( (res) => {
                    expect(res.body.success).toBe(true);
                    expect(res.body.message).toBe("Utente creato. Enjoy your token!");
                    expect(res.body.token).toEqual(expect.anything());
                    expect(res.body.email).toBe('test@gmail.com');
                    expect(res.body.id).toEqual(expect.any(String));
                    expect(res.body.self).toMatch('api\/v1\/utenti\/');
                })
                .expect(201);
    });
});






