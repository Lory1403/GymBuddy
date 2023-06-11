<script>
import { loggedUser, isClear, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST + `/api/v1`

export default {
  name: "Registrazione",
  methods: {
    registrazione() {
      fetch(API_URL + '/registrazioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: inputName.value,
          cognome: inputSurname.value,
          email: inputEmail.value,
          password: inputPassword.value
        })
      })
      .then( async (resp) => {
        let dati = await Promise.resolve( resp.json() );
        if (dati.success) {
          setLoggedUser(dati);
          this.redirect();
        }
      })
      .catch( (error) => {
        console.error(error);
      })
    },

    redirect() {
      this.$router.push('/home')
    }
  },
  created() {
    if (!isClear()) {
      this.redirect()
    }
  }
};
</script> 

<template>
  <form class="w-50 text-light position-absolute top-50 start-50 translate-middle">
    <div class="mb-3 py-1">
      <label for="inputName" class="form-label">Name</label>
      <input type="Name" class="form-control" id="inputName" placeholder="Name">
    </div>
    <div class="mb-3 py-1">
      <label for="inputSurname" class="form-label">Surname</label>
      <input type="Surname" class="form-control" id="inputSurname" placeholder="Surname">
    </div>
    <div class="mb-3 py-1">
      <label for="inputEmail" class="form-label">Indirizzo email</label>
      <input type="email" class="form-control" id="inputEmail" placeholder="name@example.com"
        autocomplete="current-email">
    </div>
    <div class="mb-3 py-1">
      <label for="inputPassword" class="form-label">Password</label>
      <input type="password" class="form-control" id="inputPassword" placeholder="Password"
        autocomplete="current-password">
    </div>
    <button type="submit" class="btn btn-primary py-2 px-5 w-100" @click.prevent="registrazione">Registrati</button>
    <div>
      <label>Sei già registrato? </label>
      <RouterLink class="w-auto nav-link d-inline-block" to="/login"> Login</RouterLink>
    </div>
  </form>

  <!--  <div v-if="showConfirmation">
      <p>Registrazione avvenuta con successo!</p>
    </div> -->
</template>
