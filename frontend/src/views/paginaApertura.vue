<template>
  <div class="page">
    <h1>Benvenuto su GymBuddy!</h1>
    <div class="container">
      <div class="left-section">
        <h2>Sei un nuovo utente?</h2>
        <a class="btn btn-secondary btn-lg active" role="button" aria-pressed="true"
          @click="navigateToRegistration">Registrati</a>
      </div>
      <div class="right-section">
        <h2>Sei già registrato?</h2>
        <a class="btn btn-secondary btn-lg active" role="button" aria-pressed="true"
          @click="navigateToLogin">Login</a>
      </div>
    </div>
  </div>
</template>
  
<script>
import GoogleLogo from '@/components/icons/GoogleLogo.vue';
import { loggedUser, isClear, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'

export default {
  methods: {
    navigateToRegistration() {
      // Codice per navigare alla pagina di registrazione
      this.$router.push('/registration');
    },
    navigateToLogin() {
      // Codice per navigare alla pagina di login
      this.$router.push('/login');
    },
    redirect() {
      this.$router.push('/home');
    }
  },
  created() {
    if (!isClear()) {
      this.redirect()
    }
  }
  
};
</script>
  
<style>
.page {
  text-align: center;
  color: whitesmoke;
}

.container {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
}

.left-section,
.right-section {
  width: 40%;
}

.left-section h2,
.right-section h2 {
  margin-bottom: 20px;
}

.button {
  width: 200px;
  height: 50px;
  border: none;
  background-color: lightgray;
  color: black;
  font-size: 16px;
  cursor: pointer;
}
</style>
  