const request = require('supertest');
const express = require('express');
const app = express();
const router = require('./router');
const Palestra = require('./models/palestra');
const Abbonamento = require('./models/abbonamento');
const Utente = require('./models/utente');

// Aggiungi il router alle route dell'app Express
app.use('/api/v1/palestre', router);

describe('Test API endpoints', () => {
  afterAll(async () => {
    // Pulizia dei dati dopo i test
    await Palestra.deleteMany({});
    await Abbonamento.deleteMany({});
    await Utente.deleteMany({});
  });

  it('should get all palestre', async () => {
    const response = await request(app).get('/api/v1/palestre');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create a new palestra', async () => {
    const response = await request(app).post('/api/v1/palestre').send({
      nome: 'Palestra 1',
      indirizzo: 'Via Palestra 1',
      nomeAmm: 'Nome Amministratore',
      cognomeAmm: 'Cognome Amministratore',
      emailAmm: 'admin@example.com',
      passwordAmm: 'password',
    });
    expect(response.status).toBe(201);
  });

  it('should not create a new palestra with invalid data', async () => {
    const response = await request(app).post('/api/v1/palestre').send({});
    expect(response.status).toBe(400);
  });

  it('should get a palestra by id', async () => {
    const palestra = new Palestra({
      nome: 'Palestra Test',
      indirizzo: 'Via Test 1',
    });
    await palestra.save();

    const response = await request(app).get(`/api/v1/palestre/${palestra._id}`);
    expect(response.status).toBe(200);
    expect(response.body.nome).toBe('Palestra Test');
  });

  it('should add an abbonamento to a palestra', async () => {
    const palestra = new Palestra({
      nome: 'Palestra Test',
      indirizzo: 'Via Test 1',
    });
    await palestra.save();

    const response = await request(app)
      .post(`/api/v1/palestre/${palestra._id}/aggiungiAbbonamento`)
      .send({
        descrizione: 'Abbonamento Test',
      });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    const updatedPalestra = await Palestra.findById(palestra._id);
    expect(updatedPalestra.abbonamentiDisponibili.length).toBe(1);
  });

  it('should remove an abbonamento from a palestra', async () => {
    const palestra = new Palestra({
      nome: 'Palestra Test',
      indirizzo: 'Via Test 1',
    });
    await palestra.save();

    const abbonamento = new Abbonamento({
      descrizione: 'Abbonamento Test',
      idPalestra: palestra._id,
    });
    await abbonamento.save();

    palestra.abbonamentiDisponibili.push(abbonamento._id);
    await palestra.save();

    const response = await request(app)
      .post(`/api/v1/palestre/${palestra._id}/rimuoviAbbonamento`)
      .send({
      abbonamento: abbonamento._id,
      });
      expect(response.status).toBe(204);
    const updatedPalestra = await Palestra.findById(palestra._id);
      expect(updatedPalestra.abbonamentiDisponibili.length).toBe(0);
    });

    it('should delete a palestra by id', async () => {
        const palestra = new Palestra({
        nome: 'Palestra Test',
        indirizzo: 'Via Test 1',
    });
    await palestra.save();
    const response = await request(app).delete(`/api/v1/palestre/${palestra._id}`);
        expect(response.status).toBe(204);

    const deletedPalestra = await Palestra.findById(palestra._id);
        expect(deletedPalestra).toBeNull();
    });

    it('should not get a palestra with invalid id', async () => {
    const response = await request(app).get('/api/v1/palestre/invalid-id');
    expect(response.status).toBe(404);
    });
    
    it('should not add an abbonamento to a non-existing palestra', async () => {
        const response = await request(app)
            .post('/api/v1/palestre/non-existing-id/aggiungiAbbonamento')
            .send({
        descrizione: 'Abbonamento Test',
    });
    expect(response.status).toBe(400);
    });
    
    it('should not remove a non-existing abbonamento from a palestra', async () => {
        const palestra = new Palestra({
            nome: 'Palestra Test',
            indirizzo: 'Via Test 1',
    });
    await palestra.save();
    const response = await request(app)
        .post(`/api/v1/palestre/${palestra._id}/rimuoviAbbonamento`)
        .send({
        abbonamento: 'non-existing-id',
    });
    expect(response.status).toBe(404);
    const response = await request(app)
        .post(`/api/v1/palestre/${palestra._id}/rimuoviAbbonamento`)
        .send({
        abbonamento: 'non-existing-id',
    });
    expect(response.status).toBe(404);
});

    it('should not delete a non-existing palestra', async () => {
        const response = await request(app).delete('/api/v1/palestre/non-existing-id');
        expect(response.status).toBe(404);
    });
});