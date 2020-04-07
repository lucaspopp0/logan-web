import CourseSelect from '@/components/Controls/CourseSelect';
import moment from 'moment';
import api from '@/api';
import { Assignment } from '@/data-types';
import UpdateHandler from '@/mixins/update-handler';
import dateUtils, { PICKER_DATE_FORMAT } from '@/utils/dates';

export default {
    name: 'assignment-detail-view',
    mixins: [UpdateHandler],
    components: { CourseSelect },
    props: {
        assignment: {
            type: Assignment,
            default() {
                return new Assignment({
                    uid: undefined,
                    aid: 'fake',
                    title: '',
                    dueDate: undefined,
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
        this.setupHandlers({
            update: () => { api.updateAssignment(this.assignment) },
            exit: api.updateAssignment,
            change: () => { this.$emit('change', this.assignment) }
        });
    },
    watch: {
        assignment(newAss, oldAss) {
            this.propertyChanged(oldAss);

            if (this.dueDateType === 'd') {
                this.lastDateValue = this.assignment.dueDate;
            } else {
                this.lastDateValue = dateUtils.dateOnly(moment());
            }
        }
    },
    computed: {
        dueDateType: {
            get() {
                if (this.assignment.dueDate == "eventually") return "e";
                else if (this.assignment.dueDate == "asap") return "a";
                else return "d";
            },
            set(newValue) {
                if (newValue === 'a') this.assignment.dueDate = 'asap';
                else if (newValue === 'e') this.assignment.dueDate = 'eventually';
                else if (newValue === 'd') this.assignment.dueDate = this.lastDateValue;
            }
        },
        dueDateValue: {
            get() {
                if (this.dueDateType != 'd') return this.lastDateValue;
                return this.assignment.dueDate.format(PICKER_DATE_FORMAT);
            },
            set(newValue) {
                this.assignment.dueDate = moment(newValue, PICKER_DATE_FORMAT);
                this.lastDateValue = this.assignment.dueDate;
            }
        }
    }
}