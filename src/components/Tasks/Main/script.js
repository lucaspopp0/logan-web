import api from '@/api'
import DataManager from '@/data-manager';
import TaskListItem from '../TaskListItem';
import TaskDetailView from '../TaskDetailView'
import moment from 'moment';
import _ from 'lodash';
import dateUtils from '@/utils/dates';
import sortingUtils from '@/utils/sorting';
import TableData from '@/utils/table-data';
import { Task } from '@/data-types';
import { DMTableController } from '@/mixins';

export default {
    name: 'tasks',
    mixins: [ DMTableController ],
    components: { TaskListItem, TaskDetailView },
    beforeMount() {
        this.setupController({
            fetch: DataManager.getTasks
        });
    },
    methods: {
        groupData(tempData, rawTasks) {
            rawTasks.sort(sortingUtils.initialTaskSortAlgorithm(false));

            const now = moment();

            for (const task of rawTasks) {
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
        },
        isCurrentSelection(item) {
            if (!this.currentSelection) return false;
            return item.tid === this.currentSelection.tid;
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
            this.sortData(flatData);
            this.select(newTask);

            api.addTask(newTask)
            .then(response => {
                newTask.tid = response.tid;
                this.select(response);
                DataManager.fetchAllData();
            })
        },
        taskUpdated() {
            this.sortData();
        },
        deleteCurrentTask() {
            if (!this.currentSelection) return;

            api.deleteTask(this.currentSelection)
            .then((response) => {
                DataManager.fetchAllData();
            })

            const flatData = this.data.flat();
            const deletedIndex = flatData.indexOf(this.currentSelection);
            flatData.splice(deletedIndex, 1);
            this.sortData(flatData);

            if (deletedIndex > 0) {
                this.select(flatData[deletedIndex - 1]);
            } else if (deletedIndex < flatData.length) {
                this.select(flatData[deletedIndex]);
            }
        },
    }
}