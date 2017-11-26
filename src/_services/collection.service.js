import {serverIP} from '../_helpers';

export const collectionService = {
    getCollection,
    addCollection,
    delCollection,
};

function getCollection(user, type) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'id': user.id, 'token': user.token, 'type': type})
    };
    console.log(requestOptions.body);
    return fetch(serverIP + '/getCollection', requestOptions).then(handleResponse)
}

function addCollection(user, collection, type) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({ 'id': user.id, 'token': user.token, 'data': collection, 'type': type})
    };
    console.log(requestOptions.body);
    return fetch(serverIP + '/addCollection', requestOptions).then(handleResponse)
}

function delCollection(user, id, type) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({ 'id': user.id, 'token': user.token, 'dataid': id, 'type': type})
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