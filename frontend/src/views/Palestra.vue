<template>
  <div class="page">
    <h1>{{ palestraName }}</h1>

    <!-- Nome palestra
        via
      contatti
    istruttoiri
  cazzi amamazzi 
info della paslestra
mappa 
form di contatto rapido
 -->

    <div class="d-flex">
      <div class="border border-warning d-flex align-items-center justify-content-center flex-column" style="width: 50%; height: 300px">
        <!-- Info palestra -->
        <h1>Palestra del nano</h1>
        <h3>Via del nano 5</h3>
        <h4>Trento (TN) 38010</h4>
        <h4>0461736583575348</h4>
      </div>
      <div class="border border-warning d-flex align-items-center justify-content-center" style="width: 50%; height: 300px">
        <!-- Carousel foto -->
        <div id="carouselExampleControls" class="carousel" data-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img class="d-block w-100"
                src="https://www.psicosocial.it/wp-content/uploads/2020/10/immagine-fissa-si-muove.jpg" alt="First slide">
            </div>
            <div class="carousel-item">
              <img class="d-block w-100"
                src="https://www.psicosocial.it/wp-content/uploads/2020/10/immagine-fissa-si-muove.jpg"
                alt="Second slide">
            </div>
            <div class="carousel-item">
              <img class="d-block w-100"
                src="https://www.psicosocial.it/wp-content/uploads/2020/10/immagine-fissa-si-muove.jpg" alt="Third slide">
            </div>
          </div>
          <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
        <!-- End Carousel foto -->
      </div>
    </div>


    <div class="container">
      <div class="subscription-list">
        <h2>Abbonamenti disponibili</h2>
        <ul>
          <li v-for="abbonamento in abbonamenti" :key="abbonamento.id" class="d-flex">
            <span>{{ abbonamento.nome }}</span>
            <span>{{ abbonamento.prezzo }}</span>
            <button @click="acquistaAbbonamento(abbonamento.id)">Acquista</button>
          </li>
        </ul>
      </div>
      <div class="course-list" style="margin-left: 3em;">
        <h2>Corsi</h2>
        <ul>
          <li v-for="corso in corsi" :key="corso.id" class="d-flex">
            <span class="ml-2">{{ corso.nome }}</span>
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

.subscription-list {
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
}</style>
  