import AssignmentListItem from '../AssignmentListItem';
import AssignmentDetailView from '../AssignmentDetailView';
import FallbackLabel from '@/components/Controls/FallbackLabel';
import moment from 'moment';
import DataManager from '@/data-manager';
import api from '@/api';
import dateUtils from '@/utils/dates';
import { Assignment } from '@/data-types';
import { DMTableController } from '@/mixins';

export default {
    name: 'assignments',
    mixins: [ DMTableController ],
    components: { AssignmentDetailView, AssignmentListItem, FallbackLabel },
    beforeMount() {
        this.setupController({
            fetch: DataManager.getAssignments
        });
    },
    methods: {
        groupData(tempData, rawAssignments) {
            // Sort assignments
            const now = dateUtils.dateOnly(moment());
            
            rawAssignments = rawAssignments.filter(assignment => {
                if (assignment.dueDate === 'asap' || assignment.dueDate === 'eventually') return true;
                else return assignment.dueDate.isSameOrAfter(now);
            });

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
        assignmentDeleted(assignment) {
            const flatData = this.data.flat();
            const ind = flatData.indexOf(assignment);
            if (ind < 0) return;
            flatData.splice(ind, 1);

            if (flatData.length > 0) {
                if (ind > 0) this.select(flatData[ind - 1]);
                else this.select(flatData[0]);
            } else {
                this.select(undefined);
            }

            this.sortData(flatData);
        }
    }
}