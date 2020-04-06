import Vue from 'vue';
import DataManager from '@/data-manager';
import { SemesterDetailView, SemesterListItem, CourseDetailView, CourseListItem } from '../'
import { UpdateTimer } from '@/utils/timers';
import moment from 'moment';
import api from '@/api';
import { Semester, Course } from '@/data-types';

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
        newSemester() {
            const newSemester = new Semester({
                sid: 'new',
                name: 'New Semester',
                startDate: moment().format('M/D/YYYY'),
                endDate: moment().format('M/D/YYYY')
            });

            this.semesters.push(newSemester);
            this.selectSemester(newSemester);

            api.addSemester(newSemester)
            .then(response => {
                this.updateTimer.fire();
                this.selectSemester(response);
            })
        },
        newCourse() {
            const newCourse = new Course({
                cid: 'newCourse',
                sid: this.currentSelection.value.sid,
                name: 'New Course',
                color: '000000'
            });

            const currentSemester = this.currentSelection.type === 'semester' ? this.currentSelection.value : this.currentSelection.value.semester;
            currentSemester.courses.push(newCourse);
            this.selectCourse(newCourse);

            api.addCourse(newCourse)
            .then(response => {
                const addedCourse = new Course(response);
                addedCourse.semester = currentSemester;
                this.updateTimer.fire();
                this.selectCourse(addedCourse);
            })
        },
        semesterDeleted() {
            // TODO: Implement
            console.warn('semesterDeleted() not implemented');
        },
        courseDeleted() {
            if (this.currentSelection.type === 'course') {
                const toDelete = this.currentSelection.value;

                toDelete.semester.courses.splice(toDelete.semester.courses.indexOf(toDelete), 1);
                this.updateData();
            }
        }
    },
    components: { SemesterDetailView, SemesterListItem, CourseListItem, CourseDetailView }
}