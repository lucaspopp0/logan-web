import Checkbox from '@/components/Controls/Checkbox';
import moment from 'moment';
import dateUtils from '@/utils/dates';

export default {
    name: 'task-list-item',
    props: {
        task: {
            required: true,
            type: Object
        }
    },
    data() {
        return {}
    },
    computed: {
        mDueDate() {
            if (!this.task || (this.task.dueDate == 'e' || this.task.dueDate == 'a'))
                return null;
            
            return moment(this.task.dueDate, 'M/D/YYYY');
        },
        overdue() {
            const d = this.mDueDate;
            const today = moment(moment().format('MM-DD-YYYY'), 'MM-DD-YY');
            return d != null && d.isBefore(today);
        },
        overdueText() {
            return 'Due ' + dateUtils.readableDate(this.mDueDate, true);
        }
    },
    components: { Checkbox }
}