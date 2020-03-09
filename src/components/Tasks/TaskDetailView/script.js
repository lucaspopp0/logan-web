import CourseSelect from '@/components/Controls/CourseSelect';
import moment from 'moment';
import { UpdateTimer } from '@/utils/timers.js';
import api from '@/api';

export default {
    name: 'task-detail-view',
    components: { CourseSelect },
    props: ['task'],
    data() {
        return {
            changesPresent: false,
            timer: new UpdateTimer(4000, () => { this.updateTask(this.task) })
        }
    },
    mounted() {
        this.timer = new UpdateTimer(4000, () => { this.updateTask(this.task) });
    },
    watch: {
        task: function(newTask, oldTask) {
            if (this.changesPresent) {
                this.updateTask(oldTask);
            }

            this.timer.cancel();
        }
    },
    computed: {
        dueDateType() {
            if (!this.task || this.task.dueDate == "eventually") return "e";
            else if (this.task.dueDate == "asap") return "a";
            else return "d";
        },
        dueDateValue() {
            if (this.dueDateType != 'd') return undefined;
            return moment(this.task.dueDate, 'M/D/YY').format('YYYY-MM-DD');
        }
    },
    methods: {
        updateTask(taskToUpdate) {
            this.changesPresent = false;
            api.updateTask(taskToUpdate);
        },
        registerChange() {
            this.changesPresent = true;

            if (this.timer.isOn) {
                this.timer.reset();
            } else {
                this.timer.begin();
            }
        },
        deleteTask() {
            this.timer.cancel();
            this.$emit('delete');
        }
    }
}