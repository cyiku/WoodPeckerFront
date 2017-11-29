import {serverIP} from '../_helpers';

export const keywordService = {
    getKws,
    addKws,
    delKws,
    updKws
};

function getKws(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'id': user.id, 'token': user.token })
    };
    return fetch(serverIP + '/getKws', requestOptions).then(handleResponse)
}

function addKws(user, newkeyword) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({ 'id': user.id, 'token': user.token, 'name': newkeyword.name,  'sites': newkeyword.sites})
    };
    return fetch(serverIP + '/addKws', requestOptions).then(handleResponse)
}

function delKws(user, keyword, index) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({ 'id': user.id, 'token': user.token, 'name': keyword[index].name})
    };
    return fetch(serverIP+'/delKws', requestOptions).then(handleResponse)
}

function updKws(user, newkeyword, keywordid){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({ 'id': user.id, 'token': user.token, 'name': newkeyword.name, 'sites': newkeyword.sites, 'keywordid':keywordid})
    };
    return fetch(serverIP+'/updKws', requestOptions).then(handleResponse)
}

function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }
    return response.json();
}