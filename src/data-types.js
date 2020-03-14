import moment from "moment";
import { DB_DATE_FORMAT , DB_DATETIME_FORMAT } from '@/utils/dates';

class DBObj {

    constructor(obj) {
        _.assign(this, obj);
    }

    forDB() {
        return _.assign({}, this);
    }

}

export class Semester extends DBObj {

    constructor(obj) {
        super(obj);

        this.startDate = moment(this.startDate, DB_DATE_FORMAT);
        this.endDate = moment(this.endDate, DB_DATE_FORMAT);
    }

    forDB() {
        let out = _.omit(super.forDB(), ['courses']);

        out.startDate = out.startDate.format(DB_DATE_FORMAT);
        out.endDate = out.endDate.format(DB_DATE_FORMAT);

        return out;
    }

}

export class Course extends DBObj {

    constructor(obj) {
        super(obj);
    }

    forDB() {
        return _.omit(super.forDB(), ['semester', 'sections']);
    }

}

export class Section extends DBObj {

    constructor(obj) {
        super(obj);
        this.start = moment(this.start, DB_DATETIME_FORMAT);
        this.end = moment(this.end, DB_DATETIME_FORMAT);
    }

    forDB() {
        return _.omit(super.forDB(), ['course']);
    }

}

export class Assignment extends DBObj {

    constructor(obj) {
        super(obj);

        if (this.dueDate != 'asap' && this.dueDate != 'eventually') {
            this.dueDate = moment(this.dueDate, DB_DATE_FORMAT);
        }
    }

    forDB() {
        let out = _.omit(super.forDB(), ['course', 'tasks']);
        if (out.dueDate !== 'asap' && out.dueDate !== 'eventually') out.dueDate = out.dueDate.format(DB_DATE_FORMAT);
        return out;
    }

}

export class Task extends DBObj {

    constructor(obj) {
        super(obj);

        if (this.dueDate != 'asap' && this.dueDate != 'eventually') {
            this.dueDate = moment(this.dueDate, DB_DATE_FORMAT);
        }

        if (!!this.completionDate) {
            this.completionDate = moment(this.completionDate, DB_DATE_FORMAT);
        }
    }

    forDB() {
        let out = _.omit(super.forDB(), ['course', 'relatedAssignment']);
        if (out.dueDate !== 'asap' && out.dueDate !== 'eventually') out.dueDate = out.dueDate.format(DB_DATE_FORMAT);
        if (!!out.completionDate) out.completionDate = out.completionDate.format(DB_DATE_FORMAT);
        return out;
    }

}

export default {
    Semester,
    Course,
    Section,
    Assignment,
    Task
}