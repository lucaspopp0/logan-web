import moment from 'moment';
import api from '@/api';
import DataManager from '@/data-manager';
import SectionListItem from '../SectionListItem'
import SectionDetailView from '../SectionDetailView'

export default {
    name: 'course-detail-view',
    components: { SectionListItem, SectionDetailView },
    props: ['course'],
    data() {
        return {
            currentSelection: null
        }
    },
    methods: {
        select(section) {
            this.currentSelection = section;
        },
        newSection() {
            let newsec = {
                cid: this.course.cid,
                name: 'Untitled',
                weeklyRepeat: 1,
                start: moment(this.course.semester.startDate).format('MM/DD/YYY HH:mm'),
                end: moment(this.course.semester.endDate).format('MM/DD/YYY HH:mm'),
            }

            api.addSection(newsec)
            .then(response => {
                this.course.sections.push(response);
                DataManager.fetchAllData();
            })
        }
    }
}