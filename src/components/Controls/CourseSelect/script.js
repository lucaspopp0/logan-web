import Vue from 'vue';
import DataManager from '@/data-manager';

// TODO: Add listener logic
export default {
    name: 'course-select',
    props: ['value'],
    data() {
        return {
            semesters: [],
            current: undefined,
            idMap: {}
        }
    },
    mounted() {
        DataManager.addListener(this);

        if (DataManager.needsFetch()) {
            DataManager.fetchAllData();
        } else {
            this.updateData();
        }
    },
    beforeDestroy() {
        DataManager.removeListener(this);
    },
    methods: {
        dmEvent(event, data) {
            if (event == DataManager.FETCH_COMPLETE) {
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
        },
        updateValue() {
            this.$emit('input', this.idMap[current]);
        }
    }
}