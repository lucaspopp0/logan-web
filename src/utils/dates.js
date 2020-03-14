import moment from 'moment';

export const DB_DATE_FORMAT = 'M/D/YYYY';
export const DB_DATETIME_FORMAT = 'M/D/YYYY HH:mm';
export const PICKER_DATE_FORMAT = 'YYYY-MM-DD';

export function compareDates(d1, d2) {
    d1 = moment(d1);
    d2 = moment(d2);

    if (d1.isBefore(d2, 'date')) return -1;
    else if (d1.isSame(d2, 'date')) return 0;
    else return 1;
}

export function compareDueDates(d1, d2) {
    if (d1 === 'asap') {
        if (d2 === 'asap') return 0;
        else return -1;
    } else if (d1 === 'eventually') {
        if (d2 === 'eventually') return 0;
        else return 1;
    } else {
        if (d2 === 'asap') return 1;
        else if (d2 === 'eventually') return -1;
        else return compareDates(d1, d2);
    }
}

export function dateOnly(d) {
    const t = moment(d);

    t.set({
        millisecond: 0,
        second: 0,
        minute: 0,
        hour: 0
    });

    return t;
}

export function readableDate(date, forSentence = false) {
    const now = dateOnly(moment());
    date = dateOnly(date);
    const days = date.diff(now, 'days');

    if (days === 0) {
        return forSentence ? 'today' : 'Today';
    } else if (days === 1) {
        return forSentence ? 'tomorrow' : 'Tomorrow';
    } else if (days === -1) {
        return forSentence ? 'yesterday' : 'Yesterday';
    } else if (days > 0 && days <= 6 && now.weekday() < date.weekday()) {
        return date.format('dddd');
    } else if (days < 0 && days >= -6) {
        return (forSentence ? 'last ' : 'Last ') + date.format('dddd');
    } else if (date.year() == now.year()) {
        return date.format('MMM Do');
    } else {
        return date.format('MMMM Do, YYYY');
    }
}

export default {
    DB_DATE_FORMAT,
    DB_DATETIME_FORMAT,
    PICKER_DATE_FORMAT,
    compareDates,
    compareDueDates,
    dateOnly,
    readableDate
}