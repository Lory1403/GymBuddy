<template>
    <div class="page">
      <h1>Ecco le palestre vicino a te!</h1>
      <ul class="gym-list">
        <li v-for="palestra in palestre" :key="palestra.id">
          <h2>{{ palestra.nome }}</h2>
          <p>{{ palestra.indirizzo }}</p>
          <p>Distanza: {{ palestra.distanza }} km</p>
          <button @click="esploraPalestra(palestra.id)">Esplora</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>

  export default {
    data(){
        return{
            palestre:[
                {id:1, nome:'palestra1', indirizzo: 'via paese ( )', distanza: 0},
                {id:2, nome:'palestra2', indirizzo: 'via paese ( )', distanza: 0},
                {id:3, nome:'palestra3', indirizzo: 'via paese ( )', distanza: 0},
                {id:4, nome:'palestra4', indirizzo: 'via paese ( )', distanza: 0},
                {id:5, nome:'palestra5', indirizzo: 'via paese ( )', distanza: 0},
            ],
       };
    },
 /*    methods: {
      ...mapActions(['selezionaPalestra']),
      esploraPalestra(id) {
        // Esegui l'azione per selezionare la palestra
        this.selezionaPalestra(id);
        // Reindirizza alla pagina "Palestra.vue"
        this.$router.push('/palestra');
      },
    }, */
  };
  </script>
  
  <style>
.page {
    margin-top: 7em;
    text-align: center;
    color: whitesmoke;
}

h1 {
  font-size: 24px;
  margin-top: 20px;
}

.gym-list {
  list-style-type: none;
  padding: 0;
  margin-top: 30px;
}

.gym-list li {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

h2 {
  font-size: 18px;
  margin-bottom: 5px;
}

p {
  margin-bottom: 5px;
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
  