import Vue from 'vue'
import axios from 'axios'
import api from './api'

const SIGNIN = 'signin';
const FETCH_COMPLETE = 'fetch-complete';

let currentUser;
let isSignedIn = false;
let needsFetch = true;

let semesters = [];
let assignments = [];
let tasks = [];

let listeners = [];

function sendEventToListeners(event, data) {
    for (const listener of listeners) {
        if (!!listener.dmEvent) listener.dmEvent(event, data);
    }
}

async function signIn(googleUser) {
    // const idToken = googleUser.getAuthResponse().id_token;
    const idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc2MmZhNjM3YWY5NTM1OTBkYjhiYjhhNjM2YmYxMWQ0MzYwYWJjOTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjYxMTMyNjE4OTg1LW00ZWI5aHV1cW9zZmRkaWJnMTdqZ201MGQ2OWcwa2kzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjYxMTMyNjE4OTg1LW00ZWI5aHV1cW9zZmRkaWJnMTdqZ201MGQ2OWcwa2kzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAxNjI2MDYyNjUxNzI2NDAwMzk4IiwiaGQiOiJjYXNlLmVkdSIsImVtYWlsIjoibG1wMTIyQGNhc2UuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJtMGZQN3VuLTRQRzMzLUtmU3BQUkpBIiwibmFtZSI6Ikx1Y2FzIFBvcHAiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FBdUU3bUMzZnNrSWtKMkNTbEZ2RjUyVXBjdHg3YjFtY0tIY181Y28zQzNyQ0E9czk2LWMiLCJnaXZlbl9uYW1lIjoiTHVjYXMiLCJmYW1pbHlfbmFtZSI6IlBvcHAiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU4MTk3Mjk1MSwiZXhwIjoxNTgxOTc2NTUxLCJqdGkiOiI4MWZiZGIyMTdjOTJlNzljZjkzMzZjMjNhNTMwY2MwY2NlZDk4YzM1In0.bP36LXbhhGE8ii2J1R2IEI7fXidyMuZwPKtse0oGCqH0TRRaF42ksPzmIMroyZOIYfekGMZKTrky-cmkYsM85lcXaonJqGEU840D2azI-qEvS83dp6pzSHhnECDOSOgUitEx7FU0XgdQ_go_1YjTYDL0pffb0TXYBCmmgh0CHkXqIa2YcYsWCKGhjh8-pR2n7olKauiAgnb24-SdznnGZLg71tLIglwxp148a2ZIOon83PEQJ2Jo-ReDyK3MVmESaeJfKNjiEOl7ZSE70g88dcSIPT_RFAiCnLKkCJHIk9cb1xzDs5wUW3T1sBpoK5kE5OR164mTpggR67jNTuyRzw';
    await establishAuth(idToken);
    isSignedIn = true;
    sendEventToListeners(SIGNIN);
    await fetchAllData();
}

async function establishAuth(idToken) {
    await api.establishAuth(idToken);
}

async function fetchCurrentUser() {
    currentUser = await api.getCurrentUser();
}

async function fetchAllData() {
    // Fetch user
    await fetchCurrentUser();

    let tempSemesters, tempCourses, tempSections, tempAssignments, tempTasks;
    let idMap = { semesters: {}, courses: {}, assignments: {} };

    // Make requests in parallel
    await Promise.all([
        new Promise(async (resolve) => {
            tempSemesters = await api.getSemesters();
            resolve();
        }), 
        new Promise(async (resolve) => {
            tempCourses = await api.getCourses();
            resolve();
        }),
        new Promise(async (resolve) => {
            tempSections = await api.getSections();
            resolve();
        }), 
        new Promise(async (resolve) => {
            tempAssignments = await api.getAssignments();
            resolve();
        }), 
        new Promise(async (resolve) => {
            tempTasks = await api.getTasks();
            resolve();
        })
    ]);
    
    // Load semesters
    for (const semester of tempSemesters) {
        semester.courses = [];
        idMap.semesters[semester.sid] = semester;
    }

    // Load courses
    for (const sid in tempCourses) {
        for (const course of tempCourses[sid]) {
            course.sections = [];
            course.semester = idMap.semesters[sid];
            course.semester.courses.push(course);
            idMap.courses[course.cid] = course;
        }
    }

    // Load sections
    for (const cid in tempSections) {
        for (const section of tempSections[cid]) {
            section.course = idMap.courses[cid];
            section.course.sections.push(section);
        }
    }

    // Load assignments
    for (const assignment of tempAssignments) {
        idMap.assignments[assignment.aid] = assignment;
        if (!!assignment.cid) assignment.course = idMap.courses[assignment.cid];
    }

    // Load tasks
    for (const task of tempTasks) {
        if (!!task.commitmentId) task.course = idMap.courses[task.commitmentId];
        if (!!task.aid) task.relatedAssignment = idMap.assignments[task.aid];
    }

    semesters = tempSemesters;
    assignments = tempAssignments;
    tasks = tempTasks;

    needsFetch = false;

    sendEventToListeners(FETCH_COMPLETE);
}

export default {
    addListener: function(listener) {
        listeners.push(listener)
    },
    removeListener: function(listener) {
        for (let i = 0;i < listeners.length;i++) {
            if (listeners[i] === listener) {
                listeners.splice(i, 1);
                return;
            }
        }
    },
    isSignedIn: function () {
        return isSignedIn
    },
    signIn,
    establishAuth,
    fetchCurrentUser,
    fetchAllData,
    getTasks: () => tasks,
    getSemesters: () => semesters,
    needsFetch: () => needsFetch,
    SIGNIN, FETCH_COMPLETE
}