<template>
    <div class="page">
      <h1>Benvenuto su GymBuddy!</h1>
      <div class="container">
        <div class="left-section">
          <h2>Sei un nuovo utente?</h2>
          <button class="button" @click="navigateToRegistration">Registrati</button>
        </div>
        <div class="right-section">
          <h2>Sei già registrato?</h2>
          <button class="button" @click="navigateToLogin">Accedi</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
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
  