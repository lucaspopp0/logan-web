import CourseSelect from '@/components/Controls/CourseSelect';
import moment from 'moment';
import { UpdateTimer } from '@/utils/timers.js';
import api from '@/api';

const DB_DATE_FORMAT = 'M/D/YYYY';
const PICKER_DATE_FORMAT = 'YYYY-MM-DD';

export default {
    name: 'task-detail-view',
    components: { CourseSelect },
    props: {
        task: {
            type: Object,
            default() {
                return {
                    uid: undefined,
                    tid: 'misc',
                    title: '',
                    dueDate: undefined,
                    priority: 0,
                    completed: false,
                    isFake: true
                }
            }
        }
    },
    data() {
        return {
            changesPresent: false,
            timer: undefined,
            lastDateValue: undefined
        }
    },
    mounted() {
        this.timer = new UpdateTimer(2000, () => { this.updateTask(this.task) });
    },
    watch: {
        task: function(newTask, oldTask) {
            if (this.changesPresent) {
                this.updateTask(oldTask);
            }

            this.timer.cancel();
            
            if (this.dueDateType === 'd') {
                this.lastDateValue = moment(this.task.dueDateValue, PICKER_DATE_FORMAT).format(DB_DATE_FORMAT);
            } else {
                this.lastDateValue = moment().format(DB_DATE_FORMAT);
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
                if (this.dueDateType != 'd') return undefined;
                return moment(this.task.dueDate, DB_DATE_FORMAT).format(PICKER_DATE_FORMAT);
            },
            set(newValue) {
                this.task.dueDate = moment(newValue, PICKER_DATE_FORMAT).format(DB_DATE_FORMAT);
                this.lastDateValue = this.task.dueDate;
            }
        }
    },
    methods: {
        updateTask(taskToUpdate) {
            console.log('Attempting update');
            this.timer.cancel();

            if (this.changesPresent) {
                api.updateTask(taskToUpdate);
            }

            this.changesPresent = false;
        },
        registerChange() {
            console.log('Changed');
            this.changesPresent = true;

            if (this.timer.isOn) {
                this.timer.reset();
            } else {
                this.timer.begin();
            }

            this.$emit('change', this.task);
        },
        deleteTask() {
            this.timer.cancel();
            this.$emit('delete');
        }
    }
}