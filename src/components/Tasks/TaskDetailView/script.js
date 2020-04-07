import CourseSelect from '@/components/Controls/CourseSelect';
import moment from 'moment';
import api from '@/api';
import { PICKER_DATE_FORMAT } from '@/utils/dates';
import { Task } from '@/data-types';
import UpdateHandler from '@/mixins/update-handler';

export default {
    name: 'task-detail-view',
    components: { CourseSelect },
    mixins: [UpdateHandler],
    props: {
        task: {
            type: Task,
            default() {
                return new Task({
                    uid: undefined,
                    tid: 'misc',
                    title: '',
                    dueDate: undefined,
                    priority: 0,
                    completed: false,
                    isFake: true
                });
            }
        }
    },
    data() {
        return {
            lastDateValue: undefined
        }
    },
    mounted() {
        this.setup({
            updateHandler: () => { api.updateTask(this.task) },
            exitHandler: api.updateTask,
            changeHandler: () => { this.$emit('change', this.task) }
        });
    },
    watch: {
        task: function(newTask, oldTask) {
            this.propertyChanged(oldTask);
            
            if (this.dueDateType === 'd') {
                this.lastDateValue = this.task.dueDate;
            } else {
                this.lastDateValue = moment();
            }
        }
    },
    computed: {
        dueDateType: {
            get() {
                if (this.task.dueDate == "eventually") return "e";
                else if (this.task.dueDate == "asap") return "a";
                else return "d";
            },
            set(newValue) {
                if (newValue === 'a') this.task.dueDate = 'asap';
                else if (newValue === 'e') this.task.dueDate = 'eventually';
                else if (newValue === 'd') this.task.dueDate = this.lastDateValue;
            }
        },
        dueDateValue: {
            get() {
                if (this.dueDateType != 'd') return this.lastDateValue.format(PICKER_DATE_FORMAT);
                return this.task.dueDate.format(PICKER_DATE_FORMAT);
            },
            set(newValue) {
                this.task.dueDate = moment(newValue, PICKER_DATE_FORMAT);
                this.lastDateValue = this.task.dueDate;
            }
        }
    }
}