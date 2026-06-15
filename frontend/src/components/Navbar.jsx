import {Link, useNavigate} from "react-router-dom";
import './Navbar.css'

function Navbar({theme, toggleTheme, isLoggedIn, setIsLoggedIn}){
    const navigate = useNavigate()

    async function handleLogout(){
        const token = localStorage.getItem('token')

        try{
            await fetch(
                'http://127.0.0.1:8000/api/accounts/logout/',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                },
            )
        } catch(error){
            console.log(error)
        } finally{
            localStorage.removeItem('token')
            localStorage.removeItem('full_name')
            localStorage.removeItem('email')
            setIsLoggedIn(false)
            navigate('/login')
        }
    }

    return(
        <nav className="navbar">
            <div className="navbar-inner">
                <Link className="navbar-brand" to="/">FCCU Lost & Found</Link>

                <div className="navbar-links">
                    <Link to="/">Home</Link>

                    {isLoggedIn ? (
                        <>
                            <Link to="/items">Browse Items</Link>
                            <Link to="/my-items">My Items</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>

                <div className="navbar-actions">
                    <button
                        className="navbar-theme-toggle"
                        type="button"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        <span className={theme === 'light' ? 'theme-option active' : 'theme-option'}>
                            ☀
                        </span>
                        <span className={theme === 'dark' ? 'theme-option active' : 'theme-option'}>
                            ☾
                        </span>
                    </button>

                    {isLoggedIn && (
                        <button
                            className="navbar-logout-button"
                            type="button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
