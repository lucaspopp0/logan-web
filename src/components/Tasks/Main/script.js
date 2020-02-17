import Vue from 'vue';
import DataManager from '@/data-manager';
import TaskListItem from '../TaskListItem';

export default {
    name: 'tasks',
    data() {
        return {
            tasks: []
        }
    },
    mounted() {
        DataManager.addListener(this);
        DataManager.fetchAllData()
        .then(() => {
            this.updateTasks()
        })
    },
    beforeDestroy() {
        DataManager.removeListener(this);
    },
    methods: {
        updateTasks() {
            Vue.set(this, 'tasks', DataManager.getTasks());
        },
        dmEvent(event, data) {
            if (event === 'fetch-complete') {
                this.updateTasks();
            }
        }
    },
    components: { TaskListItem }
}