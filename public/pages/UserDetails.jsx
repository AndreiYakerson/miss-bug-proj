const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

import { userService } from "../services/user.service.js"

export function UserDetails() {

    const [user, setUser] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    function loadUser() {
        //TODO Where are from params?

        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    if (!user) return <div>Loading...</div>

    return <section className="user-details">
        <h1>User {user.fullname}</h1>
        <pre>
            {/* {JSON.stringify(user, null, 2)} */}
            <ul>
                <li>User name: {user.username}</li>
                <li>Full name: {user.fullname}</li>
                <li>User ID: {user._id}</li>
            </ul>
        </pre>
        {/* <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim rem accusantium, itaque ut voluptates quo? Vitae animi maiores nisi, assumenda molestias odit provident quaerat accusamus, reprehenderit impedit, possimus est ad?</p> */}
        <Link to="/">Back Home</Link>
    </section>
}