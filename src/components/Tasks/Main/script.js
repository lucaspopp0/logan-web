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

        if (!DataManager.needsFetch()) {
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
            if (event === DataManager.EventType.FETCH_COMPLETE) {
                this.updateTasks();
            }
        }
    }
}