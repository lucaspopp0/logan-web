import DataManager from '@/data-manager'

export default {
    name: 'app',
    data() { 
        return {
            isSignedIn: false,
            syncing: false
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
            switch (event) {
                case DataManager.EventType.SIGNIN:
                    this.isSignedIn = DataManager.isSignedIn();
                    break;

                case DataManager.EventType.FETCH_START:
                    this.syncing = true;
                    break;

                case DataManager.EventType.FETCH_COMPLETE:
                    this.syncing = false;
                    break;
            }
        },
        sync() {
            DataManager.fetchAllData();
        }
    }
}