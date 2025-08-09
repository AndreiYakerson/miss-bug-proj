
import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'


const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


app.get('/api/bug', (req, res) => {

    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        pageIdx: req.query.pageIdx || undefined,

        sortBy: req.query.sortBy || '',
        sortDir: req.query.sortDir || 1,
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


    const bugToSafe = {
        title: bug.title,
        severity: bug.severity,
        description: bug.description,
        labels: bug.labels,
        creator: {
            _id: bug.creator._id,
            fullname: bug.creator.fullname
        }
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
        creator: {
            _id: bug.creator._id,
            fullname: bug.creator.fullname
        }
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
    bugService.checkVisitedBugsLimit(bugId, visitedBugs, res)
})

// User API
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))

})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

// Auth API
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    authService.checkLogin(credentials)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(() => res.status(404).send('Invalid Credentials'))
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    // console.log(credentials);


    userService.add(credentials)
        .then(user => {

            if (user) {
                const loginToken = authService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
        .catch(err => res.status(400).send('Username taken.'))
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})



const port = 3030
app.listen(port, () => loggerService.info(`Server is running on http://127.0.0.1:${port}/`))



