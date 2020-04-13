import Vue from 'vue';
import DataManager from '@/data-manager';
import { SemesterDetailView, SemesterListItem, CourseDetailView, CourseListItem } from '../'
import FallbackLabel from '@/components/Controls/FallbackLabel';
import moment from 'moment';
import api from '@/api';
import { Semester, Course } from '@/data-types';

export default {
    name: 'commitments',
    components: { SemesterDetailView, SemesterListItem, CourseListItem, CourseDetailView, FallbackLabel },
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
                    this.select(this.semesters[0].courses[0])
                } else {
                    this.select(this.semesters[0]);
                }
            }
        },
        select(item) {
            if (item instanceof Semester) {
                Vue.set(this.currentSelection, 'type', 'semester');
                Vue.set(this.currentSelection, 'value', item);
            } else if (item instanceof Course) {
                Vue.set(this.currentSelection, 'type', 'course');
                Vue.set(this.currentSelection, 'value', item);
            } else {
                this.currentSelection = {
                    type: undefined,
                    value: undefined
                };
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
        isCurrentSelection(obj) {
            if (!this.currentSelection) return false;
            if (this.currentSelection.type == 'course' && obj instanceof Course) return this.currentSelection.value.cid === obj.cid;
            else if (this.currentSelection.type == 'semester' && obj instanceof Semester) return this.currentSelection.value.sid === obj.sid;
            else return false;
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
                this.selectSemester(response);
                DataManager.fetchAllData();
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
                currentSemester.courses.splice(currentSemester.courses.indexOf(newCourse), 1);

                const addedCourse = new Course(response);
                addedCourse.semester = currentSemester;

                currentSemester.courses.push(addedCourse);

                this.selectCourse(addedCourse);
                DataManager.fetchAllData();
            })
        },
        semesterDeleted() {
            // TODO: Implement
            console.warn('semesterDeleted() not implemented');
        },
        courseDeleted(course) {
            let courses = course.semester.courses;
            const ind = courses.indexOf(course);
            courses.splice(ind, 1);

            if (courses.length > 0) {
                if (ind > 0) this.select(courses[ind - 1]);
                else this.select(courses[0]);
            } else {
                this.select(course.semester);
            }

            this.updateData();
        }
    }
}