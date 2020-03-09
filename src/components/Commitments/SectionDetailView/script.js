import Vue from 'vue';
import moment from 'moment';
import DOWPicker from '@/components/Controls/DOWPicker';
import { UpdateTimer } from '@/utils/timers';
import api from '@/api';

export default {
    name: 'section-detail-view',
    components: { DowPicker: DOWPicker },
    props: {
        section: {
            type: Object,
            default() {
                return {
                    name: '',
                    location: '',
                    weeklyRepeat: 1,
                    daysOfWeek: '',
                    start: '',
                    end: '',
                    isFake: true
                }
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
                const nEnd = moment(newValue, 'HH:mm');

                mEnd.set({ hour: nEnd.hour(), minute: nEnd.minute() });
                this.section.end = mEnd.format('M/DD/YYYY, HH:mm');
            }
        }
    },
    methods: {
        updateSection(section) {
            console.log('Attempting update');
            this.timer.cancel();

            if (this.changesPresent) {
                api.updateSection(section);
            }

            this.changesPresent = false;
        },
        registerChange() {
            console.log('Changed');
            this.changesPresent = true;

            if (this.timer.isOn) this.timer.reset();
            else this.timer.begin();

            this.$emit('change', this.section);
        },
        deleteSection() {
            this.timer.cancel();
            this.$emit('delete');
        }
    }
}