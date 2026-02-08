import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'

function EventRegistration({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    interests: []
  })
  const [submitted, setSubmitted] = useState(false)

  const interests = [
    'Energy Storage',
    'Smart Buildings',
    'Sustainable Materials',
    'IoT & Sensors',
    'Innovation Events',
    'All Projects'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Save registration data to localStorage
    const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]')
    registrations.push({
      ...formData,
      registeredAt: new Date().toISOString()
    })
    localStorage.setItem('eventRegistrations', JSON.stringify(registrations))
    
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', studentId: '', email: '', interests: [] })
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Join Our Community</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-bold mb-2">Registration Successful!</h3>
              <p className="text-muted-foreground">
                Thank you for registering. We'll keep you updated on upcoming events and research opportunities.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., John Smith"
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-sm font-semibold mb-2">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g., TUM12345678"
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@tum.de"
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-semibold mb-3">Areas of Interest</label>
                <div className="grid grid-cols-2 gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.interests.includes(interest)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {formData.interests.includes(interest) && <span className="mr-1">✓ </span>}
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!formData.name || !formData.studentId || !formData.email}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Register Now
              </button>

              <p className="text-xs text-muted-foreground text-center">
                By registering, you agree to receive updates about events and research opportunities.
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default EventRegistration
