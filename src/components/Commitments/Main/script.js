import Vue from 'vue';
import DataManager from '@/data-manager';
import SemesterListItem from '../SemesterListItem';
import CourseListItem from '../CourseListItem';
import CourseDetailView from '../CourseDetailView';

export default {
    name: 'commitments',
    data() {
        return {
            semesters: [],
            currentSelection: {
                type: undefined,
                value: undefined
            }
        }
    },
    mounted() {
        DataManager.addListener(this);
        
        if (!DataManager.needsFetch()) {
            this.updateData()
        }
    },
    beforeDestroy() {
        DataManager.removeListener(this);
    },
    methods: {
        updateData() {
            Vue.set(this, 'semesters', DataManager.getSemesters());

            if ((this.currentSelection.type == undefined || this.currentSelection.value == undefined) && this.semesters.length > 0) {
                if (this.semesters[0].courses.length > 0) {
                    this.selectCourse(this.semesters[0].courses[0])
                } else {
                    this.selectSemester(this.semesters[0]);
                }
            }
        },
        selectSemester(semester) {
            Vue.set(this.currentSelection, 'type', 'semester');
            Vue.set(this.currentSelection, 'value', semester);
        },
        selectCourse(course) {
            Vue.set(this.currentSelection, 'type', 'course');
            Vue.set(this.currentSelection, 'value', course);
        },
        dmEvent(event, data) {
            if (event === DataManager.EventType.FETCH_COMPLETE) {
                this.updateData();
            }
        }
    },
    components: { SemesterListItem, CourseListItem, CourseDetailView }
}