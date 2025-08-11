export function BugPreview({bug}) {
    return <article className="bug-preview">
        <p className="title">{bug.title}</p>
        <p>Creator: {bug.creator.fullname}</p>
        <p>Severity: <span>{bug.severity}</span></p>
    </article>
}