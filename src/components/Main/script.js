import DataManager from '@/data-manager'

export default {
  name: 'app',
  data() { 
    return {
      isSignedIn: true
    } 
  },
  mounted() {
    DataManager.addListener(this);
  },
  beforeDestroy() {
    DataManager.removeListener(this);
  },
  methods: {
    authCallback: function(googleUser) {
      DataManager.signIn(googleUser);
    },
    dmEvent: function(event, data) {
      if (event == 'signin') this.isSignedIn = DataManager.isSignedIn();
    }
  }
}