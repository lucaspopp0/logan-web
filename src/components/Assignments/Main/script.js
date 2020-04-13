import AssignmentListItem from '../AssignmentListItem';
import AssignmentDetailView from '../AssignmentDetailView';
import TableData from '@/utils/table-data';
import moment from 'moment';
import Vue from 'vue';
import DataManager from '@/data-manager';
import api from '@/api';
import dateUtils from '@/utils/dates';
import { Assignment } from '@/data-types';
import { DMTableController } from '@/mixins';

export default {
    name: 'assignments',
    mixins: [ DMTableController ],
    components: { AssignmentDetailView, AssignmentListItem },
    beforeMount() {
        this.setupController({
            fetch: DataManager.getAssignments
        });
    },
    methods: {
        groupData(tempData, rawAssignments) {
            // Sort assignments
            const now = dateUtils.dateOnly(moment());
            
            // tempAssignments = tempAssignments.filter(assignment => {
            //     if (assignment.dueDate === 'asap' || assignment.dueDate === 'eventually') return true;
            //     else return assignment.dueDate.isSameOrAfter(now);
            // });

            rawAssignments.sort(dateUtils.compareDueDates);

            // Group assignments
            for (const assignment of rawAssignments) {
                if (assignment.dueDate === 'asap') {
                    tempData.addItem('ASAP', assignment);
                } else if (assignment.dueDate === 'eventually') {
                    tempData.addItem('Eventually', assignment);
                } else {
                    tempData.addItem(dateUtils.readableDate(assignment.dueDate), assignment);
                }
            }

            // TODO: Sort groups
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
        isCurrentSelection(assignment) {
            return this.currentSelection && assignment.aid === this.currentSelection.aid;
        },
        assignmentUpdated() {
            this.sortData();
        },
        deleteCurrentAssignment() {
            
        }
    }
}