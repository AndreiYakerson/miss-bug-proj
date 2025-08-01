
import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'


const app = express()
app.use(express.static('public'))
app.use(cookieParser())


app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Failed to get bugs', err)
            res.status(400).send('Failed to get bugs')
        })
})

app.get('/api/bug/save', (req, res) => {
    const queryParams = req.query

    const bugToSafe = {
        title: queryParams.title,
        severity: queryParams.severity,
        description: queryParams.description,
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

app.get('/api/bug/:bugId/remove', (req, res) => {
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