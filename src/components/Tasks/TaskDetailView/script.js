import CourseSelect from '@/components/Controls/CourseSelect';

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
        }
    }
}