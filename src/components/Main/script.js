import DataManager from '@/data-manager'

export default {
  name: 'app',
  data() { 
    return {
      isSignedIn: false
    } 
  },
  mounted() {
    DataManager.addListener(this);
    
    if (process.env.NODE_ENV == 'development') 
      DataManager.signIn();
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
    },
    sync() {
      DataManager.fetchAllData();
    }
  }
}