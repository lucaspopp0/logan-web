import AssignmentListItem from '../AssignmentListItem';
import AssignmentDetailView from '../AssignmentDetailView';
import TableData from '@/utils/table-data';
import moment from 'moment';
import Vue from 'vue';
import DataManager from '@/data-manager';
import api from '@/api';

export default {
    name: 'assignments',
    components: { AssignmentDetailView, AssignmentListItem },
    data() {
        return {
            data: new TableData(),
            currentSelection: {
                type: 'none',
                value: undefined
            }
        }
    },
    mounted() {
        DataManager.addListener(this);
        if (!DataManager.needsFetch()) {
            this.updateData();
        }
    },
    beforeDestroy() {
        DataManager.removeListener(this);
    },
    methods: {
        dmEvent(event, data) {  
            if (event === DataManager.EventType.FETCH_COMPLETE) {
                this.updateData();
            }
        },
        updateData() {
            const tempData = new TableData();
            let tempAssignments = [...DataManager.getAssignments()];
            // Sort assignments

            // Group assignments
            for (const assignment of tempAssignments) {
                tempData.addItem('All', assignment);
            }

            // Sort groups

            this.data = tempData;
        },
        newAssignment() {
            const newAssignment = {
                aid: 'new',
                title: 'Untitled assignment',
                dueDate: moment().format('MM/DD/YYYY HH:mm')
            };

            api.addAssignment(newAssignment)
            .then(response => {
                this.select('assignment', response);
                DataManager.fetchAllData();
            })
        },
        select(type, value) {
            Vue.set(this.currentSelection, 'type', type);
            Vue.set(this.currentSelection, 'value', value);
        },
        deleteCurrentAssignment() {
            
        }
    }
}