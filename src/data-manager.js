import api from '@/api'

const EventType = {
    SIGNIN: 'signin',
    FETCH_START: 'fetch-start',
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
    sendEventToListeners(EventType.FETCH_START);

    if (currentAuthStatus != AuthStatus.SUCCESS) {
        console.error('Cannot fetch before establishing auth');
        return;
    }

    // Fetch user
    await fetchCurrentUser();

    let tempSemesters, tempCourses, tempSections, tempAssignments, tempTasks;
    let idMap = {semesters: {}, courses: {}, assignments: {}};

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
        if (!!assignment.commitmentId) assignment.course = idMap.courses[assignment.commitmentId];
    }

    // Load tasks
    for (const task of tempTasks) {
        if (!!task.relatedAid) {
            task.relatedAssignment = idMap.assignments[task.relatedAid];
            task.commitmentId = task.relatedAssignment.commitmentId;
            task.course = task.relatedAssignment.course;
        } else if (!!task.commitmentId) {
            task.course = idMap.courses[task.commitmentId];
        }
    }

    semesters = tempSemesters;
    assignments = tempAssignments;
    tasks = tempTasks;

    needsFetch = false;

    sendEventToListeners(EventType.FETCH_COMPLETE);
}

export default {
    addListener: function (listener) {
        listeners.push(listener)
    },
    removeListener: function (listener) {
        for (let i = 0; i < listeners.length; i++) {
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
