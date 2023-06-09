<template>
    <div class="page">
        <!-- <div class="container"> -->
            <div class="d-flex flex-row">
                <div class="appointments-list">
                    <div class="d-flex align-items-center justify-content-space-between flex-column" style="width: 50%;">
                    </div>
                    <h2>I tuoi appuntamenti</h2>
                    <ul>
                        <li v-for="appointment in appointments" :key="appointment.id" class="d-flex">
                            <span class="ml-2">{{ appointment.type }}&nbsp</span>
                            <span>{{ appointment.name }}&nbsp</span>
                            <span>{{ appointment.date }}&nbsp</span>
                            <span>{{ appointment.time }}&nbsp</span>
                        </li>
                    </ul>
                    <a href="#" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true" @click="handleClick">Prenota valutazione</a>
                </div>
            </div>

            <div class="d-flex align-items-center justify-content-center flex-column" style="width: 50%;">
                <div class="products-list" style="margin-left: 6em;">
                    <h2>Lista prodotti</h2>
                    <ul>
                        <li v-for="product in products" :key="product.id" class="mb-3">
                            <span class="ml-2">{{ product.name }}</span>
                            <span>{{ product.price }} euro</span>
                            <a href="#" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true"  @click="handleClick">Acquista</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--  <div class="actions">
        <button @click="goToProfile">Scheda</button>
        <button @click="goToChat">Chat</button>
      </div> -->
    <!-- </div> -->
</template>
  
<script>
export default {
    data() {
        return {
            appointments: [
                {
                    id: 1, type: 'Valutazione',
                    name: 'Appuntamento 1',
                    date: '2023-05-18',
                    time: '10:00',
                },
                {
                    id: 2,
                    type: 'Corso',
                    name: 'Appuntamento 2',
                    date: '2023-05-19',
                    time: '14:00',
                },

            ],
            products: [
                { id: 1, name: 'Prodotto 1', price: 10 },
                { id: 2, name: 'Prodotto 2', price: 15 },
                { id: 3, name: 'Prodotto 3', price: 20 },
            ],
        };
    },
    methods: {
        goToProfile() {
            // Codice per navigare alla pagina di scheda
        },
        goToChat() {
            // Codice per navigare alla pagina di chat
        },
    },
};
</script>
  
<style>
.page {
    color: whitesmoke;
    display: flex;
}
.container {
  display: flex;
  /* justify-content: space-between; */
  margin-top: 50px;
}
.appointments{
  width: 50%;
  border: 1px solid #ccc;
  padding: 20px;
  text-align: center;
}
.products {
  width: 50%;
  border: 1px solid #ccc;
  padding: 20px;
}

.appointments h2,
.products h2 {
    margin-bottom: 10px;
}

.actions {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.actions button {
    margin: 0 10px;
    padding: 8px 16px;
    background-color: #ccc;
    background-color: lightgray;
    color: black;
    cursor: pointer;
}

.actions button:hover {
    background-color: #999;
}

.products-list {
    padding-left: 4em;
}

</style>
  