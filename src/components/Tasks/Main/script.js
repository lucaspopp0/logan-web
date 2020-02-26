import Vue from 'vue';
import api from '@/api'
import DataManager from '@/data-manager';
import TaskListItem from '../TaskListItem';
import TaskDetailView from '../TaskDetailView'
import moment from 'moment';
import _ from 'lodash';

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
        dmEvent(event, data) {
            if (event === DataManager.EventType.FETCH_COMPLETE) {
                this.updateTasks();
            }
        },
        select(task) {
            this.currentSelection = task;
        },
        newTask() {
            const newTask = {
                tid: 'newtask',
                title: 'Untitled task',
                dueDate: moment().format('MM/DD/YYYY'),
                priority: 0,
                completed: false
            };

            api.addTask(newTask)
            .then(response => {
                this.tasks.push(response);
                this.select(response);
                DataManager.fetchAllData();
            })
        },
        deleteCurrentTask() {
            console.log('delete');
            if (!this.currentSelection) return;
            
            api.deleteTask(_.pick(this.currentSelection, ['uid', 'tid']))
            .then(response => {
                DataManager.fetchAllData();
            })
            
            this.tasks.splice(this.tasks.indexOf(this.currentSelection), 1);
            this.select(undefined);
        },
    }
}