<template>
  <div class="page">
    <h2>Ecco le palestre vicino a te!</h2>
    <ul class="gym-list d-flex align-self-center flex-wrap justify-content-around">
      <li v-for="(palestra) in palestre" :key="palestra" style="margin-right: 50px!important;"
        class="d-flex align-items-center justify-content-center flex-column">
        <h3 class="mb-2">{{ palestra.nome }}</h3>
        <p class="mb-1">{{ getIndirizzo(palestra.indirizzo) }}</p>
        <p class="mb-3">Distanza: {{ getDistanza(palestra.id) }} km</p>
        <a class="btn btn-secondary btn-lg active" role="button" aria-pressed="true" @click="esplora(palestra._id)">Esplora</a>
      </li>
      <!-- <li v-for="palestra in palestre" :key="palestra.id" style="margin-right: 50px!important;"
        class="d-flex align-items-center justify-content-center flex-column">
        <h3 class="mb-2">{{ palestra.nome }}</h3>
        <p class="mb-1">{{ getIndirizzo( palestra.indirizzo ) }}</p>
        <p class="mb-3">Distanza: {{ getDistanza( palestra.id ) }} km</p>
        <a class="btn btn-secondary btn-lg active" role="button" aria-pressed="true"
        @click="esplora( key )">Esplora</a>
      </li> -->
    </ul>
  </div>
</template>
  
<script>

import { loggedUser, isClear, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'

const HOST = process.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST + `/api/v1`

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
      fetch(API_URL + '/palestre', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-access-token": loggedUser.token,
          latitude: this.position.coords.latitude,
          longitude: this.position.coords.longitude
        }
      })
      .then(async (resp) => {
        let dati = await Promise.resolve(resp.json());
        this.palestre = dati.palestre;
        this.distanze = dati.distanze;
      })
      .catch(error => console.error(error));
    },

    getIndirizzo(indirizzo) {
      let res = "";
      if (indirizzo.via) res += indirizzo.via;
      if (indirizzo.numeroCivico) res += (" " + indirizzo.numeroCivico + ",");
      if (indirizzo.cap) res += (" " + indirizzo.cap);
      if (indirizzo.citta) res += (" " + indirizzo.citta);
      if (indirizzo.provincia) res += (" " + indirizzo.provincia);
      if (indirizzo.paese) res += (" " + indirizzo.paese);
      return res;
    },

    getDistanza(idPalestra) {
      let palestra = this.distanze.map((p) => {
        if (p.id == idPalestra)
          return p;
      });
      return Number((palestra[0].distanza).toFixed(2));
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
      switch (error.code) {
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

    esplora(idPalestra) {
      this.$router.push('/palestre/' + idPalestra);
    },

    redirect() {
      this.$router.push('/');
    }
  },
  created() {
    if (isClear()) {
      this.redirect()
    }
    this.getLocation();
  }
};
</script>
  
<style>
.page {
  color: whitesmoke;
}

.gym-list {
  list-style-type: none;
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

ol, ul {
}

button:hover {
  background-color: #999;
}
</style>
  