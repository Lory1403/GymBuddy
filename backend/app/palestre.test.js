const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const palestra = require('./models/palestra');
const Abbonamento = require('./models/abbonamento');
describe('POST /api/v1/palestre', () => {

    let token;

    beforeAll(async () => {
        jest.setTimeout(8000);
        app.locals.db = await mongoose.connect(process.env.DB_URL);

        var payload = {
            email: "test@test.com",
            googleID: "0000"
        }
        var options = {
            expiresIn: 86400
        }
        token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    });

    afterAll(async () => {
        mongoose.connection.close(true);
    });

    it('Dovrebbe restituire palestra creata', async () => {
        await request(app)
            .post('/api/v1/palestre')
            .send({
                token: token,
                nome: 'test',
                indirizzo: {
                    via: 'via'
                },
                nomeAmm: 'utente',
                cognomeAmm: 'utente',
                emailAmm: 'test@test.com',
                passwordAmm: 'test'
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe("Palestra e amministratore creati");
                expect(res.body.self).toMatch('api\/v1\/palestre\/');
                expect(res.body.nome).toBe('test');
                expect(res.body.personale).toBeInstanceOf(Array);
                expect(res.body.indirizzo.via).toBe('via');
            });

    });

    it('should return error when palestra is not found', async () => {
        const fakeDescrizione = 'Abbonamento Test';
        const fakePalestra = new palestra({
            nome: 'test',
            indirizzo: {
                via: 'via'
            },
            abbonamentiDisponibili: []
        });

        // Sovrascrivi il metodo findById del modello Palestra per restituire null
        palestra.findById = async (id) => null;

        // Chiamata al tuo endpoint con ID palestra fittizio e dati abbonamento
        const response = await request(app)
            .post(`/api/v1/palestre/${fakePalestra._id}/aggiungiAbbonamento`)
            .send({ descrizione: fakeDescrizione });

        // Verifica che la risposta contenga i dati corretti
        const expectedResponse = {
            success: false,
            message: 'Palestra non trovata'
        };
    });
    //manca un test should add a new abbonamento and return success


    it('should add a new abbonamento and return success', async () => {
        const fakeDescrizione = 'Abbonamento Test';

        const fakePalestra = new palestra({
            nome: 'test',
            indirizzo: {
                via: 'via'
            },
            abbonamentiDisponibili: []
        });

        // Sovrascrivi il metodo findById del modello Palestra per restituire la palestra fake
        palestra.findById = async (id) => fakePalestra;

        // Sovrascrivi il metodo save del modello Abbonamento per restituire l'abbonamento fake
        Abbonamento.prototype.save = async function () {
            this._id = 'fakeAbbonamentoId';
            return this;
        };

        // Chiamata al tuo endpoint con ID palestra fittizio e dati abbonamento
        const response = await request(app)
            .post(`/api/v1/palestre/${fakePalestra._id}/aggiungiAbbonamento`)
            .send({ descrizione: fakeDescrizione });

    });

    
    it('should handle case when abbonamento does not exist', async () => {
        const fakePalestra = new palestra({
            nome: 'test',
            indirizzo: {
                via: 'via'
            },
            abbonamentiDisponibili: []
        });
        const fakeAbbonamento = new Abbonamento({
            descrizione: 'descrizione abbonamento'

        });

        // Sovrascrivi il metodo findById del modello Palestra per restituire una palestra fake
        palestra.findById = async (id) => {
            if (id === fakePalestra._id) {
                return {
                    _id: fakePalestra._id,
                    abbonamentiDisponibili: [],
                    save: async () => { } // Mock del metodo save per evitare errori
                };
            }
            return null;
        };

        // Sovrascrivi il metodo findById del modello Abbonamento per restituire un abbonamento fake
        Abbonamento.findById = async (id) => {
            if (id === fakeAbbonamento._id) {
                return null;
            }
            return null;
        };

        // Chiamata al tuo endpoint
        const response = await request(app)
            .post(`/api/v1/palestre/${fakePalestra._id}/rimuoviAbbonamento`)
            .send({ abbonamento: fakeAbbonamento._id });

        // Verifica che la risposta abbia uno stato 404 (Not Found)


        // Verifica che la risposta contenga i dati corretti
        const expectedResponse = {
            success: false,
            message: 'Abbonamento non trovato'
        };

    });
    it('should remove the abbonamento from the palestra and return success', async () => {

        const fakePalestra = new palestra({
            nome: 'test',
            indirizzo: {
                via: 'via'
            },
        });


        const fakeAbbonamento = {

            deleteOne: async function () {
                delete this._id;
            }
        };

        // Sovrascrivi il metodo findById del modello Palestra per restituire la palestra fake
        palestra.findById = async (id) => fakePalestra;

        // Sovrascrivi il metodo findById del modello Abbonamento per restituire l'abbonamento fake
        Abbonamento.findById = async (id) => fakeAbbonamento;

        // Sovrascrivi il metodo pull del mock di palestra.abbonamentiDisponibili per rimuovere l'ID abbonamento fake
        fakePalestra.abbonamentiDisponibili.pull = (id) => {
            const index = fakePalestra.abbonamentiDisponibili.indexOf(id);
            if (index !== -1) {
                fakePalestra.abbonamentiDisponibili.splice(index, 1);
            }
        };

        // Sovrascrivi il metodo deleteOne del mock di abbonamento per rimuovere l'ID abbonamento fake
        fakeAbbonamento.deleteOne = () => {
            delete fakeAbbonamento._id;
        };

        // Chiamata al tuo endpoint con ID palestra fittizio e ID abbonamento fittizio
        const response = await request(app)
            .post(`/api/v1/palestre/${fakePalestra._id}/rimuoviAbbonamento`)
            .send({ abbonamento: fakeAbbonamento._id });


    });



});
describe('GET /api/v1/palestre.test.js', () => {
    it('sDovrebbe ritornare tutte le paestre', async () => {
        const fakeId = 'fakeId';
        const fakePalestra = {
            id: fakeId,
            nome: 'Palestra Test',
            personale: 'Fake Personale',
            indirizzo: 'Fake Indirizzo'
        };

        // Sovrascrivi il metodo findById del modello Palestra per restituire i dati fake
        palestra.findById = jest.fn().mockResolvedValue(fakePalestra);

        // Chiamata al tuo endpoint con un ID fittizio
        const res = await request(app).get(`/api/v1/palestre/${fakeId}`);

        // Verifica che la risposta abbia uno stato 200 e i dati corretti
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            self: `api/v1/palestre/${fakeId}`,
            nome: 'Palestra Test',
            personale: 'Fake Personale',
            indirizzo: 'Fake Indirizzo'
        });

        // Verifica che il metodo findById sia stato chiamato con l'ID corretto
        expect(palestra.findById).toHaveBeenCalledWith(fakeId);
    });


    it('should return all palestre', async () => {
        const fakePalestre = [
            { nome: 'Palestra 1', indirizzo: 'Indirizzo 1' },
            { nome: 'Palestra 2', indirizzo: 'Indirizzo 2' },
            { nome: 'Palestra 3', indirizzo: 'Indirizzo 3' }
        ];

        // Sovrascrivi il metodo find del modello Palestra per restituire le palestre fake
        palestra.find = async () => fakePalestre;

        // Chiamata al tuo endpoint
        const response = await request(app).get('/api/v1/palestre');
    });

});


describe('DELETE app/palestre.test.js', () => {
    it('should delete the palestra and return success', async () => {
        const fakeIdPalestra = 'fakeIdPalestra';

        const fakePalestra = {
            _id: fakeIdPalestra,
            personale: [{ _id: 'fakeUtenteId1' }, { _id: 'fakeUtenteId2' }]
        };

        // Sovrascrivi il metodo findById del modello Palestra per restituire la palestra fake
        palestra.findById = async (id) => fakePalestra;

        // Sovrascrivi il metodo deleteOne del modello Palestra per simulare la rimozione della palestra
        fakePalestra.deleteOne = async function () {
            delete this._id;
        };

        // Sovrascrivi il metodo deleteOne del modello Utente per simulare la rimozione degli utenti
        fakePalestra.personale.map((utente) => {
            utente.deleteOne = async function () {
                delete this._id;
            };
        });

        // Chiamata al tuo endpoint con l'ID fittizio della palestra
        const response = await request(app)
            .delete(`/api/v1/palestre/${fakeIdPalestra}`);

        // Verifica che la risposta abbia uno stato 204 (No Content)
        if (response.status !== 204) {
            throw new Error('Expected status code 204, received: ' + response.status);
        }

        // Verifica che la palestra sia stata rimossa
        if (fakePalestra.hasOwnProperty('_id')) {
            throw new Error('Palestra was not removed');
        }
    });

    it('should return error when palestra is not found', async () => {
        const fakeIdPalestra = 'fakeIdPalestraNotFound';

        // Sovrascrivi il metodo findById del modello Palestra per restituire null
        palestra.findById = async (id) => null;

        // Chiamata al tuo endpoint con l'ID fittizio della palestra
        const response = await request(app)
            .delete(`/api/v1/palestre/${fakeIdPalestra}`);

        // Verifica che la risposta abbia uno stato 404 (Not Found)
        if (response.status !== 404) {
            throw new Error('Expected status code 404, received: ' + response.status);
        }

        // Verifica che la risposta contenga i dati corretti
        const expectedResponse = {
            success: false,
            message: 'Palestra non trovata'
        };
        if (!response.body || JSON.stringify(response.body) !== JSON.stringify(expectedResponse)) {
            throw new Error('Response body does not match the expected data');
        }
    });
});