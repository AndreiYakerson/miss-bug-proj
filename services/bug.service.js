
import { utilService } from "./util.service.js"


const bugs = utilService.readJsonFile('./data/bug.json')
// console.log(bugs)

export const bugService = {
    query,
    getById,
    remove,
    save
}




function query() {
    return Promise.resolve(bugs)
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugs.push(bugToSave)
    }
    return _saveBugs()
        .then(() => bugToSave)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)

    return _saveBugs()
}

function _saveBugs() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}