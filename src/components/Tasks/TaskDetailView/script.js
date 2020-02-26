import CourseSelect from '@/components/Controls/CourseSelect';
import moment from 'moment';

export default {
    name: 'task-detail-view',
    components: { CourseSelect },
    props: ['task'],
    data() {
        return {}
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
        deleteTask() {
            this.$emit('delete');
        }
    }
}