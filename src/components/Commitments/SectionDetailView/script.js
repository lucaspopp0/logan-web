import Vue from 'vue';
import moment from 'moment';
import DOWPicker from '@/components/Controls/DOWPicker';
import { UpdateTimer } from '@/utils/timers';
import api from '@/api';
import { Section } from '@/data-types';
import { PICKER_DATE_FORMAT, DB_DATETIME_FORMAT } from '@/utils/dates';

export default {
    name: 'section-detail-view',
    components: { DowPicker: DOWPicker },
    props: {
        section: {
            type: Section,
            default() {
                return new Section({
                    name: '',
                    location: '',
                    weeklyRepeat: 1,
                    daysOfWeek: '',
                    start: '',
                    end: '',
                    isFake: true
                });
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
        this.timer = new UpdateTimer(2000, () => { this.updateSection(this.section) });
    },
    watch: {
        section(newSection, oldSection) {
            if (this.changesPresent) {
                this.updateSection(oldSection);
            }

            this.timer.cancel();
        }
    },
    computed: {
        startDate: {
            get() {
                if (!this.section) return undefined;
                return this.section.start.format(PICKER_DATE_FORMAT);
            },
            set(newValue) {
                if (!this.section) return;
                const mStart = moment(this.section.start);
                const nStart = moment(newValue, PICKER_DATE_FORMAT);

                mStart.set({ year: nStart.year(), month: nStart.month(), date: nStart.date() });
                this.section.start = mStart;
            }
        },
        endDate: {
            get() {
                if (!this.section) return undefined;
                return this.section.end.format(PICKER_DATE_FORMAT);
            },
            set(newValue) {
                if (!this.section) return;
                const mEnd = moment(this.section.end);
                const nEnd = moment(newValue, PICKER_DATE_FORMAT);

                mEnd.set({ year: nEnd.year(), month: nEnd.month(), date: nEnd.date() });
                this.section.end = mEnd;
            }
        },
        startTime: {
            get() {
                if (!this.section) return undefined;
                return this.section.start.format('HH:mm');
            },
            set(newValue) {
                if (!this.section) return;
                const mStart = moment(this.section.start);
                const nStart = moment(newValue, 'HH:mm');

                mStart.set({ hour: nStart.hour(), minute: nStart.minute() });
                this.section.start = mStart;
            }
        },
        endTime: {
            get() {
                if (!this.section) return undefined;
                return this.section.end.format('HH:mm');
            },
            set(newValue) {
                if (!this.section) return;
                const mEnd = moment(this.section.end);
                const nEnd = moment(newValue, 'HH:mm');

                mEnd.set({ hour: nEnd.hour(), minute: nEnd.minute() });
                this.section.end = mEnd;
            }
        }
    },
    methods: {
        updateSection(section) {
            console.log('Attempting to update section');
            this.timer.cancel();

            if (this.changesPresent) {
                api.updateSection(section);
            }

            this.changesPresent = false;
        },
        registerChange() {
            console.log('Section changed');
            this.changesPresent = true;

            if (this.timer.isOn) this.timer.reset();
            else this.timer.begin();

            this.$emit('change', this.section);
        },
        deleteSection() {
            this.timer.cancel();
            this.$emit('delete');
            api.deleteSection(this.section);
        }
    }
}