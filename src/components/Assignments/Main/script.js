import AssignmentListItem from '../AssignmentListItem';
import AssignmentDetailView from '../AssignmentDetailView';
import TableData from '@/utils/table-data';
import moment from 'moment';
import Vue from 'vue';
import DataManager from '@/data-manager';
import api from '@/api';
import dateUtils from '@/utils/dates';
import { Assignment } from '@/data-types';

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
            this.sortExistingData(DataManager.getAssignments());
        },
        sortExistingData(data) {
            const tempData = new TableData();
            let tempAssignments = [...(data || this.data.flat())];
            
            // Sort assignments
            const now = dateUtils.dateOnly(moment());
            
            tempAssignments = tempAssignments.filter(assignment => {
                if (assignment.dueDate === 'asap' || assignment.dueDate === 'eventually') return true;
                else return assignment.dueDate.isSameOrAfter(now);
            });

            tempAssignments.sort(dateUtils.compareDueDates);

            // Group assignments
            for (const assignment of tempAssignments) {
                if (assignment.dueDate === 'asap') {
                    tempData.addItem('ASAP', assignment);
                } else if (assignment.dueDate === 'eventually') {
                    tempData.addItem('Eventually', assignment);
                } else {
                    tempData.addItem(dateUtils.readableDate(assignment.dueDate), assignment);
                }
            }

            // Sort groups

            this.data = tempData;
        },
        newAssignment() {
            const newAssignment = new Assignment({
                aid: 'new',
                title: 'Untitled assignment',
                dueDate: moment().format('MM/DD/YYYY HH:mm')
            });

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
        assignmentUpdated() {
            this.sortExistingData();
        },
        deleteCurrentAssignment() {
            
        }
    }
}