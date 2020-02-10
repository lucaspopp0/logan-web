import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
    baseURL: 'http://logan-backend.us-west-2.elasticbeanstalk.com/',
    json: true
})

let BEARER;
let currentUser;

let semesters = [];
let assignments = [];
let tasks = [];

// METHOD: Fetch all data
// - Fetch user
// - Fetch all semessters
// - Fetch all courses
// - Fetch all sections
// - Fetch all assignments
// - Fetch all tasks

function establishAuth(bearer) {
    BEARER = bearer;
}

async function fetchCurrentUser() {
    return client({
        method: 'get',
        url: '/users/me',
        data,
        headers: {
            Authorization: `Bearer ${BEARER}`
        }
    }).then(req => {
        currentUser = req.data;
        console.log(currentUser);
    });
}

async function fetchAllData() {

}

export default {
    establishAuth,
    fetchCurrentUser
}