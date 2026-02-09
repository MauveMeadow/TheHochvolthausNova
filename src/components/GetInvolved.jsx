import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, User, Hash, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function GetInvolved() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    idNumber: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.idNumber.trim()) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus(null), 5000)
      return
    }

    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success')
      setFormData({ name: '', email: '', idNumber: '' })
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 5000)
    }, 1500)
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/" className="btn btn-secondary mb-8 w-fit inline-flex items-center gap-2">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Involved</h1>
            <p className="text-lg text-gray-600">
              Join us in the Hochvolthaus Nova project and be part of something extraordinary.
              Fill in your details below and we'll be in touch soon.
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card shadow-lg"
          >
            {submitStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                  className="inline-block"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-3 text-primary">Thank You!</h2>
                <p className="text-gray-600 mb-6">
                  Your information has been submitted successfully. We'll contact you soon with more details about the Hochvolthaus Nova project.
                </p>
                <Link to="/" className="btn btn-primary">
                  Return to Home
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      required
                    />
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      required
                    />
                  </div>
                </motion.div>

                {/* ID Number Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    ID Number / Student ID *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      placeholder="Enter your ID or student number"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      required
                    />
                  </div>
                </motion.div>

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                  >
                    Please fill in all the required fields.
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn btn-primary text-lg"
                  style={{
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </motion.button>

                {/* Info Text */}
                <p className="text-xs text-center text-muted-foreground">
                  We respect your privacy. Your information will be used only for project-related communications.
                </p>
              </form>
            )}
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <div className="text-center p-6 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="font-bold text-primary mb-2">What's Next?</h3>
              <p className="text-sm text-gray-600">
                After submission, we'll review your application and contact you with opportunities.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-green-50 border border-green-200">
              <h3 className="font-bold text-primary mb-2">Join Our Team</h3>
              <p className="text-sm text-gray-600">
                Become part of an innovative project bringing sustainable architecture to life.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-purple-50 border border-purple-200">
              <h3 className="font-bold text-primary mb-2">Learn & Grow</h3>
              <p className="text-sm text-gray-600">
                Gain hands-on experience with cutting-edge building technologies.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default GetInvolved
