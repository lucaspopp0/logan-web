import Vue from 'vue'
import axios from 'axios'
import api from './api'

let currentUser;
let isSignedIn = false;

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
    const idToken = googleUser.getAuthResponse().id_token;
    await establishAuth(idToken);
    isSignedIn = true;
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
    for (const course of tempCourses) {
        course.sections = [];
        course.semester = idMap.semesters[course.sid];
        course.semester.courses.push(course);
        idMap.courses[course.cid] = course;
    }

    // Load sections
    for (const section of tempSections) {
        section.course = idMap.courses[section.cid];
        section.course.sections.push(section);
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
    fetchAllData
}