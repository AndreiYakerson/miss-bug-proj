
import { utilService } from "./util.service.js"

const PAGE_SIZE = 6
const bugs = utilService.readJsonFile('./data/bug.json')
// console.log(bugs)

export const bugService = {
    query,
    getById,
    remove,
    save
}


function query(filterBy = {}) {
    let bugsToDisplay = bugs
    // console.log('This', filterBy);


    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
    }


    const sortBy = filterBy.sortBy
    const sortDir = filterBy.sortDir
    // console.log(sortDir);
    
    bugsToDisplay = bugsToDisplay.sort((bug1, bug2) => {
        if (sortBy === 'title') return (bug1.title.localeCompare(bug2.title)) * sortDir
        if (sortBy === 'severity') return (bug1.severity - bug2.severity) * sortDir
        if (sortBy === 'createdAt') return (bug1.createdAt - bug2.createdAt) * sortDir
        return 0
    })


    return Promise.resolve(bugsToDisplay)
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