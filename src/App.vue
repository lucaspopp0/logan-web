<template>
  <div id="app">
    <header>
      <g-signin-button @done="authCallback"></g-signin-button>
    </header>
    <main>
      <img src="./assets/logo.png" alt="Vue.js PWA">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    authCallback: function(googleUser) {
      console.log(googleUser);
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
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
