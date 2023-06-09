<template>
    <div class="page">
      <h1>{{ palestraName }}</h1>
      <div class="container">
        <div class="subscription-list">
          <h2>Abbonamenti disponibili</h2>
          <ul>
            <li v-for="abbonamento in abbonamenti" :key="abbonamento.id">
              <span>{{ abbonamento.nome }}</span>
              <span>{{ abbonamento.prezzo }}</span>
              <button @click="acquistaAbbonamento(abbonamento.id)">Acquista</button>
            </li>
          </ul>
        </div>
        <div class="course-list">
          <h2>Corsi</h2>
          <ul>
            <li v-for="corso in corsi" :key="corso.id">
              <span>{{ corso.nome }}</span>
              <span>{{ corso.data }}</span>
              <span>{{ corso.ora }}</span>
              <button @click="prenotaPosto(corso.id)">Prenota posto</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        palestraName: 'Nome della Palestra',
        abbonamenti: [
          { id: 1, nome: 'Mensile', prezzo: 10 },
          { id: 2, nome: 'Trimestrale', prezzo: 15 },
          { id: 3, nome: 'Annuale', prezzo: 20 },
        ],
        corsi: [
          { id: 1, nome: 'Corso 1', data: '2023-05-18', ora: '10:00' },
          { id: 2, nome: 'Corso 2', data: '2023-05-18', ora: '14:00' },
          { id: 3, nome: 'Corso 3', data: '2023-05-19', ora: '16:00' },
        ],
      };
    },
    methods: {
      acquistaAbbonamento(abbonamentoId) {
        // Logica per l'acquisto dell'abbonamento
      },
      prenotaPosto(corsoId) {
        // Logica per la prenotazione del posto nel corso
      },
    },
  };
  </script>
  
  <style>
  .page {
    text-align: center;
    color: whitesmoke;
  }
  
  .container {
    display: flex;
    /* justify-content: space-between; */
    margin-top: 50px;
  }
  
  .subscription-list{
    width: 50%;
    border: 1px solid #ccc;
    padding: 20px;
    text-align: center;
/*    flex:1;*/
  }
  .course-list {
    width: 50%;
    border: 1px solid #ccc;
    padding: 20px;
  /*  flex:1;*/
  }
  
  .subscription-list h2,
  .course-list h2 {
    margin-bottom: 10px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  button {
    border: none;
    background-color: lightgray;
    color: black;
    padding: 5px 10px;
  }
  </style>
  