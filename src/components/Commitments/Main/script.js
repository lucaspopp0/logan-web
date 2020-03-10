import Vue from 'vue';
import DataManager from '@/data-manager';
import SemesterListItem from '../SemesterListItem';
import CourseListItem from '../CourseListItem';
import CourseDetailView from '../CourseDetailView';
import { UpdateTimer } from '@/utils/timers';

export default {
    name: 'commitments',
    data() {
        return {
            semesters: [],
            updateTimer: undefined,
            currentSelection: {
                type: undefined,
                value: undefined
            }
        }
    },
    mounted() {
        this.updateTimer = new UpdateTimer(30000, DataManager.fetchAllData);

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
        },
        courseDeleted() {
            if (this.currentSelection.type === 'course') {
                const toDelete = this.currentSelection.value;

                toDelete.semester.courses.splice(toDelete.semester.courses.indexOf(toDelete), 1);
                this.updateData();
            }
        }
    },
    components: { SemesterListItem, CourseListItem, CourseDetailView }
}