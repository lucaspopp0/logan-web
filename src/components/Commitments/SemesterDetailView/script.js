import moment from "moment";
import { Semester } from '@/data-types';
import { PICKER_DATE_FORMAT } from '@/utils/dates'

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
        return {}
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
        }
    }
}