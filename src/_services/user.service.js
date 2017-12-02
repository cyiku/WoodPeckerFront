import {serverIP} from '../_helpers';

export const userService = {
    login,
    logout,
    login2
    //register,
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'username=' + username + '&password=' + password
    };
    console.log(requestOptions);
    return fetch(serverIP + '/login', requestOptions)
        .then(handleResponse);
}

function login2(data) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new FormData(data)
    };
    console.log(requestOptions);
    return fetch(serverIP + '/login', requestOptions)
        .then(handleResponse);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function handleResponse(response) {
    if (!response.ok) { 
        return Promise.reject(response.statusText);
    }
    return response.json();
}

/*
function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
    return fetch('/users/register', requestOptions).then(handleResponse);
}
*/