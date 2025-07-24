import { log } from 'console'
import express from 'express'
import { utilService } from './services/util.service.js'

const app = express()
// app.get('/', (req,res) => res.send('Hello there!'))
const bugs = utilService.readJsonFile('./data/bug.json')
console.log(bugs);


app.get('/api/bug', (req, res) => {
    bugService.query()
    .then(bugs => res.send(bugs))
})

// app.get('/api/bug/save', (req, res) => { })

app.get('/api/bug/:bugId', (req, res) => {
    res.send(bugs.find(bug => bug._id === req.params.bugId))
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const idx = bugs.findIndex(bug => bug._id === req.params.bugId)
    if (idx === -1) return res.status(404).send('Bug not found')
    bugs.slice(idx, 1)
    res.send(`Bug with Id ${req.params.bugId} removed successfully`)
})



const port = 3030
app.listen(port, () => console.log(`Server is running on http://127.0.0.1:${port}/`))