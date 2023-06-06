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
    userFindById.mockRestore();
    palestraFindById.mockRestore();
    abbonamentoFindById.mockRestore();

    mongoose.connection.close(true); 
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
            .expect({
              self: 'api/v1/abbonamenti/' + idAbbonamento,
              success: true,
              message: "Abbonamento inserito"
            })
            .expect(200);
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

});


// VERIFICA METODO GET




