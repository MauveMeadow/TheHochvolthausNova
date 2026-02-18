import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navigation from './Navigation'

function Contact() {
  const navigate = useNavigate()
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Team members data with LinkedIn profile links
  const teamMembers = [
    { name: 'Samin Eghbali', linkedin: 'https://www.linkedin.com/in/samin-eghbali/' },
    { name: 'Mays Alsheikh', linkedin: 'https://www.linkedin.com/in/maysalsheikh/' },
    { name: 'Rafael Rodrigues', linkedin: 'https://www.linkedin.com/in/rafael-rodrigues/' },
    { name: 'Chandana Mahesh', linkedin: 'https://www.linkedin.com/in/chandanam2907/' },
    { name: 'Tianzhuo Wang', linkedin: 'https://www.linkedin.com/in/tianzhuo-wang/' },
    { name: 'Antonia-Ioulia Pozatzidou', linkedin: 'https://www.linkedin.com/in/antonia-ioulia-pozatzidou/' },
  ]

  const handleTabChange = (tabId) => {
    navigate('/', { state: { scrollTo: tabId } })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitStatus(null), 5000)
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus(null), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navigation activeTab="" onTabChange={handleTabChange} />
      <div className="min-h-screen pb-20" style={{ paddingTop: '160px' }}>
        <div className="container">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
          style={{ marginTop: '40px' }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Team</h1>
        </motion.div>

        {/* Team Members Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              {/* Circular Profile Container */}
              <div 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#f0f0f0',
                  border: '3px solid #001960',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  overflow: 'hidden',
                }}
              >
                {/* Placeholder - initials */}
                <span style={{ 
                  fontSize: '32px', 
                  fontWeight: '600', 
                  color: '#001960' 
                }}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              {/* Name */}
              <h3 style={{ 
                fontSize: '0.9375rem', 
                fontWeight: '500', 
                marginBottom: '8px',
                color: '#1d1d1f',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
              }}>
                {member.name}
              </h3>
              
              {/* LinkedIn Icon */}
              <a 
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1.5px solid #666',
                  backgroundColor: 'transparent',
                  color: '#666',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)'
                  e.currentTarget.style.borderColor = '#1d1d1f'
                  e.currentTarget.style.color = '#1d1d1f'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.borderColor = '#666'
                  e.currentTarget.style.color = '#666'
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            marginTop: '60px',
            padding: '40px',
            backgroundColor: '#f9f9f9',
            borderRadius: '16px',
          }}
        >
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '600', 
            marginBottom: '8px',
            textAlign: 'center',
            color: '#1d1d1f'
          }}>
            Send Us a Message
          </h2>
          <p style={{ 
            fontSize: '0.95rem', 
            color: '#666',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            Have questions or feedback? We'd love to hear from you.
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            
            <div>
              <label htmlFor="message" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Your message..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {submitStatus === 'success' && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '8px',
                color: '#155724',
                fontSize: '0.9rem'
              }}>
                Thank you! Your message has been sent successfully.
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '8px',
                color: '#721c24',
                fontSize: '0.9rem'
              }}>
                Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 24px',
                backgroundColor: '#001960',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              <Send size={18} />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>

      </div>
    </div>
    </>
  )
}

export default Contact
