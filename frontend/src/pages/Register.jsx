import {useState} from "react";
import {useNavigate} from "react-router-dom";
import './Register.css'
import getErrorMessage from '../utils/getErrorMessage'

function Register(){
    const [formData, setFormData] = useState({
        full_name: '',
        fccu_email: '',
        password: '',
        confirm_password: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

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
        setSuccess('')

        try{
            const response = await fetch(
                'http://127.0.0.1:8000/api/accounts/register/',
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

            setSuccess('Account successfully created! Redirecting to OTP verification...')

            setTimeout(() => {
                navigate('/verify-otp', {
                    state: {fccu_email: formData.fccu_email},
                })
            }, 1500)
        } catch(error){
            setError(error.message)
        } finally{
            setLoading(false)
        }
    }

    return(
        <>
            {success && (
                <div className="success-overlay" role="status">
                    <div className="success-modal">
                        <span className="success-icon">✓</span>
                        <h2>Account successfully created</h2>
                        <p>Redirecting to OTP verification...</p>
                    </div>
                </div>
            )}

            <div className="auth-page">
                <section className="auth-intro">
                    <p className="auth-eyebrow">JOIN THE FCCU COMMUNITY</p>
                    <h1>
                        <span>Create</span> an Account
                    </h1>
                    <p>
                        Register with your official Formanite email to report and recover
                        items across campus.
                    </p>
                </section>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="full_name">Full Name</label>
                        <input
                            id="full_name"
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />
                    </div>

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

                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="confirm_password">Confirm Password</label>
                            <input
                                id="confirm_password"
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                placeholder="Repeat your password"
                            />
                        </div>
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default Register
