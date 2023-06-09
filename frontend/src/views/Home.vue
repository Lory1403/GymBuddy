<template>
    <div class="page">
      <h2>Ecco le palestre vicino a te!</h2>
      <ul class="gym-list d-flex align-self-center flex-wrap justify-content-around" >
        <li v-for="palestra in palestre" :key="palestra.id" style="margin-right: 50px!important;" class="d-flex align-items-center justify-content-center flex-column">
          <h3 class="mb-2">{{ palestra.nome }}</h3>
          <p class="mb-1">{{ palestra.indirizzo }}</p>
          <p class="mb-3">Distanza: {{ palestra.distanza }} km</p>
          <!-- <button @click="esploraPalestra(palestra.id)""></button> -->
          <a href="#" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true" @click="handleClick">Esplora</a>
        </li>
      </ul>
    </div>
  </template>
  
  <script>

  export default {
    data(){
        return{
            palestre:[
              //Prende info da backend
                {id:1, nome:'palestra1', indirizzo: 'via paese (provincia)', distanza: 0},
                {id:2, nome:'palestra2', indirizzo: 'via paese (provincia )', distanza: 0},
                {id:3, nome:'palestra3', indirizzo: 'via paese (provincia)', distanza: 0},
                {id:4, nome:'palestra4', indirizzo: 'via paese (provincia )', distanza: 0},
              
            ],
       };
    },
    methods: {
      // ...mapActions(['selezionaPalestra']),
      // esploraPalestra(id) {
      //   // Esegui l'azione per selezionare la palestra
      //   this.selezionaPalestra(id);
      //   // Reindirizza alla pagina "Palestra.vue"
      //   // this.$router.push(`/palestra:${id}`);
      //   this.$router.push(`/login`);
      // },

      handleClick() {
        this.$router.push('/palestra');
      }
    }, 
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
  