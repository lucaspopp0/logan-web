import moment from "moment";
import api from '@/api';
import { Semester } from '@/data-types';
import { PICKER_DATE_FORMAT } from '@/utils/dates';
import UpdateHandler from '@/mixins/update-handler';

export default {
    name: 'semester-detail-view',
    mixins: [UpdateHandler],
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
    mounted() {
        this.setupHandlers('semester', {
            update: api.updateSemester,
            delete: api.deleteSemester
        });
    },
    watch: {
        semester(newValue, oldValue) {
            this.handlePropChange(oldValue);
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
    }
}