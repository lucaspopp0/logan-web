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
        }
    }
}