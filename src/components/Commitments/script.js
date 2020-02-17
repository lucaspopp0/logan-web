import Vue from 'vue';
import DataManager from '../../data-manager';

export default {
    name: 'commitments',
    data() {
        return {
            semesters: []
        }
    },
    mounted() {
        DataManager.addListener(this);
        DataManager.fetchAllData()
        .then(() => {
            this.updateData()
        })
    },
    beforeDestroy() {
        DataManager.removeListener(this);
    },
    methods: {
        updateData() {
            Vue.set(this, 'semesters', DataManager.getSemesters());
        },
        dmEvent(event, data) {
            if (event === 'fetch-complete') {
                this.updateData();
            }
        }
    }
}