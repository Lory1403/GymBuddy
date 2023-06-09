<script setup>
import { RouterLink, RouterView } from 'vue-router'

import { ref, onMounted } from 'vue'

</script>

<template>
  <!-- Header -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark position-absolute top-0 start-0 w-100">
    <div class="container-fluid">
      <div class="navbar-brand" href="#">
        <img src="@/assets/logo.png" alt="logo-palestra" width="100"
          class="d-inline-block align-text-top">
        GymBuddy
      </div>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/home">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/login">Login</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/registration">Registration</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- End Header -->


  <div class="align-top">
    <RouterView />
  </div>
</template>