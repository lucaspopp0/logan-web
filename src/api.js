import _ from 'lodash';
import Vue from 'vue';
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

const types = ['Semester', 'Course', 'Section', 'Assignment', 'Task'];
const methods = {};

_.forEach(types, type => {
    methods[`get${type}s`] = async function() {
        return await execute('get', `/${type.toLowerCase()}s`);
    }

    methods[`add${type}`] = async function(obj) { 
        return await execute('post', `/${type.toLowerCase()}`, obj);
    }

    methods[`update${type}`] = async function(obj) {
        return await execute('put', `/${type.toLowerCase()}`, obj);
    }

    methods[`delete${type}`] = async function(obj) {
        return await execute('delete', `/${type.toLowerCase()}`, obj);
    }
});

export default {
    establishAuth,
    getCurrentUser,
    ...methods
}