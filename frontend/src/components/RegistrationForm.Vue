 <script setup>
import { ref, onMounted } from 'vue'
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'

const HOST = process.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`
/* 
const email = ref('nome.cognome@unitn.com')
const password = ref('123')
const nome = ref('nome')
const cognome = ref('cognome')
const role = "reg"
 */
// const loggedUser = ref({})
// const loggedUser = defineProps(['loggedUser'])
const emit = defineEmits(['registrazione', eventData])

function registration() {
    fetch(API_URL+'/registrazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { nome: nome.value, cognome: cognome.value, email: email.value, password: password.value, role: "reg" } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        setLoggedUser(data)
        loggedUser.token = data.token;
        loggedUser.email = data.email;
        loggedUser.id = data.id;
        loggedUser.self = data.self;
        emit('registrazione', setLoggedUser)
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};

</script>

<template>
  <form>
    <span v-if="loggedUser.token">
      Welcome  <RouterLink to="/home"> </RouterLink>
    </span>
    
 <!--    <span v-if="!loggedUser.token">
      <input name="email" v-model="email" />
      <input name="password" v-model="password" />
      <button type="button" @click="login">LogIn</button>
    </span> -->
  </form>
</template>
 

<!-- 
 <template>
    <div>
      <h1>Registrazione</h1>
  
      <form @submit.prevent="register">
        <div>
          <label for="name">Nome:</label>
          <input type="text" id="name" v-model="formData.name" required>
        </div>
  
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="formData.email" required>
        </div>
  
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="formData.password" required>
        </div>

       <-- <RouterLink class="w-auto nav-link d-inline-block" to="/home"> Registrati</RouterLink> 
      </form>
  
      <div v-if="registrationSuccess">
        <p>Registrazione avvenuta con successo!</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        formData: {
          name: '',
          email: '',
          password: ''
        },
        registrationSuccess: false
      };
    },
    methods: {
      register() {
        // Effettua la chiamata al backend per la registrazione
        // Utilizza this.formData per ottenere i dati inseriti nel form
        // Esegui la logica necessaria per la registrazione
        
        // Dopo una registrazione avvenuta con successo, imposta registrationSuccess a true
        this.registrationSuccess = true;

      }
      
    }
  };
  </script>

  

     -->