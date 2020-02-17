import Vue from 'vue'
import axios from 'axios'
import api from './api'

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
    const idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc2MmZhNjM3YWY5NTM1OTBkYjhiYjhhNjM2YmYxMWQ0MzYwYWJjOTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjYxMTMyNjE4OTg1LW00ZWI5aHV1cW9zZmRkaWJnMTdqZ201MGQ2OWcwa2kzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjYxMTMyNjE4OTg1LW00ZWI5aHV1cW9zZmRkaWJnMTdqZ201MGQ2OWcwa2kzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAxNjI2MDYyNjUxNzI2NDAwMzk4IiwiaGQiOiJjYXNlLmVkdSIsImVtYWlsIjoibG1wMTIyQGNhc2UuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJDZzFaZWp6NFg3cXppQmxnNlUtUG5BIiwibmFtZSI6Ikx1Y2FzIFBvcHAiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FBdUU3bUMzZnNrSWtKMkNTbEZ2RjUyVXBjdHg3YjFtY0tIY181Y28zQzNyQ0E9czk2LWMiLCJnaXZlbl9uYW1lIjoiTHVjYXMiLCJmYW1pbHlfbmFtZSI6IlBvcHAiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU4MTk1NjQ1MSwiZXhwIjoxNTgxOTYwMDUxLCJqdGkiOiIzNzg4NDdmN2VjNzBmOTFhZjU0MTFmNmU0ZmNkYTA2NTljYjc0MDg0In0.pjP0x1pXS5jx5WdYCfAMN-ykXFIwN5Juyq2AzaUK6dPmXxJLjU1kNGRB4JLvpYTddy7Ffkq-Z0YFur3Ib_Pd29CfXmvOg43iX1y-73ts0u9rAb7OumcFWAVTDzHEv4rtfELpovB8Tecs-NhmOtipxsUHN8lQHGhnd085IkGpfW9nNZ1FvH6kQtYH1udcMHQYYp6Umzw17JdguPMW-xlPEGyxJQJTXhgz5aHx_xTnx2MX17RkjhLFB7tZMDoulZwUfsj05UgSDyoKo6GdAmCyRkEMSPJPxheCSw0l6dqhdhvUeiqGc-UrpDZGRPER4NuhjAvHRTs2qx2oAp6m5DP5Aw';
    console.log('signing in');
    await establishAuth(idToken);
    isSignedIn = true;
    console.log('signed in');
    sendEventToListeners('signin');
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

    sendEventToListeners('fetch-complete');
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
    needsFetch: () => needsFetch
}