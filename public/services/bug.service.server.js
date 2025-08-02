import { utilService } from './util.service.js'
import axios from '../lib/axios.js'

const URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getCookies,
}

function query(filterBy) {
    return axios.get(URL, { params: filterBy })
    .then(res => res.data)
}

function getById(bugId) {
    return axios.get(`${URL}/${bugId}`)
    .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(`${URL}/${bugId}`)
}

function save(bug) {
    let queryParams = `/save?title=${bug.title}&severity=${bug.severity}&description=${bug.description}`
    if (bug._id) queryParams += `&id=${bug._id}`

    return axios.get(`${URL}${queryParams}`)
    .then(res => res.data)
}


function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}

function getCookies(bugId) {
    return axios.get('/cookies/' + bugId)
    .then(res => res.data)
}