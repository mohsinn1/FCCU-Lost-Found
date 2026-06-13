import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Register.css'

function VerifyOTP() {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.fccu_email || ''

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/accounts/verify-otp/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fccu_email: email,
            otp: otp,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(JSON.stringify(data))
      }

      setSuccess(data.message)

      setTimeout(() => {
        navigate('/login', {
          state: { fccu_email: email },
        })
      }, 1500)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResendLoading(true)
    setResendMessage('')
    setResendError('')

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/accounts/resend-otp/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fccu_email: email,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(JSON.stringify(data))
      }

      setResendMessage(data.message)
    } catch (error) {
      setResendError(error.message)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <>
      {success && (
        <div className="success-overlay" role="status">
          <div className="success-modal">
            <span className="success-icon">✓</span>
            <h2>Account verified successfully</h2>
            <p>Redirecting to login...</p>
          </div>
        </div>
      )}

      <div className="auth-page">
        <section className="auth-intro">
          <p className="auth-eyebrow">VERIFY YOUR FCCU EMAIL</p>
          <h1>
            <span>OTP</span> Verification
          </h1>
          <p>
            Enter the verification code to confirm your FCCU email and activate
            your account.
          </p>
        </section>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="otp-form-heading">
            <h2>Enter Your OTP</h2>
            <p>
              We have sent a 6-digit OTP to the email <br/>
              <span className="email-highlight">{email}</span>
            </p>
          </div>

          <div className="form-field">
            <div className="otp-input-group">
              <input
                className="otp-hidden-input"
                id="otp"
                type="text"
                value={otp}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, '')
                  setOtp(value)
                }}
                maxLength="6"
                inputMode="numeric"
                autoComplete="one-time-code"
              />

              {[0, 1, 2, 3, 4, 5].map((index) => (
                <span
                  className={`otp-box ${
                    index < otp.length || index === otp.length
                      ? 'otp-box-active'
                      : ''
                  }`}
                  key={index}
                >
                  {otp[index] || ''}
                </span>
              ))}
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify account'}
          </button>

          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button
              className="resend-button"
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>

          {resendMessage && <p className="resend-success">{resendMessage}</p>}
          {resendError && <p className="form-error">{resendError}</p>}
        </form>
      </div>
    </>
  )
}



export default VerifyOTP
