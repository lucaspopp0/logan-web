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
    idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ4ZWZlYTFmNjZlODdiYjM2YzJlYTA5ZDgzNzMzOGJkZDgxMDM1M2IiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjYxMTMyNjE4OTg1LW00ZWI5aHV1cW9zZmRkaWJnMTdqZ201MGQ2OWcwa2kzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjYxMTMyNjE4OTg1LW00ZWI5aHV1cW9zZmRkaWJnMTdqZ201MGQ2OWcwa2kzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAxNjI2MDYyNjUxNzI2NDAwMzk4IiwiaGQiOiJjYXNlLmVkdSIsImVtYWlsIjoibG1wMTIyQGNhc2UuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ5RVlKNjcwNHdDQld4QlZjcjFTcnBBIiwibmFtZSI6Ikx1Y2FzIFBvcHAiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FBdUU3bUMzZnNrSWtKMkNTbEZ2RjUyVXBjdHg3YjFtY0tIY181Y28zQzNyQ0E9czk2LWMiLCJnaXZlbl9uYW1lIjoiTHVjYXMiLCJmYW1pbHlfbmFtZSI6IlBvcHAiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU4MTM1MTExOSwiZXhwIjoxNTgxMzU0NzE5LCJqdGkiOiIyZmYzMjI0NzhhN2ExNGQ4NjZjMjY3Zjg1NjQ4MTJjMmE3YWQ1NzRlIn0.PuRqo7S2aZJ9XLF6yBVmUg_hTRMRdmGJ6BF_a-tM3r1lWKWgR1ty9733REh9Ti0ewCOgge-HPKwRhqLmJ68jiq8IUyKt27fB23kDtyMt_u-Uzx6PGiDg2Ed5Mw6nki1kgN06xvquaIyzx1NSes4yJPZGoY7LB-pCM69cVVzHBQbNQy76be-Qm9ykm3xNMcTQXKzHTPv-V4i-JeHvty7ERX7ZbrHvIKwAEwmFaxeVSO_yF7f3nRfAA5H2mLc9u_UYkyg3Rzn1UeyvQV3Li7OQJlV2Elp9tfJ1wYhzwh8VBmPPbpVpbuyZcOjpsXf13efFNKPjmuYvVtozTho4ys9m6w';
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