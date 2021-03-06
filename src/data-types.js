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

        this.sections = this.sections || [];
    }

    forDB() {
        const out = super.forDB();
        if (!out.sid && out.semester) out.sid = out.semester.sid;
        return _.omit(out, ['semester', 'sections']);
    }

}

export class Section extends DBObj {

    constructor(obj) {
        super(obj);
        this.start = moment(this.start, DB_DATETIME_FORMAT);
        this.end = moment(this.end, DB_DATETIME_FORMAT);
    }

    forDB() {
        const out = super.forDB();
        if (!out.cid && out.course) out.cid = out.course.cid;
        out.start = out.start.format(DB_DATETIME_FORMAT);
        out.end = out.end.format(DB_DATETIME_FORMAT);
        return _.omit(out, ['course']);
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
        let out = super.forDB();
        if (!!out.course) out.commitmentId = out.course.cid;
        if (out.dueDate !== 'asap' && out.dueDate !== 'eventually') out.dueDate = out.dueDate.format(DB_DATE_FORMAT);
        return _.omit(out, ['course', 'tasks']);
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
        let out = super.forDB();

        if (!!out.relatedAssignment) out.relatedAid = out.relatedAssignment.aid;
        else if (!!out.course) out.commitmentId = out.course.cid;

        if (out.dueDate !== 'asap' && out.dueDate !== 'eventually') out.dueDate = out.dueDate.format(DB_DATE_FORMAT);
        if (!!out.completionDate) out.completionDate = out.completionDate.format(DB_DATE_FORMAT);
        return _.omit(out, ['course', 'relatedAssignment']);;
    }

}

export default {
    Semester,
    Course,
    Section,
    Assignment,
    Task
}