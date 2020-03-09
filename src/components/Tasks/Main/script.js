import Vue from 'vue';
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

export default {
    name: 'tasks',
    components: { TaskListItem, TaskDetailView },
    data() {
        return {
            tasks: [],
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
                    const dueDate = moment(task.dueDate);
                    const days = dateUtils.dateOnly(dueDate).diff(dateUtils.dateOnly(now), 'days');

                    if (days < 0) {
                        if (days === -1) {
                            if (now.hour() <= 6) {
                                groupName = 'Tonight';
                            } else {
                                groupName = 'Yesterday';
                            }
                        } else {
                            groupName = 'Overdue';
                        }
                    } else if (days === 0) {
                        groupName = 'Today';
                    } else if (days === 1) {
                        groupName = 'Tomorrow';
                    } else if (dueDate.week() === now.week()) {
                        groupName = dueDate.format('dddd');
                    } else if (dueDate.year() === now.year()) {
                        groupName = dueDate.format('dddd, MMM Do');
                    } else {
                        groupName = dueDate.format('dddd, MMM Do, YYYY');
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
        taskUpdated() {
            this.sortExistingData();
        },
        deleteCurrentTask() {
            if (!this.currentSelection) return;

            api.deleteTask(this.currentSelection)
            .then((response) => {
                DataManager.fetchAllData();
            })
            
            this.tasks.splice(this.tasks.indexOf(this.currentSelection), 1);
            this.select(undefined);
        },
    }
}