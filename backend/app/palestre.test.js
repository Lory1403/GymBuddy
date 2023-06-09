const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Palestra = require('./models/palestra');
const Abbonamento = require('./models/abbonamento');
const Utente = require('./models/utente');

var payload = {
    email: "test@test.com",
    id: "0000"
}
var options = {
    expiresIn: 86400
}
var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DB_URL);
});

afterAll( async () => {
    await mongoose.connection.close(true);
});

describe('GET /api/v1/palestre', () => {
    
    var palestra;
    
    beforeAll( async () => {
        palestra = await new Palestra ({
            nome: "Test",
            personale: [],
            indirizzo: {
              via: 'Via Sommarive',
              numeroCivico: '9',
              citta: 'Trento'
            },
            calendariCorsi: [],
            abbonamentiDisponibili: []
          }).save();
    });

    afterAll( async () => {
        await palestra.deleteOne();
    });

    it('Dovrebbe restituire le palestre senza la distanza', async () => {
        await request(app)
                .get('/api/v1/palestre')
                .send({
                    token: token
                })
                .expect(200)
                .expect( (res) => {
                    expect(res.body).toEqual(expect.anything());
                });
    });

    it('Dovrebbe restituire le palestre con la distanza', async () => {
        await request(app)
                .get('/api/v1/palestre')
                .set({
                    'latitude': 1.0,
                    'longitude': 1.0 
                })
                .send({
                    token: token
                })
                .expect(200)
                .expect( (res) => {
                    expect(res.body).toEqual(expect.anything());
                });
    });
});

describe('GET /api/v1/palestre/:id', () => {
    
    var palestraFindById;
    var palestra;
    
    beforeAll( async () => {
        palestra = await new Palestra ({
                nome: "Test",
                personale: [],
                indirizzo: {
                  via: 'Via Sommarive',
                  numeroCivico: '9',
                  citta: 'Trento'
                },
                calendariCorsi: [],
                abbonamentiDisponibili: []
              }).save();

        palestraFindById = jest.spyOn(Palestra, 'findById').mockImplementation( async (id) => {
            if(id == 'idErrato'){
                return undefined;
            } else {
                return palestra;
            }
        });
    });

    afterAll( async () => {
        palestraFindById.mockRestore();
        await palestra.deleteOne();
    });

    it('Dovrebbe restituire la palestra cercata', async () => {
        await request(app)
                .get('/api/v1/palestre/' + palestra._id)
                .send({
                    token: token
                })
                .expect(200)
                .expect({
                    self: 'api/v1/palestre/' + palestra._id,
                    nome: palestra.nome,
                    personale: JSON.parse(JSON.stringify(palestra.personale)),
                    indirizzo: JSON.parse(JSON.stringify(palestra.indirizzo))
                });
    });

    it('Dovrebbe restituire palestra non trovata', async () => {
        await request(app)
                .get('/api/v1/palestre/' + 'idErrato')
                .send({
                    token: token
                })
                .expect(400)
                .expect({
                    success: false,
                    message: "Palestra non trovata"
                });
    });
});


describe('POST /api/v1/palestre', () => {
    
    var selfPalestra;
    var selfUtente;
    
    beforeAll( async () => {
    });

    afterAll( async () => {
        selfPalestra = selfPalestra.slice(16);
        await Palestra.findByIdAndRemove(selfPalestra);
        await Utente.findByIdAndRemove(selfUtente);
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
                selfPalestra = res.body.self;
                selfUtente = res.body.personale[0];
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe("Palestra e amministratore creati");
                expect(res.body.self).toMatch('api\/v1\/palestre\/');
                expect(res.body.nome).toBe('test');
                expect(res.body.personale).toBeInstanceOf(Array);
                expect(res.body.indirizzo.via).toBe('via');
            });

    });
});


describe('POST /api/v1/palestre/:idPalestra/aggiungiAbbonamento', () => {

    var palestraFindById;
    var palestra;

    beforeAll( async () => {
        palestra = await new Palestra ({
                nome: "Test",
                personale: [],
                indirizzo: {
                  via: 'Via Sommarive',
                  numeroCivico: 9,
                  citta: 'Trento'
                },
                calendariCorsi: [],
                abbonamentiDisponibili: []
              }).save();

        palestraFindById = jest.spyOn(Palestra, 'findById').mockImplementation( async (id) => {
            if(id == 'idErrato'){
                return undefined;
            } else {
                return palestra;
            }
        });
    });

    afterAll( async () => {
        palestraFindById.mockRestore();
        await palestra.deleteOne();
    });

    it('Dovrebbe restituire palestra non trovata', async () => {
        await request(app)
                .post('/api/v1/palestre/' + 'idErrato' + '/aggiungiAbbonamento')
                .send({
                    token: token
                })
                .expect(400)
                .expect({
                    success: false,
                    message: "Palestra non trovata"
                });
    });

    it('Dovrebbe restituire abbonamento template salvato', async () => {
        await request(app)
                .post('/api/v1/palestre/' + palestra._id + '/aggiungiAbbonamento')
                .send({
                    token: token
                })
                .expect(201)
                .expect( async (res) => {
                    expect(res.body.success).toBe(true);
                    expect(res.body.message).toBe("Abbonamento template salvato con successo");
                    expect(res.body.idAbbonamento).toEqual(expect.any(String));
                    await Abbonamento.findByIdAndDelete(res.body.idAbbonamento);
                });
    });
});


describe('POST /api/v1/palestre/:idPalestra/rimuoviAbbonamento', () => {
    
    var palestraFindById;
    var abbonamentoFindById;
    var palestra;
    var abbonamento;
    var abbonamentoErrato;
    
    beforeAll( async () => {
        palestra = await new Palestra ({
            nome: "Test",
            personale: [],
            indirizzo: {
              via: 'Via Sommarive',
              numeroCivico: 9,
              citta: 'Trento'
            },
            calendariCorsi: [],
            abbonamentiDisponibili: []
        }).save();

        abbonamento = await new Abbonamento ({
            descrizione: "Annuale",
            dataInizio: "",
            dataFine: "",
            idPalestra: palestra._id
        }).save();

        palestra.abbonamentiDisponibili.push(abbonamento._id);
        await palestra.save();

        abbonamentoErrato = await new Abbonamento ({
            descrizione: "Annuale",
            dataInizio: "",
            dataFine: "",
            idPalestra: palestra._id
        }).save();

        palestraFindById = jest.spyOn(Palestra, 'findById').mockImplementation( async (id) => {
            if(id == 'idErrato'){
                return undefined;
            } else {
                return palestra;
            }
        });

        abbonamentoFindById = jest.spyOn(Abbonamento, 'findById').mockImplementation( async (id) => {
            if(id == 'idErrato'){
                return undefined;
            } else if (id == abbonamentoErrato._id) {
                return abbonamentoErrato;
            } else {
                return abbonamento;
            }
        });
    });

    afterAll( async () => {
        palestraFindById.mockRestore();
        abbonamentoFindById.mockRestore();
        await abbonamento.deleteOne();
        await abbonamentoErrato.deleteOne();
        await palestra.deleteOne();
    });

    it('Dovrebbe restituire palestra non trovata', async () => {
        await request(app)
                .post('/api/v1/palestre/' + 'idErrato' + '/rimuoviAbbonamento')
                .send({
                    token: token
                })
                .expect(400)
                .expect({
                    success: false,
                    message: "Palestra non trovata"
                });
    });

    it('Dovrebbe restituire abbonamento non trovato', async () => {
        await request(app)
                .post('/api/v1/palestre/' + palestra._id + '/rimuoviAbbonamento')
                .send({
                    token: token,
                    abbonamento: "idErrato"
                })
                .expect(400)
                .expect({
                    success: false,
                    message: "Abbonamento non trovato"
                });
    });

    it('Dovrebbe restituire abbonamento non presente nella palestra', async () => {
        await request(app)
                .post('/api/v1/palestre/' + palestra._id + '/rimuoviAbbonamento')
                .send({
                    token: token,
                    abbonamento: abbonamentoErrato._id
                })
                .expect(400)
                .expect({
                    success: false,
                    message: "Abbonamento non presente nella palestra"
                });
    });


    it('Dovrebbe restituire abbonamento template rimosso con successo', async () => {
        await request(app)
                .post('/api/v1/palestre/' + palestra._id + '/rimuoviAbbonamento')
                .send({
                    token: token,
                    abbonamento: abbonamento._id
                })
                .expect(200)
                .expect({
                    success: true,
                    message: "Abbonamento template rimosso con successo"
                });
    });
});


describe('DELETE /api/v1/palestre/:id', () => {
    
    var palestraFindById;
    var palestra;
    var utente;
    
    beforeAll( async () => {

        palestra = await new Palestra ({
            nome: "Test",
            personale: [],
            indirizzo: {
              via: 'Via Sommarive',
              numeroCivico: 9,
              citta: 'Trento'
            },
            calendariCorsi: [],
            abbonamentiDisponibili: []
        }).save();

        utente = await new Utente ({
            nome: "Nome",
            cognome: "Cognome",
            email: "email@gmail.com",
            password: "Password",
            ruolo: "amm",
            idPalestra: palestra._id 
        }).save();

        palestra.personale.push(utente._id);
        palestra.save();

        palestraFindById = jest.spyOn(Palestra, 'findById').mockImplementation( async (id) => {
            if(id == 'idErrato'){
                return undefined;
            } else {
                return palestra;
            }
        });
    });

    afterAll( async () => {
        palestraFindById.mockRestore();
    });

    it('Dovrebbe restituire palestra non trovata', async () => {
        await request(app)
                .delete('/api/v1/palestre/' + 'idErrato')
                .send({
                    token: token
                })
                .expect(400)
                .expect({
                    success: false,
                    message: "Palestra non trovata"
                });
    });

    it('Dovrebbe restituire palestra rimossa con successo', async () => {
        await request(app)
                .delete('/api/v1/palestre/' + palestra._id)
                .send({
                    token: token
                })
                .expect(200)
                .expect({
                    success: true,
                    message: "Palestra rimossa con successo"
                });
    });
});