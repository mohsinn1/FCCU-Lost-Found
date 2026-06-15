import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import './Register.css'
import getErrorMessage from '../utils/getErrorMessage'

function Login({setIsLoggedIn}){
    const location = useLocation()
    const navigate = useNavigate()
    const verifiedEmail = location.state?.fccu_email || ''
    const [formData, setFormData] = useState({
        fccu_email: verifiedEmail,
        password: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(event){
        const {name, value} = event.target

        setFormData({
            ...formData,
            [name]: value,
        })
    }

    async function handleSubmit(event){
        event.preventDefault()
        setLoading(true)
        setError('')

        try{
            const response = await fetch(
                'http://127.0.0.1:8000/api/accounts/login/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                },
            )

            const data = await response.json()

            if (!response.ok){
                throw new Error(getErrorMessage(data))
            }

            localStorage.setItem('token', data.token)
            localStorage.setItem('full_name', data.full_name)
            localStorage.setItem('email', data.email)
            setIsLoggedIn(true)
            navigate('/items')
        } catch(error){
            setError(error.message)
        } finally{
            setLoading(false)
        }
    }

    return(
        <div className="auth-page">
            <section className="auth-intro">
                <p className="auth-eyebrow">WELCOME BACK</p>
                <h1>
                    <span>Log In</span> to Your Account
                </h1>
                <p>
                    Access your account to report items, manage your posts, and help
                    reconnect lost belongings with their owners.
                </p>
            </section>

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="fccu_email">FCCU Email</label>
                    <input
                        id="fccu_email"
                        type="email"
                        name="fccu_email"
                        value={formData.fccu_email}
                        onChange={handleChange}
                        placeholder="123456@formanite.fccollege.edu.pk"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                    />
                </div>

                {error && <p className="form-error">{error}</p>}

                <button className="auth-submit" type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
        </div>
    )
}

export default Login
