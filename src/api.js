import Vue from 'vue'
import axios from 'axios'

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

async function getSemesters() {
    return await execute('get', '/semesters');
}

async function getCourses() {
    return await execute('get', '/courses');
}

async function getSections() {
    return await execute('get', '/sections');
}

async function getAssignments() {
    return await execute('get', '/assignments');
}

async function getTasks() {
    return await execute('get', '/tasks');
}

export default {
    establishAuth,
    getCurrentUser,
    getSemesters,
    getCourses,
    getSections,
    getAssignments,
    getTasks
}