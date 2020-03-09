import _ from 'lodash';
import axios from 'axios';

let BEARER;

const client = axios.create({
    baseURL: 'http://logan-backend.us-west-2.elasticbeanstalk.com/',
    json: true
})

async function execute(method, path, data, ignoreAuth=false) {
    const params = {
        method,
        url: path,
        data
    };

    if (!ignoreAuth) params.headers = { Authorization: `Bearer ${BEARER}` };

    const response = await client(params);
    return response.data;
}

async function establishAuth(idToken) {
    const { bearer } = await execute('post', '/auth', { idToken }, true);
    BEARER = bearer;
}

async function getCurrentUser() {
    return await execute('get', '/users/me');
}

// Semester functions

async function getSemesters() {
    return await execute('get', '/semesters');
}

async function addSemester(semester) {
    return await execute('post', '/semesters', _.omit(semester, ['courses']));
}

async function updateSemester(semester) {
    return await execute('put', '/semesters', _.omit(semester, ['courses']));
}

async function deleteSemester(semester) {
    return await execute('delete', '/semesters', _.pick(semester, ['uid', 'sid']));
}

// Course functions

async function getCourses() {
    return await execute('get', '/courses');
}

async function addCourse(course) {
    return await execute('post', '/courses', _.omit(course, ['semester', 'sections']));
}

async function updateCourse(course) {
    return await execute('put', '/courses', _.omit(course, ['semester', 'sections']));
}

async function deleteCourse(course) {
    return await execute('delete', '/courses', _.pick(course, ['uid', 'cid']));
}

// Section functions

async function getSections() {
    return await execute('get', '/sections');
}

async function addSection(section) {
    return await execute('post', '/sections', _.omit(section, ['course']));
}

async function updateSection(section) {
    return await execute('put', '/sections', _.omit(section, ['course']));
}

async function deleteSection(section) {
    return await execute('delete', '/sections', _.pick(section, ['uid', 'secid']));
}

// Assignment functions

async function getAssignments() {
    return await execute('get', '/assignments');
}

async function addAssignment(assignment) {
    return await execute('post', '/assignments', _.omit(assignment, ['course']));
}

async function updateAssignment(assignment) {
    return await execute('put', '/assignments', _.omit(assignment, ['course']));
}

async function deleteAssignment(assignment) {
    return await execute('delete', '/assignments', _.pick(assignment, ['uid', 'aid']));
}

// Task functions

async function getTasks() {
    return await execute('get', '/tasks');
}

async function addTask(task) {
    return await execute('post', '/tasks', _.omit(task, ['course', 'relatedAssignment']));
}

async function updateTask(task) {
    return await execute('put', '/tasks', _.omit(task, ['course', 'relatedAssignment']));
}

async function deleteTask(task) {
    return await execute('delete', '/tasks', _.pick(task, ['uid', 'tid']));
}

export default {
    establishAuth,
    getCurrentUser,
    getSemesters,
    addSemester,
    updateSemester,
    deleteSemester,
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    getSections,
    addSection,
    updateSection,
    deleteSection,
    getAssignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    getTasks,
    addTask,
    updateTask,
    deleteTask
}