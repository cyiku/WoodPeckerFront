import {serverIP} from '../_helpers';

export const collectionService = {
    getCollection,
    addCollection,
    delCollection,
};

function getCollection(user, type) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + user.token },
        body: JSON.stringify({'type': type})
    };
    console.log(requestOptions.body);
    return fetch(serverIP + '/getCollection', requestOptions).then(handleResponse)
}

function addCollection(user, collection, type) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + user.token },
        body: JSON.stringify({ 'data': collection, 'type': type})
    };
    console.log(requestOptions.body);
    return fetch(serverIP + '/addCollection', requestOptions).then(handleResponse)
}

function delCollection(user, id, type) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + user.token },
        body: JSON.stringify({ 'dataid': id, 'type': type})
    };
    console.log(requestOptions.body);
    return fetch(serverIP+'/delCollection', requestOptions).then(handleResponse)
}

function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }
    return response.json();
}