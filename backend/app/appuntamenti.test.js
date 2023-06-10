const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');
const Calendario = require('./models/calendario');
const Utente = require('./models/utente');
const Palestra = require('./models/palestra');
const Appuntamento = require('./models/appuntamento');



describe('/api/v1/appuntamenti', () => {
    let calendario1;
    let calendario2;
    let calendario3;
    let calendarioAmm;
    let calendarioCorso;
    let user1;
    let user2;
    let user3;
    let userAmm;
    let token;
    let palestra;
    let appuntamento1;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        app.locals.db = await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

        appuntamento1 = await new Appuntamento({
            titolo: 'appuntamento test 1',
            data: '1/1/1111 11:11:11',
            descrizione: 'test descrizione',
        }).save()
        calendario1 = await new Calendario({
            nome: 'calendarioTest1',
            appuntamenti: [appuntamento1._id]
        }).save();
        user1 = await new Utente({
            nome: 'test 1',
            cognome: 'test 1',
            email: 'email.test1@prova.it',
            password: 'password1',
            idCalendario: calendario1._id,
            ruolo: 'abb',
        }).save();
        appuntamento1.involves.push(user1._id);
        appuntamento1.save();

        console.log(calendario1);

        calendario2 = await new Calendario({
            nome: 'calendarioTest2'
        }).save();
        user2 = await new Utente({
            nome: 'test 2',
            cognome: 'test 2',
            email: 'email.test2@prova.it',
            password: 'password2',
            idCalendario: calendario2._id,
            ruolo: 'abb'
        }).save();

        calendario3 = await new Calendario({
            nome: 'calendarioTest3'
        }).save();
        user3 = await new Utente({
            nome: 'test 3',
            cognome: 'test 3',
            email: 'email.test3@prova.it',
            password: 'password3',
            idCalendario: calendario3._id,
            ruolo: 'abb'
        }).save();

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
            ruolo: 'amm',
            idPalestra: palestra._id
        }).save();


        palestra.personale.push(userAmm._id);
        await palestra.save();

        var payload = {
            email: userAmm.email
        };

        var options = {
            expiresIn: 86400 // expires in 24 hours
        };

        token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    });

    afterAll(async () => {
        await calendario1.deleteOne();
        await user1.deleteOne();
        await calendario2.deleteOne();
        await user2.deleteOne();
        await calendario3.deleteOne();
        await user3.deleteOne();
        await calendarioAmm.deleteOne();
        await userAmm.deleteOne();
        await palestra.deleteOne();
        await mongoose.connection.close(true);
        console.log("Database connection closed");
    });

    test('GET /api/v1/appuntamenti TUTTO OK', async () => {
        var res = await request(app)
            .get('/api/v1/appuntamenti')
            .set('Accept', 'application/json')
            .send({
                'token': token
            }).expect(200);
    });

    test('GET /api/v1/appuntamenti/byuser idUtente mancante', async () => {
        var res = await request(app)
            .get('/api/v1/appuntamenti/byuser')
            .set('Accept', 'application/json')
            .send({
                'token': token
            }).expect(400);

        expect(res.body.message).toBe('idUtente mancante');
    });

    test('GET /api/v1/appuntamenti/byuser utente non trovato', async () => {
        let utenteNonSalvato = new Utente();

        var res = await request(app)
            .get('/api/v1/appuntamenti/byuser')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                'idUtente': utenteNonSalvato._id
            }).expect(404);

        expect(res.body.message).toBe('utente non trovato');
    });

    test('GET /api/v1/appuntamenti/byuser TUTTO OK', async () => {
        var res = await request(app)
            .get('/api/v1/appuntamenti/byuser')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                'idUtente': user1._id
            }).expect(200);
    });

    test('GET /api/v1/appuntamenti/bycalendar idCalendario mancante', async () => {
        var res = await request(app)
            .get('/api/v1/appuntamenti/bycalendar')
            .set('Accept', 'application/json')
            .send({
                'token': token
            }).expect(400);

        expect(res.body.message).toBe('idCalendario mancante');
    });

    test('GET /api/v1/appuntamenti/bycalendar calendario non trovato', async () => {
        let calendarioNonSalvato = new Calendario();
        var res = await request(app)
            .get('/api/v1/appuntamenti/bycalendar')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                'idCalendario': calendarioNonSalvato._id
            }).expect(404);

        expect(res.body.message).toBe('calendario non trovato');
    });

    test('GET /api/v1/appuntamenti/bycalendar TUTTO OK', async () => {
        var res = await request(app)
            .get('/api/v1/appuntamenti/bycalendar')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                'idCalendario': calendario1._id
            }).expect(200);
    });

    test('POST /api/v1/appuntamenti titolo non specificato', async () => {
        var res = await request(app)
            .post('/api/v1/appuntamenti')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .send({
                'title': '',
                'date': 'll',
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

    test('POST /api/v1/appuntamenti uno dei coinvolti non esiste nel DB', async () => {

        let utenteNonSalvato = new Utente();

        var res = await request(app)
            .post('/api/v1/appuntamenti')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .send({
                'title': 'test1',
                'date': '1/1/1111 11:11:11',
                'descrizione': 'test descrizione',
                'involved': [user1._id, user2._id, user3._id, utenteNonSalvato._id]
            }).expect(206);

        expect(res.body.message).toBe('uno degli utenti coinvolti non è stato trovato');

    });

    test('POST /api/v1/appuntamenti tutto ok', async () => {
        var res = await request(app)
            .post('/api/v1/appuntamenti')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .send({
                'title': 'test1',
                'date': '1/1/1111 11:11:11',
                'descrizione': 'test descrizione',
                'involved': [user1._id, user2._id, user3._id]
            }).expect(201);

    });

    test('POST /api/v1/appuntamenti/corso titolo non specificato', async () => {
        var res = await request(app)
            .post('/api/v1/appuntamenti/corso')
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

    test('POST /api/v1/appuntamenti/corso data non specificata', async () => {
        var res = await request(app)
            .post('/api/v1/appuntamenti/corso')
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

    test('POST /api/v1/appuntamenti/corso descrizione non specificata', async () => {
        var res = await request(app)
            .post('/api/v1/appuntamenti/corso')
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

    test('POST /api/v1/appuntamenti/corso coinvolti non specificati', async () => {
        var res = await request(app)
            .post('/api/v1/appuntamenti/corso')
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

    test('POST /api/v1/appuntamenti/corso utente non amministratore', async () => {
        var payload = {
            email: user1.email,
        };

        var options = {
            expiresIn: 86400 // expires in 24 hours
        };

        let notAmmToken = jwt.sign(payload, process.env.SUPER_SECRET, options);
        var res = await request(app)
            .post('/api/v1/appuntamenti/corso')
            .set('Accept', 'application/json')
            .send({
                'token': notAmmToken,
                'title': 'test 1',
                'date': '1/1/1111 11:11:11',
                'descrizione': 'test descrizione',
                'involved': [user1._id, user2._id, user3._id]
            }).expect(401);

        expect(res.body.message).toBe('utente non amminstratore');

    });

    test('POST /api/v1/appuntamenti/corso calendario corso non esistente', async () => {
        var res = await request(app)
            .post('/api/v1/appuntamenti/corso')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                'title': 'test 1',
                'date': '1/1/1111 11:11:11',
                'descrizione': 'test descrizione',
                'involved': [user1._id, user2._id, user3._id],
                'courseName': 'corsoTestNO'
            }).expect(404);

        expect(res.body.message).toBe('calendario corso non trovato');

    });

    test('POST /api/v1/appuntamenti/corso TUTTO OK', async () => {
        var res = await request(app)
            .post('/api/v1/appuntamenti/corso')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                'title': 'test 1',
                'date': '1/1/1111 11:11:11',
                'descrizione': 'test descrizione',
                'involved': [user1._id, user2._id, user3._id],
                'courseName': 'corsoTest'
            }).expect(201);

    });

    test('DELETE /api/v1/appuntamenti id apuntamento mancante', async () => {
        var res = await request(app)
            .delete('/api/v1/appuntamenti')
            .set('Accept', 'application/json')
            .send({
                'token': token,
            }).expect(400);

        expect(res.body.message).toBe('id appuntemento mancante');
    });

    test('DELETE /api/v1/appuntamenti apuntamento non trovato', async () => {
        let AppuntamentoNonSalvato = new Appuntamento();

        var res = await request(app)
            .delete('/api/v1/appuntamenti')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                '_id': AppuntamentoNonSalvato._id
            }).expect(404);

        expect(res.body.message).toBe('appuntamento non trovato');
    });

    test('DELETE /api/v1/appuntamenti TUTTO OK', async () => {
        var res = await request(app)
            .delete('/api/v1/appuntamenti')
            .set('Accept', 'application/json')
            .send({
                'token': token,
                '_id': appuntamento1._id
            }).expect(204);
    });

});