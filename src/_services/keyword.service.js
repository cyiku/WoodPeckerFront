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
        headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + user.token},
        body: JSON.stringify({'token': user.token})
    };
    console.log(requestOptions);
    return fetch(serverIP + '/getKws', requestOptions).then(handleResponse)
}

function addKws(user, newkeyword) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + user.token},
        body: JSON.stringify({'name': newkeyword.name,  'sites': newkeyword.sites})
    };
    return fetch(serverIP + '/addKws', requestOptions).then(handleResponse)
}

function delKws(user, keyword, index) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + user.token},
        body: JSON.stringify({'name': keyword[index].name})
    };
    return fetch(serverIP+'/delKws', requestOptions).then(handleResponse)
}

function updKws(user, newkeyword, keywordid){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + user.token },
        body: JSON.stringify({'name': newkeyword.name, 'sites': newkeyword.sites, 'keywordid':keywordid})
    };
    return fetch(serverIP+'/updKws', requestOptions).then(handleResponse)
}

function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }
    return response.json();
}