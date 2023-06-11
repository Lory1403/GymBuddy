<script>
import GoogleLogo from '@/components/icons/GoogleLogo.vue';
import { loggedUser, isClear, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST +`/api/v1`

export default {
  name: 'Login',
  components: {
    GoogleLogo
  },
  methods : {
    redirect() {
      this.$router.push('/home')
    },
    
    login() {
      fetch(API_URL+'/autenticazioni', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify( { email: inputEmail.value, password: inputPassword.value } ),
      })
      .then( async (resp) => {
        let dati = await Promise.resolve( resp.json() );
        if (dati.success) {
          setLoggedUser(dati);
          this.redirect();
        }
      })
      .catch( error => console.error(error) ); 
    }, 

    // loginGoogle() {
    //   fetch(API_URL+'/auth/google', {
    //       method: 'GET',
    //       headers: { 'Content-Type': 'application/json' }
    //   })
    //   .catch( error => console.error(error) ); 
    // }
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
      <label for="inputEmail" class="form-label">Indirizzo email</label>
      <input type="email" class="form-control" id="inputEmail" placeholder="name@example.com">
    </div>
    <div class="mb-3 py-1">
      <label for="inputPassword" class="form-label">Password</label>
      <input type="password" class="form-control" id="inputPassword" placeholder="Password" autocomplete="current-password">
    </div>
    <button type="submit" class="mt-3 btn btn-primary py-2 px-5 w-100" @click.prevent="login">Login</button>
    <div class="mt-3 py-2">
      <button class="rounded border bg-white py-2 px-5 shadow hover:bg-gray-100 w-100">
        <div class="items-center justify-center space-x-10">
          <GoogleLogo class="p-1 flex-fill" />
          <span class="p-1 flex-fill text-center items-center align-right font-semibold text-gray-200">Login con
            Google</span>
        </div> ------ [ IN FASE DI SVILUPPO ] ------
      </button>
    </div>
    <div>
      <label>Sei un nuovo utente? </label>
      <RouterLink class="w-auto nav-link d-inline-block" to="/registration"> Registrati</RouterLink>
    </div>
  </form>
</template>
