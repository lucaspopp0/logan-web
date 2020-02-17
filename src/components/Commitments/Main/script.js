import Vue from 'vue';
import DataManager from '@/data-manager';
import SemesterListItem from '../SemesterListItem';
import CourseListItem from '../CourseListItem';

export default {
    name: 'commitments',
    data() {
        return {
            semesters: []
        }
    },
    mounted() {
        DataManager.addListener(this);
        DataManager.fetchAllData()
        .then(() => {
            this.updateData()
        })
    },
    beforeDestroy() {
        DataManager.removeListener(this);
    },
    methods: {
        updateData() {
            Vue.set(this, 'semesters', DataManager.getSemesters());
        },
        dmEvent(event, data) {
            if (event === 'fetch-complete') {
                this.updateData();
            }
        }
    },
    components: { SemesterListItem, CourseListItem }
}