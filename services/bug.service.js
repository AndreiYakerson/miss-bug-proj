
import { utilService } from "./util.service.js"

const bugs = utilService.readJsonFile('./data/bug.json')
// console.log(bugs)

export const bugService = {
    query,
    getById,
    remove
}




function query() {
    return Promise.resolve(bugs)
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

function _saveBugs () {
   return utilService.writeJsonFile('./data/bug.json', bugs)
}