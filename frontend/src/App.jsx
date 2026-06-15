import './App.css'
import {useEffect, useState} from "react";
import {Route, Routes} from "react-router-dom";
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOTP from './pages/VerifyOTP'
import Items from './pages/Items'
import ItemDetails from './pages/ItemDetails.jsx'
import AddItem from './pages/AddItem'
import MyItems from './pages/MyItems'
import EditItem from './pages/EditItem'
import ProtectedRoute from './utils/ProtectedRoute'

function App(){
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')))
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme')

        if (savedTheme){
            return savedTheme
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    })

    function toggleTheme(){
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    return(
        <>
            <Navbar
                theme={theme}
                toggleTheme={toggleTheme}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
            />

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/items" element={<Items />} />
                    <Route path = "/items/:id" element={<ItemDetails/>}/>
                    <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
                    <Route path="/my-items" element={<ProtectedRoute><MyItems /></ProtectedRoute>} />
                    <Route path="/items/:id/edit" element={<ProtectedRoute><EditItem /></ProtectedRoute>} />
                </Routes>
            </main>
        </>
    )
}

export default App
