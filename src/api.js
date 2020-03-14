import _ from 'lodash';
import axios from 'axios';
import { Semester, Course, Section, Assignment, Task } from '@/data-types';

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
    if (process.env.NODE_ENV == 'production') {
        const { bearer } = await execute('post', '/auth', { idToken }, true);
        BEARER = bearer;
    } else {
        BEARER = 'DEV lmp122@case.edu';
    }
}

async function getCurrentUser() {
    return await execute('get', '/users/me');
}

// Semester functions

async function getSemesters() {
    return _.map(await execute('get', '/semesters'), semester => new Semester(semester));
}

async function addSemester(semester) {
    return new Semester(await execute('post', '/semesters', semester.forDB()));
}

async function updateSemester(semester) {
    return new Semester(await execute('put', '/semesters', semester.forDB()));
}

async function deleteSemester(semester) {
    return await execute('delete', '/semesters', _.pick(semester.forDB(), ['uid', 'sid']));
}

// Course functions

async function getCourses() {
    return _.mapValues(await execute('get', '/courses'), arr => _.map(arr, course => new Course(course)));
}

async function addCourse(course) {
    return new Course(await execute('post', '/courses', course.forDB()));
}

async function updateCourse(course) {
    return new Course(await execute('put', '/courses', course.forDB()));
}

async function deleteCourse(course) {
    return await execute('delete', '/courses', _.pick(course.forDB(), ['uid', 'cid']));
}

// Section functions

async function getSections() {
    return _.mapValues(await execute('get', '/sections'), arr => _.map(arr, section => new Section(section)));
}

async function addSection(section) {
    return new Section(await execute('post', '/sections', section.forDB()));
}

async function updateSection(section) {
    return new Section(await execute('put', '/sections', section.forDB()));
}

async function deleteSection(section) {
    return await execute('delete', '/sections', _.pick(section.forDB(), ['uid', 'secid']));
}

// Assignment functions

async function getAssignments() {
    return _.map(await execute('get', '/assignments'), assignment => new Assignment(assignment));
}

async function addAssignment(assignment) {
    return new Assignment(await execute('post', '/assignments', assignment.forDB()));
}

async function updateAssignment(assignment) {
    return new Assignment(await execute('put', '/assignments', assignment.forDB()));
}

async function deleteAssignment(assignment) {
    return await execute('delete', '/assignments', _.pick(assignment.forDB(), ['uid', 'aid']));
}

// Task functions

async function getTasks() {
    return _.map(await execute('get', '/tasks'), task => new Task(task));
}

async function addTask(task) {
    return new Task(await execute('post', '/tasks', task.forDB()));
}

async function updateTask(task) {
    return new Task(await execute('put', '/tasks', task.forDB()));
}

async function deleteTask(task) {
    return await execute('delete', '/tasks', _.pick(task.forDB(), ['uid', 'tid']));
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