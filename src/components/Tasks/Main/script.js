import api from '@/api'
import DataManager from '@/data-manager';
import TaskListItem from '../TaskListItem';
import TaskDetailView from '../TaskDetailView'
import moment from 'moment';
import _ from 'lodash';
import dateUtils from '@/utils/dates';
import sortingUtils from '@/utils/sorting';
import TableData from '@/utils/table-data';
import { UpdateTimer } from '@/utils/timers';
import { Task } from '@/data-types';

export default {
    name: 'tasks',
    components: { TaskListItem, TaskDetailView },
    data() {
        return {
            data: new TableData(),
            updateTimer: undefined,
            currentSelection: undefined
        }
    },
    mounted() {
        this.updateTimer = new UpdateTimer(30000, DataManager.fetchAllData);

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
            this.updateTimer.reset();
            this.sortExistingData(DataManager.getTasks());
        },
        sortExistingData(data) {
            const tempData = new TableData();

            let tempTasks = [...(data || this.data.flat())];
            tempTasks.sort(sortingUtils.initialTaskSortAlgorithm(false));

            const now = moment();

            for (const task of tempTasks) {
                let groupName = 'Undefined';

                if (task.dueDate === 'asap') {
                    groupName = 'ASAP';
                } else if (task.dueDate === 'eventually') {
                    groupName = 'Eventually';
                } else {
                    const dueDate = task.dueDate;
                    const days = dateUtils.dateOnly(dueDate).diff(dateUtils.dateOnly(now), 'days');

                    if (days === -1 && now.hour() <= 6) {
                        groupName = 'Tonight';
                    } else {
                        groupName = 'Due ' + dateUtils.readableDate(dueDate);
                    }
                }

                tempData.addItem(groupName, task);
            }

            for (let group of tempData.groups) {
                group.content.sort(sortingUtils.sectionSortTasks);
            }

            this.data = tempData;
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
            const newTask = new Task({
                tid: 'newtask',
                title: 'Untitled task',
                dueDate: moment(),
                priority: 0,
                completed: false
            });

            const flatData = this.data.flat();
            flatData.push(newTask);
            this.sortExistingData(flatData);
            this.select(newTask);

            api.addTask(newTask)
            .then(response => {
                newTask.tid = response.tid;
                this.select(response);
                this.updateTimer.fire();
            })
        },
        taskUpdated() {
            this.sortExistingData();
        },
        deleteCurrentTask() {
            if (!this.currentSelection) return;

            api.deleteTask(this.currentSelection)
            .then((response) => {
                this.updateTimer.fire();
            })

            const flatData = this.data.flat();
            flatData.splice(flatData.indexOf(this.currentSelection), 1);
            this.sortExistingData(flatData);
            this.select(undefined);
        },
    }
}