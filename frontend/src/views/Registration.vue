  <template>
    <form class="w-50 text-light position-absolute top-50 start-50 translate-middle">
        <div class="mb-3 py-1">
        <label for="inputName" class="form-label">Name</label>
        <input type="Name" class="form-control" id="inputName" placeholder="Name">
      </div>
      <div class="mb-3 py-1">
        <label for="inputSurname" class="form-label">Surname</label>
        <input type="Surname" class="form-control" id="Surname" placeholder="Surname">
      </div>
 <!--      <div class="mb-3 py-1">
    <label for="select-option"> Seleziona tipo utente: </label>
    <select id="select-option" v-model="selectedOption">
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </div> -->
      <div class="mb-3 py-1">
        <label for="inputEmail" class="form-label">Indirizzo email</label>
        <input type="email" class="form-control" id="inputEmail" placeholder="name@example.com">
      </div>
      <div class="mb-3 py-1">
        <label for="inputPassword" class="form-label">Password</label>
        <input type="password" class="form-control" id="inputPassword" placeholder="Password">
      </div>
      <button type="submit" class="btn btn-primary py-2 px-5 w-100">Registration</button>
      <div>
      <label>Sei già registrato? </label>
      <RouterLink class="w-auto nav-link d-inline-block" to="/login"> Login</RouterLink>
    </div>
    </form>

   <!--  <div v-if="showConfirmation">
      <p>Registrazione avvenuta con successo!</p>
    </div> -->

  </template>
  

  <!-- <script>
  export default {
    data() {
      return {
        selectedOption: '', 
        options: [ 
          { label: 'Utente', value: 'utente' },
          { label: 'Personale di Sala', value: 'personaleSala' },
          { label: 'Personale amministrativo', value: 'personaleAmministrativo' }
        ]
      };
    }
  };
  </script> 
 -->