import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BuildingTitle from './BuildingTitle'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'concept', label: 'The Concept' },
  { id: 'hub', label: 'The Hub' },
  { id: 'models', label: 'Model Explorer' },
  { id: 'exchange', label: 'The Exchange' }
]

function Navigation({ activeTab, onTabChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isContactPage = location.pathname === '/contact'
  const isSignInPage = location.pathname === '/signin'
  const isSignUpPage = location.pathname === '/signup'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 pt-3">
      {/* Logo - Absolute top left */}
      <div style={{ position: 'absolute', top: '12px', left: '24px', zIndex: 51 }}>
        <BuildingTitle onClick={() => onTabChange('overview')} />
      </div>

      <div className="container">
        <div className="flex items-center justify-center h-14">
          {/* Desktop Tabs - Centered */}
          <div className="hidden md:block">
            <div className="tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`tab ${activeTab === tab.id && !isContactPage && !isSignInPage && !isSignUpPage ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
              <Link to="/contact" className={`tab contact-link ${isContactPage ? 'active' : ''}`}>
                Contact Us
              </Link>
              <Link to="/signin" className={`tab signin-link ${isSignInPage ? 'active' : ''}`}>
                Sign In
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-black/5"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id)
                  setIsMobileMenuOpen(false)
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id && !isContactPage && !isSignInPage && !isSignUpPage
                    ? 'bg-foreground text-background'
                    : 'hover:bg-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <Link 
              to="/contact" 
              className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                isContactPage
                  ? 'bg-foreground text-background'
                  : 'hover:bg-secondary'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link 
              to="/signin" 
              className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                isSignInPage
                  ? 'bg-foreground text-background'
                  : 'hover:bg-secondary'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
