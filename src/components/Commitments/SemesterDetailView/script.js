import moment from "moment";
import api from '@/api';
import { Semester } from '@/data-types';
import { PICKER_DATE_FORMAT } from '@/utils/dates';
import { UpdateTimer } from '@/utils/timers';

export default {
    name: 'semester-detail-view',
    props: {
        semester: {
            type: Semester,
            default() {
                return new Semester({
                    sid: 'falesid',
                    name: 'Untitled Semester',
                    isFake: true
                })
            }
        }
    },
    data() {
        return {
            changesPresent: false,
            timer: undefined
        }
    },
    mounted() {
        this.timer = new UpdateTimer(2000, () => { this.update(this.semester) });
    },
    watch: {
        semester(newValue, oldValue) {
            if (this.changesPresent) {
                this.update(oldValue);
            }

            this.timer.cancel();
        }
    },
    computed: {
        startDate: {
            get() {
                return this.semester.startDate.format(PICKER_DATE_FORMAT);
            },
            set(newValue) {
                this.semester.startDate = moment(newValue, PICKER_DATE_FORMAT);
            }
        }, 
        endDate: {
            get() {
                return this.semester.endDate.format(PICKER_DATE_FORMAT);
            },
            set(newValue) {
                this.semester.endDate = moment(newValue, PICKER_DATE_FORMAT);
            }
        }
    },
    methods: {
        registerChange() {
            console.log('Semester changed');
            this.changesPresent = true;

            if (this.timer.isOn) this.timer.reset();
            else this.timer.begin();

            this.$emit('change', this.semester);
        },
        update(semesterToUpdate) {
            console.log('Attempting to update semester');
            this.timer.cancel();

            if (this.changesPresent) {
                api.updateSemester(semesterToUpdate);
            }

            this.changesPresent = false;
        },
        deleteSemester() {
            this.timer.cancel();
            this.$emit('delete');
            api.deleteSemester(this.semester);
        }
    }
}