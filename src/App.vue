<template>
  <div id="app">
    <nav class="navbar navbar-expand-md fixed-top navbar-dark bg-info">
      <a class="navbar-brand" href="#">Logan</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav" v-if="signedIn">
          <li class="nav-item active">
            <a class="nav-link" href="#">Tasks</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Assignments</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Commitments</a>
          </li>
        </ul>
      </div>
      <div class="form-inline">
        <template v-if="signedIn">
          <a class="btn btn-light">Sync</a>
          <div class="dropdown">
            <a class="btn btn-light dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Lucas Popp
            </a>

            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
              <a class="dropdown-item" href="#">Account</a>
              <a class="dropdown-item" href="#">Preferences</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Sign Out</a>
            </div>
          </div>
        </template>
        <template v-else>
          <g-signin-button @done=authCallback></g-signin-button>
        </template>
      </div>
    </nav>
    <main class="container container-fluid">
      <div class="row">
        <div class="col">
          <img src="./assets/logo.png" alt="Vue.js PWA">
          <router-view></router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import DataManager from './data-manager'

export default {
  name: 'app',
  data() { return {} },
  computed: {
    signedIn: function() {
      return DataManager.isSignedIn();
    }
  },
  methods: {
    authCallback: function(googleUser) {
      DataManager.signIn(googleUser);
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  padding: 0.5em 16px;
  background-color: #35495E;
  color: #ffffff;
}
</style>
