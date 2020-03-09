import moment from 'moment';

function compareDates(d1, d2) {
    d1 = moment(d1);
    d2 = moment(d2);

    if (d1.isBefore(d2, 'date')) return -1;
    else if (d1.isSame(d2, 'date')) return 0;
    else return 1;
}

function readableDate(date, forSentence = false) {
    const now = moment();
    date = moment(date);
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
    compareDates,
    readableDate
}