<template>
  <div class="page">
    <h2>Ecco le palestre vicino a te!</h2>
    <a class="text-light" @click="getLocation">ciao sono qua</a>
    <ul class="gym-list d-flex align-self-center flex-wrap justify-content-around">
      <li v-for="palestra in palestre" :key="palestra.id" style="margin-right: 50px!important;"
        class="d-flex align-items-center justify-content-center flex-column">
        <h3 class="mb-2">{{ palestra.nome }}</h3>
        <p class="mb-1">{{ getIndirizzo( palestra.indirizzo ) }}</p>
        <p class="mb-3">Distanza: {{ getDistanza( palestra.id ) }} km</p>
        <a href="#" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true"
          @click="handleClick">Esplora</a>
      </li>
    </ul>
  </div>
</template>
  
<script>

import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST +`/api/v1`

export default {
  data() {
    return {
      palestre: [],
      position: null,
      distanze: []
    };
  },
  methods: {
    getPalestre() {
      fetch(API_URL+'/palestre', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            "x-access-token": loggedUser.token,
            latitude: this.position.coords.latitude,
            longitude: this.position.coords.longitude
          }
      })
      .then( async (resp) => {
        let dati = await Promise.resolve( resp.json() );
        this.palestre = dati.palestre;
        this.distanze = dati.distanze;
      })
      .catch( error => console.error(error) ); 
    },

    getIndirizzo(indirizzo) {
      console.log(indirizzo);
      let res = "";
      console.log(indirizzo.via);
      if (indirizzo.via) res += indirizzo.via;
      if (indirizzo.numeroCivico) res += (" " + indirizzo.numeroCivico + ",");
      if (indirizzo.cap) res += (" " + indirizzo.cap);
      if (indirizzo.citta) res += (" " + indirizzo.citta);
      if (indirizzo.provincia) res += (" " + indirizzo.provincia);
      if (indirizzo.paese) res += (" " + indirizzo.paese);
      console.log(res);
      return res;
    },

    getDistanza(idPalestra) {
      let palestra = this.distanze.map( (p) => {
        if (p.id == idPalestra) 
          return p;
      });
      return Number( ( palestra[0].distanza ).toFixed(2) );
    },

    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
      } else {
        alert("La geolocalizzazione non è supportata da questo browser.");
      }
    },
    showPosition(position) {
      this.position = position;
      this.getPalestre();
    },
    showError(error) {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          alert("L'autorizzazione alla geolocalizzazione è stata negata dall'utente.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Le informazioni sulla posizione non sono disponibili.");
          break;
        case error.TIMEOUT:
          alert("La richiesta per ottenere la posizione dell'utente è scaduta.");
          break;
        case error.UNKNOWN_ERROR:
          alert("Si è verificato un errore sconosciuto.");
          break;
      }
    },

    handleClick() {
      this.$router.push('/palestra');
    }, 

    redirect(idPalestra) {
      this.$router.push('/')
    }
  },
  created() {
    this.getLocation();
  }
};
</script>
  
<style>
.page {
  color: whitesmoke;
}

h1 {
  font-size: 24px;
  margin-top: 20px;
}

.gym-list {
  list-style-type: none;
  padding: 0;
  margin-top: 3em;

}

.gym-list li {
  padding: 10px;
  margin-bottom: 10px;
}

p {
  color: #8C8C8C;
}

button {
  background-color: #ccc;
  border: none;
  color: #fff;
  padding: 8px 16px;
  cursor: pointer;
}

button:hover {
  background-color: #999;
}
</style>
  