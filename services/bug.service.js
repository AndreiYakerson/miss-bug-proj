
import { utilService } from "./util.service.js"

const PAGE_SIZE = 6
const bugs = utilService.readJsonFile('./data/bug.json')


export const bugService = {
    query,
    getById,
    remove,
    save,
    checkVisitedBugsLimit
}


function query(filterBy = {}) {
    let bugsToDisplay = bugs

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        
        bugsToDisplay = bugsToDisplay.filter(bug => {
            return regExp.test(bug.title) 
            || bug.labels.filter(label => regExp.test(label)).length
        })
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
    console.log('bug to save: ', bugToSave);
    
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

function checkVisitedBugsLimit(bugId, visitedBugs, res) {
    if (!visitedBugs.includes(bugId) && visitedBugs.length < 3) {
        visitedBugs.push(bugId)
        // console.log(visitedBugs);

        res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
        return res.send(visitedBugs)
    }

    if (visitedBugs.length > 2 && !visitedBugs.includes(bugId)) {
        loggerService.error('User limit, 3 bugs reached')
        return res.status(401).send('Wait for a bit')
    }
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)

    return _saveBugs()
}

function _saveBugs() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}

