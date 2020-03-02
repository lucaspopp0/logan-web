import Vue from 'vue';
import moment from 'moment';
import DOWPicker from '@/components/Controls/DOWPicker';

export default {
    name: 'section-detail-view',
    components: { DowPicker: DOWPicker },
    props: ['section'],
    data() {
        return {}
    },
    computed: {
        startDate: {
            get() {
                if (!this.section) return undefined;
                console.log(this.section.start);
                return moment(this.section.start).format('YYYY-MM-DD');
            },
            set(newValue) {
                if (!this.section) return;
                const mStart = moment(this.section.start);
                const nStart = moment(newValue);

                mStart.set({ year: nStart.year(), month: nStart.month(), date: nStart.date() });
                this.section.start = mStart.format('M/DD/YYYY, HH:mm');
            }
        },
        endDate: {
            get() {
                if (!this.section) return undefined;
                return moment(this.section.end).format('YYYY-MM-DD');
            },
            set(newValue) {
                if (!this.section) return;
                const mEnd = moment(this.section.end);
                const nEnd = moment(newValue);

                mEnd.set({ year: nEnd.year(), month: nEnd.month(), date: nEnd.date() });
                this.section.end = mEnd.format('M/DD/YYYY, HH:mm');
            }
        },
        startTime: {
            get() {
                if (!this.section) return undefined;
                return moment(this.section.start).format('HH:mm');
            },
            set(newValue) {
                if (!this.section) return;
                const mStart = moment(this.section.start);
                const nStart = moment(newValue, 'HH:mm');

                mStart.set({ hour: nStart.hour(), minute: nStart.minute() });
                this.section.start = mStart.format('M/DD/YYYY, HH:mm');
            }
        },
        endTime: {
            get() {
                if (!this.section) return undefined;
                return moment(this.section.end).format('HH:mm');
            },
            set(newValue) {
                if (!this.section) return;
                const mEnd = moment(this.section.end);
                const nEnd = moment(newValue);

                mEnd.set({ hour: nEnd.hour(), minute: nEnd.minute() });
                this.section.end = mEnd.format('M/DD/YYYY, HH:mm');
            }
        },
        weeklyRepeat: {
            get() {
                if (!this.section) return undefined;
                return this.section.weeklyRepeat;
            },
            set(newValue) {
                this.section.weeklyRepeat = Number(newValue);
            }
        }
    }
}