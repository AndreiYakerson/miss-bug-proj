
import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'


const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        pageIdx: req.query.pageIdx || undefined,
    }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Failed to get bugs', err)
            res.status(400).send('Failed to get bugs')
        })
})

app.post('/api/bug', (req, res) => {
    const bug = req.body
    // console.log(bug);
    
    const bugToSafe = {
        title: bug.title,
        severity: bug.severity,
        description: bug.description,
    }

    bugService.save(bugToSafe)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Failed to save bug', err)
            res.status(400).send('Failed to save bug')
        })
})

app.put('/api/bug', (req, res) => {
    const bug = req.body
    // console.log(bug);
    
    const bugToSafe = {
        _id: bug._id,
        title: bug.title,
        severity: bug.severity,
        description: bug.description,
    }

    bugService.save(bugToSafe)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Failed to save bug', err)
            res.status(400).send('Failed to save bug')
        })
})  

app.get('/api/bug/:bugId', (req, res) => {
    bugService.getById(req.params.bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Failed to get bug', err)
            res.status(400).send('Failed to get bug')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    bugService.remove(req.params.bugId)
        .then(() => res.send(`Bug with Id ${req.params.bugId} removed`))
        .catch(err => {
            loggerService.error('Failed to remove bug', err)
            res.status(400).send('Failed to remove bug')
        })
})


app.get('/cookies/:bugId', (req, res) => {
    const bugId = req.params.bugId
    let visitedBugs = req.cookies.visitedBugs || []
    _checkVisitedBugsLimit(bugId, visitedBugs, res)
})



const port = 3030
app.listen(port, () => loggerService.info(`Server is running on http://127.0.0.1:${port}/`))



function _checkVisitedBugsLimit(bugId, visitedBugs, res) {
    if (!visitedBugs.includes(bugId) && visitedBugs.length < 3) {
        visitedBugs.push(bugId)
        console.log(visitedBugs);

        res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
        return res.send(visitedBugs)
    }

    if (visitedBugs.length > 2 && !visitedBugs.includes(bugId)) {
        loggerService.error('User limit, 3 bugs reached')
        return res.status(401).send('Wait for a bit')
    }
}