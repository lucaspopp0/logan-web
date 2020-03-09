import Vue from 'vue';
import DataManager from '@/data-manager';

export default {
    name: 'course-select',
    props: {
        value: {
            type: Object,
            default() {
                return {
                    cid: 'none'
                }
            }
        }
    },
    data() {
        return {
            semesters: [],
            idMap: {}
        }
    },
    mounted() {
        DataManager.addListener(this);

        if (!DataManager.needsFetch()) {
            this.updateData();
        }
    },
    beforeDestroy() {
        DataManager.removeListener(this);
    },
    computed: {
        current: {
            get() {
                return this.value.cid;
            },
            set(newValue) {
                this.$emit('input', this.idMap[newValue]);
            }
        }
    },
    methods: {
        dmEvent(event, data) {
            if (event == DataManager.EventType.FETCH_COMPLETE) {
                this.updateData();
            }
        },
        updateData() {
            Vue.set(this, 'semesters', DataManager.getSemesters());
            this.idMap = {};
            for (const semester of this.semesters) {
                for (const course of semester.courses) {
                    this.idMap[course.cid] = course;
                }
            }
        }
    }
}