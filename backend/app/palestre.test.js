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

    it('Dovrebbe restituire palestra non trovata ', async () => {
        const fakeDescrizione = 'Abbonamento Test';
        const fakePalestra = new palestra({
            nome: 'test',
            indirizzo: {
                via: 'via'
            },
            abbonamentiDisponibili: []
        });

        palestra.findById = async (id) => null;

        const response = await request(app)
            .post(`/api/v1/palestre/${fakePalestra._id}/aggiungiAbbonamento`)
            .send({ descrizione: fakeDescrizione });

        const expectedResponse = {
            success: false,
            message: 'Palestra non trovata'
        };
    });

    it('Dovrebbe aggiungere un nuovo abbonamento', async () => {
        const fakeDescrizione = 'Abbonamento Test';

        const fakePalestra = new palestra({
            nome: 'test',
            indirizzo: {
                via: 'via'
            },
            abbonamentiDisponibili: []
        });

        palestra.findById = async (id) => fakePalestra;

        Abbonamento.save = async function () {
            this._id = 'fakeAbbonamentoId';
            return this;
        };

        const response = await request(app)
            .post(`/api/v1/palestre/${fakePalestra._id}/aggiungiAbbonamento`)
            .send({ descrizione: fakeDescrizione });

    });

    
    it('dovrebbe gestire il caso in cui l\'abbonamento non esiste', async () => {
        
        const abbonamento1 = new Abbonamento({
            desxrizione: ' abbonamento 1'
        });
        const abbonamento2 = new Abbonamento({
            desxrizione: ' abbonamento 1'
        });
        const abbonamento3 = new Abbonamento({
            desxrizione: ' abbonamento 1'
        });

        const fakePalestra = new palestra({
            nome: 'test',
            indirizzo: {
                via: 'via'
            },
            abbonamentiDisponibili: [abbonamento1, abbonamento2, abbonamento3]
        });
        const fakeAbbonamento = new Abbonamento({
            descrizione: 'descrizione abbonamento'

        });

        palestra.findById = async (id) => {
            if (id === fakePalestra._id) {
                return {
                    _id: fakePalestra._id,
                    abbonamentiDisponibili: [],
                    save: async () => { } 
                };
            }
            return null;
        };

        Abbonamento.findById = async (id) => {
            if (id === fakeAbbonamento._id) {
                return null;
            }
            return null;
        };

        const response = await request(app)
            .post(`/api/v1/palestre/${fakePalestra._id}/rimuoviAbbonamento`)
            .send({ abbonamento: fakeAbbonamento._id });

        const expectedResponse = {
            success: false,
            message: 'Abbonamento non trovato'
        };

    });
    it('Dovrebbe togliere l\'abbonamento dalla palestra e restituire il successo', async () => {

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

        palestra.findById = async (id) => fakePalestra;

        Abbonamento.findById = async (id) => fakeAbbonamento;

        fakePalestra.abbonamentiDisponibili.pull = (id) => {
            const index = fakePalestra.abbonamentiDisponibili.indexOf(id);
            if (index !== -1) {
                fakePalestra.abbonamentiDisponibili.splice(index, 1);
            }
        };

        fakeAbbonamento.deleteOne = () => {
            delete fakeAbbonamento._id;
        };

        const response = await request(app)
            .post(`/api/v1/palestre/${fakePalestra._id}/rimuoviAbbonamento`)
            .send({ abbonamento: fakeAbbonamento._id });


    });

//54545454444444444444444444444444444444444444444444
it('Dovrebbe rimuovere correttamente l\'abbonamento', async () => {
    
    // Simula un abbonamento esistente
    const fakeAbbonamento = {
        dewscrizione: 'desscrizione'
      };
    
    // Simula una palestra esistente
    const fakePalestra = {
      
      abbonamentiDisponibili: [fakeAbbonamento._id]
    };
   
    jest.spyOn(palestra, 'findById').mockResolvedValue(fakePalestra);
    jest.spyOn(Abbonamento, 'findById').mockResolvedValue(fakeAbbonamento);

    const response = await request(app)
      .post('/api/v1/palestre/fakePalestraId/rimuoviAbbonamento')
      .send({ abbonamento: fakeAbbonamento._id })
      .expect(404);

    // Verifica la risposta
    expect(response.body).toEqual({
        success: false,
        message: 'Abbonamento non trovato'
      });
      fakePalestra._id = 'fakePalestraId';

      const saveMock = jest.fn();
      fakePalestra.save = saveMock;
      
      // Assert che il metodo save() sia stato chiamato
     
    // Verifica che i metodi siano stati chiamati correttamente
    expect(palestra.findById).toHaveBeenCalledWith('fakePalestraId');
    expect(Abbonamento.findById).toHaveBeenCalledWith(fakeAbbonamento._id);
    expect(fakePalestra.abbonamentiDisponibili).toContain(fakeAbbonamento._id);

    expect(saveMock).toHaveBeenCalled();
    expect(fakeAbbonamento.deleteOne).toHaveBeenCalled();

    // Ripristina i metodi originali
    Palestra.findById.mockRestore();
    Abbonamento.findById.mockRestore();
  });









});
describe('GET /api/v1/palestre.test.js', () => {
    it('Dovrebbe ritornare tutte le paestre', async () => {
        const fakeId = 'fakeId';
        const fakePalestra = {
            id: fakeId,
            nome: 'Palestra Test',
            personale: 'Fake Personale',
            indirizzo: 'Fake Indirizzo'
        };

        palestra.findById = jest.fn().mockResolvedValue(fakePalestra);

        const res = await request(app).get(`/api/v1/palestre/${fakeId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            self: `api/v1/palestre/${fakeId}`,
            nome: 'Palestra Test',
            personale: 'Fake Personale',
            indirizzo: 'Fake Indirizzo'
        });

        expect(palestra.findById).toHaveBeenCalledWith(fakeId);
    });


    it('Dovrebbe ritornare tutte le palestre', async () => {
        const fakePalestre = [
            { nome: 'Palestra 1', indirizzo: 'Indirizzo 1' },
            { nome: 'Palestra 2', indirizzo: 'Indirizzo 2' },
            { nome: 'Palestra 3', indirizzo: 'Indirizzo 3' }
        ];

        palestra.find = async () => fakePalestre;

        const response = await request(app).get('/api/v1/palestre');
    });

});


describe('DELETE app/palestre.test.js', () => {
    it('Dovrebbe eliminare la palestre e ritonrare il successo', async () => {
        const fakeIdPalestra = 'fakeIdPalestra';

        const fakePalestra = {
            _id: fakeIdPalestra,
            personale: [{ _id: 'fakeUtenteId1' }, { _id: 'fakeUtenteId2' }]
        };

        palestra.findById = async (id) => fakePalestra;
        fakePalestra.deleteOne = async function () {
            delete this._id;
        };

        fakePalestra.personale.map((utente) => {
            utente.deleteOne = async function () {
                delete this._id;
            };
        });

        const response = await request(app)
            .delete(`/api/v1/palestre/${fakeIdPalestra}`);

        if (fakePalestra.hasOwnProperty('_id')) {
            throw new Error('Palestra was not removed');//genera un'eccezione e interrompere immediatamente l'esecuzione del codice in quel punto
        }
    });

    it('Dovrebbe ritornare errore quando non trova la palestra', async () => {
        const fakeIdPalestra = 'fakeIdPalestraNotFound';

        palestra.findById = async (id) => null;

        const response = await request(app)
            .delete(`/api/v1/palestre/${fakeIdPalestra}`);

        const expectedResponse = {
            success: false,
            message: 'Palestra non trovata'
        };
        if (!response.body || JSON.stringify(response.body) !== JSON.stringify(expectedResponse)) {
            throw new Error('Response body does not match the expected data');
        }
    });
});