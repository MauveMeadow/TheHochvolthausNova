import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log('Sign up:', { email, password })
  }

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <h2>Sign Up</h2>
        <p className="auth-subtitle">Create your Hochvolthaus Nova account</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary auth-btn">
            Sign Up
          </button>
        </form>
        
        <p className="auth-link">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default SignUp
