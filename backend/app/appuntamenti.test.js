const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const Calendario = require('./models/calendario');
const Utente = require('./models/utente');


describe('/api/v1/appuntamenti', () => {
    let connection;
    let user1;
    let user2;
    let user3;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected!');

        calendario1 = await new Calendario({
            nome: 'calendarioTest1'
        }).save();
        user1 = await new Utente({
            nome: 'test 1',
            cognome: 'test 1',
            email: 'email.test1@prova.it',
            password: 'password1',
            idCalendario: calendario1._id,
            role: 'abb',
        }).save();

        calendario2 = await new Calendario({
            nome: 'calendarioTest2'
        }).save();
        user2 = await new Utente({
            nome: 'test 2',
            cognome: 'test 2',
            email: 'email.test2@prova.it',
            password: 'password2',
            idCalendario: calendario2._id,
            role: 'abb',
        }).save();

        calendario3 = await new Calendario({
            nome: 'calendarioTest3'
        }).save();
        user3 = await new Utente({
            nome: 'test 3',
            cognome: 'test 3',
            email: 'email.test1@prova.it',
            password: 'password3',
            idCalendario: calendario3._id,
            role: 'abb',
        }).save();

    });

    afterAll(() => {
        calendario1.delete();
        user1.delete();
        calendario2.delete();
        use2.delete();
        calendario3.delete();
        user3.delete();
        mongoose.connection.close(true);
        console.log("Database connection closed");
    });

    var token = jwt.sign(
        { email: 'John@mail.com' },
        process.env.SUPER_SECRET,
        { expiresIn: 86400 }
    );

    test('POST /api/v1/appuntamenti titolo non specificato', async () => {
        var res = await request(app)
            .post('/api/v1/appuntamenti')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .send({
                'title': '',
                'date': '1/1/1111 11:11:11',
                'descrizione': 'test descrizione',
                'involved': [user1._id, user2._id, user3._id]
            }).expect(400);

        expect(res.body.message).toBe('titolo mancante');

    });

    test('POST /api/v1/appuntamenti data non specificata', async () => {
        var res = await request(app)
            .post('/api/v1/appuntamenti')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .send({
                'title': 'test1',
                'date': '',
                'descrizione': 'test descrizione',
                'involved': [user1._id, user2._id, user3._id]
            }).expect(400);

        expect(res.body.message).toBe('data mancante');
    })

    test('POST /api/v1/appuntamenti descrizione non specificata', async () => {
        var res = await request(app)
            .post('/api/v1/appuntamenti')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .send({
                'title': 'test 1',
                'date': '1/1/1111 11:11:11',
                'descrizione': '',
                'involved': [user1._id, user2._id, user3._id]
            }).expect(400);

        expect(res.body.message).toBe('descrizione mancante');

    });

    test('POST /api/v1/appuntamenti coinvolti non specificati', async () => {
        var res = await request(app)
            .post('/api/v1/appuntamenti')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .send({
                'title': 'test1',
                'date': '1/1/1111 11:11:11',
                'descrizione': 'test descrizione',
                'involved': []
            }).expect(400);

        expect(res.body.message).toBe('utenti coinvolti mancanti');

    });

});