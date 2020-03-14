import CourseSelect from '@/components/Controls/CourseSelect';
import moment from 'moment';
import { UpdateTimer } from '@/utils/timers';
import api from '@/api';
import dateUtils, { PICKER_DATE_FORMAT } from '@/utils/dates';
import { Assignment } from '@/data-types';

export default {
    name: 'assignment-detail-view',
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
            changesPresent: false,
            timer: undefined,
            lastDateValue: undefined
        }
    },
    mounted() {
        this.timer = new UpdateTimer(2000, () => { this.update(this.assignment) });
    },
    watch: {
        assignment(newAss, oldAss) {
            if (this.changesPresent) {
                this.update(oldAss);
            }

            this.timer.cancel();

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
    },
    methods: {
        update(assignmentToUpdate) {
            console.log('Attempting to update assignment');
            this.timer.cancel();

            if (this.changesPresent) {
                api.updateAssignment(assignmentToUpdate);
            }

            this.changesPresent = false;
        },
        registerChange() {
            console.log('Assignment changed');
            this.changesPresent = true;

            if (this.timer.isOn) {
                this.timer.reset();
            } else {
                this.timer.begin();
            }

            this.$emit('change', this.assignment);
        },
        deleteSelf() {
            this.timer.cancel();
            this.$emit('delete', this.assignment);
        }
    }
}