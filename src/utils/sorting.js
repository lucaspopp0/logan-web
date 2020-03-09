import moment from 'moment';
import { dateOnly } from './dates';

function compareStrings(s1, s2) {
    if (s1 < s2) {
        return -1;
    } else if (s1 === s2) {
        return 0;
    } else {
        return 1;
    }
}

function initialTaskSortAlgorithm(showingCompletedTasks) {
    return !showingCompletedTasks ? initialSortIncompleteTasks : initialSortCompleteTasks;
}

function initialSortIncompleteTasks(task1, task2) {
    const now = dateOnly(moment());

    if (task1.dueDate === 'eventually') {
        if (task2.dueDate === 'eventually') return 0;
        else return 1;
    } else if (task1.dueDate === 'asap') {
        if (task2.dueDate === 'asap') return 0;
        else if (task2.dueDate === 'eventually') return -1;
        else {
            if (dateOnly(task2.dueDate).isBefore(now.clone().subtract(1, 'day'), 'date')) return 1;
            else return -1;
        }
    } else {
        const t1d = dateOnly(task1.dueDate);

        if (task2.dueDate === 'asap') {
            if (t1d.isBefore(now.clone().subtract(1, 'day'), 'date')) return -1;
            else return 1;
        } else if (task2.dueDate === 'eventually') {
            return -1;
        } else {
            const t2d = dateOnly(task2.dueDate);
            
            if (t1d.isBefore(t2d, 'date')) return -1;
            else if (t1d.isSame(t2d, 'date')) return 0;
            else return 1;
        }
    }
}

function initialSortCompleteTasks(task1, task2) {
    if (!!task1.completionDate && !!task2.completionDate) {
        const t1cd = moment(task1.completionDate);
        const t2cd = moment(task2.completionDate);

        if (t1cd.isSame(t2cd, 'date')) return 0;
        else if (t1cd.isBefore(t2cd, 'date')) return -1;
        else return 1;
    }

    return 0;
}

function sectionSortTasks(task1, task2) {
    if (task1.priority != task2.priority) {
        return task2.priority - task1.priority;
    }

    if (!!task1.course && !task2.course) {
        return -1;
    } else if (!task1.course && !!task2.course) {
        return 1;
    } else if (!!task1.cid && !!task2.cid && task1.cid === task2.cid) {
        return compareStrings(task1.course.name, task2.course.name);
    }

    if (!!task1.relatedAssignment && !task2.relatedAssignment) {
        return -1;
    } else if (!task1.relatedAssignment && !!task1.relatedAssignment) {
        return 1;
    } else if (!!task1.relatedAssignment && !!task2.relatedAssignment && task1.relatedAssignment === task2.relatedAssignment) {
        return compareStrings(task1.relatedAssignment.title, task2.relatedAssignment.title);
    }

    return compareStrings(task1.title, task2.title);
}

export default {
    initialTaskSortAlgorithm,
    initialSortIncompleteTasks,
    initialSortCompleteTasks,
    sectionSortTasks
}