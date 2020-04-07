import moment from 'moment';
import api from '@/api';
import DataManager from '@/data-manager';
import SectionListItem from '../SectionListItem'
import SectionDetailView from '../SectionDetailView'
import UpdateHandler from '@/mixins/update-handler';
import { Course, Section } from '@/data-types';
import { DB_DATETIME_FORMAT } from '@/utils/dates';

export default {
    name: 'course-detail-view',
    components: { SectionListItem, SectionDetailView },
    mixins: [UpdateHandler],
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
            currentSelection: undefined
        }
    },
    mounted() {
        this.setupHandlers('course', {
            update: api.updateCourse,
            delete: api.deleteCourse
        });
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
        }
    }
}