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
    <button type="submit" class="btn btn-primary py-2 px-5 w-100">Login</button>
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
      <a class="text-decoration-none color" href=""> Registrati</a>
    </div>
  </form>
</template>

<script>
import GoogleLogo from '@/components/icons/GoogleLogo.vue';

export default {
  name: 'SignIn',
  components: {
    GoogleLogo
  }
};
</script>
