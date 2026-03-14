import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './userContext.jsx';

export default function Layout() {

    const { loggedIn, logout } = useContext(UserContext)

    //const loggedIn = localStorage.getItem("token");
    const navigate = useNavigate();
    function getYear() {
        const year = new Date().getFullYear();
        return year;
    }

    function handleLogout() {
        logout();
        navigate("/");
    }


    return (
        <>
            <header>
                <Link to="/" className="link">Landing Page</Link>
                {/* <Link to="/new-entry" className="link">New Entry</Link> */}
                {!loggedIn && <Link to="/login" className="link" id="login">Login</Link>}
                {loggedIn && <button id="logout" onClick={handleLogout}>Logout</button>}
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                FreshCheck &copy; {getYear()}
            </footer>
        </>

    )
}