const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const Calendario = require('./models/calendario');
const Utente = require('./models/utente');
const Palestra = require('./models/palestra');


describe('/api/v1/calendari', () => {

    let token;
    let calendarioAmm;
    let userAmm;
    let palestra;
    let calendarioCorso;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected!');

        calendarioCorso = await new Calendario({
            nome: 'corsoTest'
        }).save();

        palestra = await new Palestra({
            nome: 'Palestra test',
            calendariCorsi: [calendarioCorso._id]
        }).save();

        calendarioAmm = await new Calendario({
            nome: 'calendarioTestAmm'
        }).save();
        userAmm = await new Utente({
            nome: 'test Amm',
            cognome: 'test Amm',
            email: 'email.testAmm@prova.it',
            password: 'passwordAmm',
            idCalendario: calendarioAmm._id,
            role: 'amm',
            idPalestra: palestra._id
        }).save();

        palestra.personale.push(userAmm._id);
        await palestra.save();

        var payload = {
            email: userAmm.email,
        };

        var options = {
            expiresIn: 86400 // expires in 24 hours
        };

        token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    });


    afterAll(async () => {
        mongoose.connection.close(true);
        console.log("Database connection closed");
    });

    test('GET /api/v1/calendari TUTTO OK', async () => {
        var res = await request(app)
            .get('/api/v1/calendari')
            .set('Accept', 'application/json')
            .send({
                'token': token
            }).expect(200);
    });

    test('GET /api/v1/calendari/byid TUTTO OK', async () => {
        var res = await request(app)
            .get('/api/v1/calendari/byid')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                'id': calendarioAmm._id
            }).expect(200);
    });


    test('POST /api/v1/calendari palestra non trovata', async () => {
        let palestraNonSalvata = new Palestra()

        var res = await request(app)
            .post('/api/v1/calendari/')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                'nome': 'corso2',
                'idPalestra': palestraNonSalvata._id
            }).expect(404);
        expect(res.body.message).toMatch('palestra non trovata');
    });

    test('POST /api/v1/calendari TUTTO OK', async () => {
        var res = await request(app)
            .post('/api/v1/calendari/')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                'nome': 'corso2',
                'idPalestra': palestra._id
            }).expect(201);
        expect(res.body.self).toMatch('api\/v1\/calendari\/');
    });

    test('DELETE /api/v1/calendari calendario non trovato', async () => {
        let calendarioNonSalvato = new Calendario();

        var res = await request(app)
            .delete('/api/v1/calendari/')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                'id': calendarioNonSalvato._id,
                'idPalestra': palestra._id
            }).expect(404);
        expect(res.body.message).toBe('calendario non trovato');
    });

    test('DELETE /api/v1/calendari palestra non trovata', async () => {
        let palestraNonSalvata = new Palestra()

        var res = await request(app)
            .delete('/api/v1/calendari/')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                'id': calendarioCorso._id,
                'idPalestra': palestraNonSalvata._id
            }).expect(404);
        expect(res.body.message).toBe('palestra non trovata');
    });

    test('DELETE /api/v1/calendari TUTTO OK', async () => {
        var res = await request(app)
            .delete('/api/v1/calendari/')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                'id': calendarioCorso._id,
                'idPalestra': palestra._id
            }).expect(200);
        expect(res.body.message).toBe('calendario rimosso con sucesso');
    });








})
