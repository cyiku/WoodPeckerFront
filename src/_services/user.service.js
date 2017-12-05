import {serverIP} from '../_helpers';

export const userService = {
    login,
    logout,
    //register,
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8'},
        body: JSON.stringify({'username' : username , 'password': password})
    };
    console.log(requestOptions);
    return fetch(serverIP + '/auth', requestOptions)
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