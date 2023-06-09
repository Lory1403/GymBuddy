<template>
  <div class="page">
 <!-- Info palestra -->
    <div class="d-flex">
      <div class="d-flex align-items-center justify-content-center flex-column"
        style="width: 50%; height: 300px">
        <h1>Nome palestra</h1>
        <h2>INFORMAZIONI</h2>
        <h3>via nCivico</h3>
        <h4>citta (provincia), cap</h4>
        <h4>Distanza</h4>
      </div>
   <!-- Info palestra -->
      <div class=" d-flex align-items-center justify-content-center"
        style="width: 50%; height: 300px">
        <!-- Carousel foto -->
        <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img class="d-block w-100"
                src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_188a0d3ec28%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_188a0d3ec28%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.91796875%22%20y%3D%22218.45%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"  alt="First slide">
            </div>
            <div class="carousel-item">
              <img class="d-block w-100"
                src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_188a0d3ec29%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_188a0d3ec29%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3125%22%20y%3D%22218.45%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"  alt="Second slide">
            </div>
            <div class="carousel-item">
              <img class="d-block w-100"
                src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_188a0d3ec2a%20text%20%7B%20fill%3A%23333%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_188a0d3ec2a%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22276.99609375%22%20y%3D%22218.45%22%3EThird%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"  alt="Third slide">
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
        <h2>ABBONAMENTI </h2>
        <ul>
          <li v-for="abbonamento in abbonamenti" :key="abbonamento.id" class="d-flex">
            <span class="ml-2">{{ abbonamento.nome }}</span>
            <span>{{ abbonamento.prezzo }}</span>
            <a href="#" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true" @click="handleClick">Acquista</a>
            <!-- <button @click="acquistaAbbonamento(abbonamento.id)">Acquista</button> -->
          </li>
        </ul>
      </div>
      <div class="course-list" style="margin-left: 3em;">
        <h2>CORSI</h2>
        <ul>
          <li v-for="corso in corsi" :key="corso.id" class="d-flex">
            <span class="ml-2">{{ corso.nome }}</span>
            <span>{{ corso.data }}</span>
            <span>{{ corso.ora }}</span>
            <a href="#" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true" @click="handleClick">Prenota</a>
            <!-- <button @click="prenotaPosto(corso.id)">Prenota posto</button> -->
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
      //Da prende da DB
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
  