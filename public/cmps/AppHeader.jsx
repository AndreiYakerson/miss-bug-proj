const { NavLink, Link } = ReactRouterDOM
const { useNavigate } = ReactRouter

import { authService } from "../services/auth.service.js"

    const navigate = useNavigate()
    return <header className="app-header main-content single-row">
        <h1>Miss Bug</h1>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/bug">Bugs</NavLink>
            <NavLink to="/about">About</NavLink>
        </nav>
    </header>
}