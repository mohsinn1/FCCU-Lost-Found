import { Link } from 'react-router-dom'
import './Navbar.css'


function Navbar({theme, toggleTheme}){
    return (
        <nav className='navbar'>
            <div className='navbar-inner'>

            <Link className='navbar-brand' to="/">FCCU Lost & Found</Link>

            <div className='navbar-links'> <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </div>

            <button className='navbar-theme-button' type="button" onClick={toggleTheme}>Switch theme to {theme === 'light' ? 'dark' :'light'}</button>

            </div>


        </nav>
    )
}

export default Navbar
