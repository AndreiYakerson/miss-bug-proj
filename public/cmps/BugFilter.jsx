const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortDir, setSortDir] = useState(null)


    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit, sortBy])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    function handleSort({ target }) {
        setSortBy(target.value)
        setFilterByToEdit(prevFilter => ({ ...prevFilter, sortBy: target.value }))
    }

    function handleSortDir({ target }) {
        const newSortDir = target.checked ? -1 : 1
        setSortDir(newSortDir)
        setFilterByToEdit(prevFilter => ({ ...prevFilter, sortDir: newSortDir }))
    }

    const { txt, minSeverity } = filterByToEdit


    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />


                <label htmlFor="sortBy">Sort By: </label>
                <select defaultValue={sortBy} onChange={handleSort}>
                    <option value="title">Title</option>
                    <option value="createdAt">Created at</option>
                    <option value="severity">Severity</option>
                </select>

                <label htmlFor="sortDir">{sortDir === -1 ? '⬆️' : '⬇️'}</label>
                <input id="sortDir" type="checkbox" hidden onChange={handleSortDir} />

            </form>
        </section>
    )
}