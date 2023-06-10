const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken');
const mongoose = require('mongoose');
const abbonamento = require('./models/abbonamento');

//VERIFICA METODO POST
describe('POST /api/v1/abbonamenti', () => {

  const User = require('./models/utente');
  const Palestra = require('./models/palestra');
  const Abbonamento = require('./models/abbonamento');
  
  let userFindById;
  let palestraFindById;
  let abbonamentoFindById;
  let token;
  let self;

  beforeAll( async () => {
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
  
    userFindById = jest.spyOn(User, 'findById').mockImplementation( async (id) => {
      if(id == '1234'){
        return new User({
          nome: "Test",
          cognome: "Test",
          email: "test@test.com",
          password: "Test"
          //idPalestra: "idTest"
        });
      } else {
        return undefined;
      }
    });


    palestraFindById = jest.spyOn(Palestra, 'findById').mockImplementation( async (idPalestra) => {
      if(idPalestra == 'idTest'){
        return new Palestra({
          nome: "Test"
        });
      } else {
        return undefined;
      }
    });

    abbonamentoFindById = jest.spyOn(Abbonamento, 'findById').mockImplementation( async (idAbbonamento) => {
      if(idAbbonamento == 'idTest'){
        return new Abbonamento({
          descrizione: "Test",
          dataInizio: '2000-01-01',
          dataFine: '2000-12-01'
        });
      } else {
        return undefined;
      }
    });
  });

  afterAll(async () =>{
    self = self.slice(19);
    await Abbonamento.findByIdAndRemove(self);
    userFindById.mockRestore();
    palestraFindById.mockRestore();
    abbonamentoFindById.mockRestore();
    await mongoose.connection.close(true); 
  });

  //Abbonamento Inserito
  it('Dovrebbe restituire abbonamento inserito', async () => {
    await request(app)
            .post('/api/v1/abbonamenti')
            .send({
              id: '1234',
              idPalestra: 'idTest',
              token: token
            })
            .expect(200)
            .expect((res) => {
              self = res.body.self;
              expect(res.body.self).toMatch('api\/v1\/abbonamenti\/');
              expect(res.body.success).toBe(true);
              expect(res.body.message).toBe("Abbonamento inserito");
            });
  }); 

//Utente non trovato
  it('Dovrebbe restituire utente non trovato', async () => {
    await request(app)
            .post('/api/v1/abbonamenti')
            .send({
                id: '0001',
                token: token
            })
            .expect({
                success: false,
                message: "Utente non trovato"
            })
            .expect(409);
  });

//idPalestra non trovato
  it('Dovrebbe restituire palestra non trovata', async () => {
    await request(app)
            .post('/api/v1/abbonamenti')
            .send({
                id: '1234',
                idPalestra: 'idSbagliato',
                token: token
            })
            .expect({
                success: false,
                message: "Palestra non trovata"
            })
            .expect(409);
  });

//L'utente possiede già un abbonamento
it('Dovrebbe restituire un errore se utente ha già un abbonamento', async () => {

  const findByIdUtenteMock = jest.spyOn(User, 'findById').mockResolvedValue({
    _id: '123',
    idPalestra: '456',
    abbonamento: '789',
  });

  const findByIdPalestraMock = jest.spyOn(Palestra, 'findById').mockResolvedValue({
    _id: '456',
    nome: 'Palestra di prova',
  });

  const findByIdAbbonamentoMock = jest.spyOn(Abbonamento, 'findById').mockResolvedValue({
    _id: '789',
    descrizione: 'Abbonamento di prova',
    dataInizio: '2022-01-01',
    dataFine: '2022-12-31',
    idPalestra: '456',
  });

  const response = await request(app).post('/api/v1/abbonamenti').send({
    id: '123',
    idPalestra: '456',
    descrizione: 'Abbonamento di prova',
    dataInizio: '2023-01-01',
    dataFine: '2023-12-31',
  });

  expect(response.status).toBe(409);
  expect(response.body).toEqual({
    success: false,
    message: "L'utente possiede già un abbonamento",
  });
  findByIdUtenteMock.mockRestore();
  findByIdPalestraMock.mockRestore();
  findByIdAbbonamentoMock.mockRestore();
});
});


// VERIFICA METODO GET
describe('GET /api/v1/abbonamenti', () => {
  const Abbonamento = require('./models/abbonamento');
  it('Dovrebbe restituire tutti gli abbonamenti', async () => {
    const findMock = jest.spyOn(Abbonamento, 'find').mockResolvedValue([
      { id: '1', descrizione: 'Abbonamento 1' },
      { id: '2', descrizione: 'Abbonamento 2' },
    ]);

    const response = await request(app).get('/api/v1/abbonamenti');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: '1', descrizione: 'Abbonamento 1' },
      { id: '2', descrizione: 'Abbonamento 2' },
    ]);
    findMock.mockRestore();
  });
});

describe('GET /api/v1/abbonamenti/:id', () => {
  const Abbonamento = require('./models/abbonamento');
  it('Dovrebbe restituire abbonamento corretto', async () => {
    const findByIdMock = jest.spyOn(Abbonamento, 'findById').mockResolvedValue({
      _id: 'abc123',
      descrizione: 'Abbonamento di prova',
      dataInizio: '2023-01-01',
      dataFine: '2023-12-31',
    });
    const response = await request(app).get('/api/v1/abbonamenti/123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      self: 'api/v1/abbonamenti/abc123',
      descrizione: 'Abbonamento di prova',
      dataInizio: '2023-01-01',
      dataFine: '2023-12-31',
    });

    findByIdMock.mockRestore();
  });

  it('Dovrebbe restituire un errore se abbonamento non esiste', async () => {
   
    const findByIdMock = jest.spyOn(Abbonamento, 'findById').mockResolvedValue(undefined);
    const response = await request(app).get('/api/v1/abbonamenti/456');

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      success: false,
      message: 'Abbonamento non trovato',
    });
    findByIdMock.mockRestore();
  });
});






