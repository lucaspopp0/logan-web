import api from '@/api';
import DataManager from '@/data-manager';
import SectionListItem from '../SectionListItem'
import SectionDetailView from '../SectionDetailView'
import { UpdateHandler } from '@/mixins';
import { Course, Section } from '@/data-types';
import { DB_DATETIME_FORMAT } from '@/utils/dates';
import { FallbackLabel } from '@/components/Controls';

export default {
    name: 'course-detail-view',
    components: { SectionListItem, SectionDetailView, FallbackLabel },
    mixins: [ UpdateHandler ],
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
    data () {
        return {
            currentSelection: undefined
        }
    },
    mounted() {
        this.setupHandlers('course', {
            update: api.updateCourse,
            delete: api.deleteCourse
        });

        if (this.course.sections.length > 0) {
            this.select(this.course.sections[0]);
        }
    },
    watch: {
        course(newValue, oldValue) {
            this.handlePropChange(oldValue);

            if (newValue.sections.length > 0) {
                this.select(newValue.sections[0]);
            } else {
                this.select();
            }
        }
    },
    methods: {
        select(section) {
            this.currentSelection = section;
        },
        isCurrentSelection(item) {
            if (!this.currentSelection) return false;
            return item.secid === this.currentSelection.secid;
        },
        newSection() {
            let newsec = new Section({
                secid: 'fakeid',
                cid: this.course.cid,
                name: 'Untitled',
                weeklyRepeat: 1,
                start: this.course.semester.startDate.format(DB_DATETIME_FORMAT),
                end: this.course.semester.endDate.format(DB_DATETIME_FORMAT),
            });

            this.course.sections.push(newsec);
            this.select(newsec);

            api.addSection(newsec)
            .then(response => {
                this.course.sections.splice(this.course.sections.indexOf(newsec), 1);
                this.course.sections.push(response);
                this.select(response);
                DataManager.fetchAllData();
            })
        },
        deleteSection(section) {
            const ind = this.course.sections.indexOf(section);
            this.course.sections.splice(ind, 1);
            if (this.course.sections.length > 0) {
                this.select(this.course.sections[ind - 1]);
            } else {
                this.select();
            }

            api.deleteSection(section)
            .then(response => {
                DataManager.fetchAllData();
            })
        }
    }
}