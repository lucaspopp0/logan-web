import Vue from 'vue';
import DataManager from '@/data-manager';
import TaskListItem from '../TaskListItem';
import TaskDetailView from '../TaskDetailView'

export default {
    name: 'tasks',
    components: { TaskListItem, TaskDetailView },
    data() {
        return {
            tasks: [],
            currentSelection: undefined
        }
    },
    mounted() {
        DataManager.addListener(this);
        if (DataManager.needsFetch()) {
            DataManager.fetchAllData()
            .then(() => {
                this.updateTasks()
            })
        } else {
            this.updateTasks();
        }
    },
    beforeDestroy() {
        DataManager.removeListener(this);
    },
    methods: {
        updateTasks() {
            Vue.set(this, 'tasks', DataManager.getTasks());
        },
        select(task) {
            this.currentSelection = task;
        },
        dmEvent(event, data) {
            if (event === 'fetch-complete') {
                this.updateTasks();
            }
        }
    }
}