<script>
import GoogleLogo from '@/components/icons/GoogleLogo.vue';
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`

function login() {
    fetch(API_URL+'/autenticazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: inputEmail.value, password: inputPassword.value } ),
    })
    .then((resp) => resp.json())
    .then(function(data) {
      setLoggedUser(data)
      // loggedUser.token = data.token;
      // loggedUser.email = data.email;
      // loggedUser.id = data.id;
      // loggedUser.self = data.self;

      emit('login', loggedUser)
      return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};

function logout() {
  clearLoggedUser()
}

export default {
  name: 'SignIn',
  components: {
    GoogleLogo
  }
};
</script>

<template>
  <form class="w-50 text-light position-absolute top-50 start-50 translate-middle">
    <div class="mb-3 py-1">
      <label for="inputEmail" class="form-label">Indirizzo email</label>
      <input type="email" class="form-control" id="inputEmail" placeholder="name@example.com">
    </div>
    <div class="mb-3 py-1">
      <label for="inputPassword" class="form-label">Password</label>
      <input type="password" class="form-control" id="inputPassword" placeholder="Password">
    </div>
    <div class="mb-3 py-1 form-check">
      <input type="checkbox" class="form-check-input" id="check">
      <label class="form-check-label" for="check">Ricordami</label>
    </div>
    <button type="submit" class="btn btn-primary py-2 px-5 w-100" @click="login">Login</button>
    <div class="py-2">
      <button class="mt-3 rounded border bg-white py-2 px-5 shadow hover:bg-gray-100 w-100">
        <div class="items-center justify-center space-x-10">
          <GoogleLogo class="p-1 flex-fill" />
          <span class="p-1 flex-fill text-center items-center align-right font-semibold text-gray-200">Login con
            Google</span>
        </div>
      </button>
    </div>
    <div>
      <label>Sei un nuovo utente? </label>
      <RouterLink class="w-auto nav-link d-inline-block" to="/registration"> Registrati</RouterLink>
    </div>
  </form>
</template>
