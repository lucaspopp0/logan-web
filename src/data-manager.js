import api from './api'

const EventType = {
    SIGNIN: 'signin',
    FETCH_COMPLETE: 'fetch-complete'
};

const AuthStatus = {
    UNAUTHED: 'unauthed',
    ESTABLISHING: 'establishing',
    FAILED: 'failed',
    SUCCESS: 'success'
};

let currentAuthStatus = AuthStatus.UNAUTHED;

let currentUser;
let needsFetch = true;

let semesters = [];
let assignments = [];
let tasks = [];

let listeners = [];

const DEV_BEARER = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc5YzgwOWRkMTE4NmNjMjI4YzRiYWY5MzU4NTk5NTMwY2U5MmI0YzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjYxMTMyNjE4OTg1LW00ZWI5aHV1cW9zZmRkaWJnMTdqZ201MGQ2OWcwa2kzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjYxMTMyNjE4OTg1LW00ZWI5aHV1cW9zZmRkaWJnMTdqZ201MGQ2OWcwa2kzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAxNjI2MDYyNjUxNzI2NDAwMzk4IiwiaGQiOiJjYXNlLmVkdSIsImVtYWlsIjoibG1wMTIyQGNhc2UuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJOWm9NUlhpTXp1WGxGbjdlMkFCZVRBIiwibmFtZSI6Ikx1Y2FzIFBvcHAiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FBdUU3bUMzZnNrSWtKMkNTbEZ2RjUyVXBjdHg3YjFtY0tIY181Y28zQzNyQ0E9czk2LWMiLCJnaXZlbl9uYW1lIjoiTHVjYXMiLCJmYW1pbHlfbmFtZSI6IlBvcHAiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU4MjU1MjEzNCwiZXhwIjoxNTgyNTU1NzM0LCJqdGkiOiIzNDI4NmFhODczNjgzYzU3ZmU5OWMwNmEyZDNiNjEwNjNlOThiNThlIn0.jOPwamr8Lc3QOxPYoPmXaf1eQwU89JGNJOVzFJLCWWlti7zNSjmIuKLAHl2SgU_5mr1tCIFIOioF4RbauDG6fKRpiIKFkB-NXD9TR9203Xylt7aP3c460cX6UIGXChZnCC6ZlwSe7cpPhfs83gmsWUdAV3rqp4C3krQ_8nciUB79AHmYtdzPKw3TYNhM4jl8vbBt3ntk-4Prj7nk0lhMBeretbDqfYsOEQ6n2L-yCNKCPof9--mqudwLdUtkDSnATqPduT1bzsDB9COMqTmCcFB0Z4VN0VJQ_bNPouzALasTF0n4nK5XZHsTvATo8kegOi0MFWOI2W7x2Nha7dyCnQ';

function sendEventToListeners(event, data) {
    for (const listener of listeners) {
        if (!!listener.dmEvent) listener.dmEvent(event, data);
    }
}

async function signIn(googleUser) {
    let idToken;

    currentAuthStatus = AuthStatus.UNAUTHED;

    if (process.env.NODE_ENV == 'production') {
        idToken = googleUser.getAuthResponse().id_token;
        console.log(idToken);
    } else if (process.env.NODE_ENV == 'development') {
        idToken = DEV_BEARER;
    }

    currentAuthStatus = AuthStatus.ESTABLISHING;

    try {
        await establishAuth(idToken);
        currentAuthStatus = AuthStatus.SUCCESS;
    } catch (authError) {
        currentAuthStatus = AuthStatus.FAILED;
        console.error(authError);
    }

    if (currentAuthStatus == AuthStatus.SUCCESS) {
        sendEventToListeners(EventType.SIGNIN);
        await fetchAllData();
    }
}

async function establishAuth(idToken) {
    await api.establishAuth(idToken);
}

async function fetchCurrentUser() {
    currentUser = await api.getCurrentUser();
}

async function fetchAllData() {
    if (currentAuthStatus != AuthStatus.SUCCESS) {
        console.error('Cannot fetch before establishing auth');
        return;
    }
    
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

    sendEventToListeners(EventType.FETCH_COMPLETE);
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
    isSignedIn: () => currentAuthStatus == AuthStatus.SUCCESS,
    signIn,
    establishAuth,
    fetchCurrentUser,
    fetchAllData,
    getTasks: () => tasks,
    getAssignments: () => assignments,
    getSemesters: () => semesters,
    needsFetch: () => needsFetch,
    EventType, AuthStatus
}