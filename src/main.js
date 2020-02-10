// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

Vue.component('g-signin-button', {
  template: '<div class="g-signin2" ref="gLoginButton"></div>',
  mounted () {
    window.gapi.load('auth2', () => {
      const auth2 = window.gapi.auth2.init({
        client_id: '261132618985-m4eb9huuqosfddibg17jgm50d69g0ki3.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin'
      })
      auth2.attachClickHandler(this.$refs.gLoginButton, {}, googleUser => {
        this.$emit('done', googleUser)
      }, error => console.log(error))
    })
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
