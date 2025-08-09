const { Link } = ReactRouterDOM
const { Fragment } = React

import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug, loggedInUser }) {

    function canEdit(bug) {
        if (loggedInUser) {
            if (loggedInUser.isAdmin) return true
            if (loggedInUser._id === bug.creator._id) return true
        }
        return false
    }

    if (!bugs) return <div>Loading...</div>
    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <button><Link to={`/bug/${bug._id}`}>Details</Link></button>

                    {
                    canEdit(bug) &&
                        <Fragment>
                            <button onClick={() => onEditBug(bug)}>Edit</button>
                            <button onClick={() => onRemoveBug(bug._id)}>x</button>
                        </Fragment>
                    }
                </section>
            </li>
        ))}
    </ul >
}
