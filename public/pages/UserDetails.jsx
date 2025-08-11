const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

import { bugService } from "../services/bug.service.server.js"
import { userService } from "../services/user.service.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugList } from "../cmps/BugList.jsx"

export function UserDetails() {
    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState([])

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        loadUserBugs()

    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    function loadUserBugs() {
        bugService.query({ userId: params.userId })
            .then(res => setUserBugs(res))
            .catch(err => console.log('err:', err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const bugToSave = { ...bug, severity }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = userBugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setUserBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = userBugs.filter(bug => bug._id !== bugId)
                setUserBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    if (!user) return <div>Loading...</div>

    return <section className="user-details">
        <h1> {user.isAdmin ? 'Admin' : 'User'} {user.fullname}</h1>

        <ul>
            <li>User name: {user.username}</li>
            <li>Full name: {user.fullname}</li>
            <li>User ID: {user._id}</li>
        </ul>

        

        <BugList
            bugs={userBugs}
            onRemoveBug={onRemoveBug}
            onEditBug={onEditBug}
            loggedInUser={user} />

        <button><Link to="/bug">Back to list</Link></button>
    </section>
}