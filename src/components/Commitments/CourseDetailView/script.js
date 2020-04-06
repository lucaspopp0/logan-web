import moment from 'moment';
import api from '@/api';
import DataManager from '@/data-manager';
import SectionListItem from '../SectionListItem'
import SectionDetailView from '../SectionDetailView'
import { UpdateTimer } from '@/utils/timers';
import { Course, Section } from '@/data-types';
import { DB_DATETIME_FORMAT } from '@/utils/dates';

export default {
    name: 'course-detail-view',
    components: { SectionListItem, SectionDetailView },
    props: {
        course: {
            type: Course,
            default() {
                return new Course({
                    name: '',
                    nickname: '',
                    descriptor: '',
                    sections: [],
                    isFake: true
                });
            }
        }
    },
    data() {
        return {
            currentSelection: undefined,
            changesPresent: false,
            timer: undefined
        }
    },
    mounted() {
        this.timer = new UpdateTimer(2000, () => { this.updateCourse(this.course) });
    },
    watch: {
        course(newValue, oldValue) {
            if (this.changesPresent) {
                this.updateCourse(oldValue);
            }

            this.timer.cancel();

            if (newValue.sections.length > 0) {
                this.select(newValue.sections[0]);
            } else {
                this.select();
            }
        }
    },
    methods: {
        updateCourse(courseToUpdate) {
            console.log('Attempting to update course');
            this.timer.cancel();

            if (this.changesPresent) {
                api.updateCourse(courseToUpdate);
            }

            this.changesPresent = false;
        },
        registerChange() {
            console.log('Course changed');
            this.changesPresent = true;

            if (this.timer.isOn) this.timer.reset();
            else this.timer.begin();

            this.$emit('change', this.course);
        },
        select(section) {
            this.currentSelection = section;
        },
        newSection() {
            let newsec = new Section({
                cid: this.course.cid,
                name: 'Untitled',
                weeklyRepeat: 1,
                start: this.course.semester.startDate.format(DB_DATETIME_FORMAT),
                end: this.course.semester.endDate.format(DB_DATETIME_FORMAT),
            });

            api.addSection(newsec)
            .then(response => {
                this.course.sections.push(response);
                DataManager.fetchAllData();
            })
        },
        deleteSection(section) {
            this.course.sections.splice(this.course.sections.indexOf(section), 1);
        },
        deleteCourse() {
            this.timer.cancel();
            this.$emit('delete');
            api.deleteCourse(this.course);
        }
    }
}