import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import BuildingTitle from './BuildingTitle'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'concept', label: 'The Concept' },
  { id: 'hub', label: 'The Hub' },
  { id: 'models', label: 'Model Explorer' }
]

function Navigation({ activeTab, onTabChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div className="container">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <BuildingTitle onClick={() => onTabChange('overview')} />

          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <div className="tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
              <Link to="/reservations" className="tab reservations-link">
                Reservations
              </Link>
              <Link to="/contact" className="tab contact-link">
                Contact
              </Link>
              <Link to="/signin" className="btn btn-primary signin-btn">
                Sign In
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
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
                  activeTab === tab.id
                    ? 'bg-foreground text-background'
                    : 'hover:bg-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <Link 
              to="/reservations" 
              className="block w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Reservations
            </Link>
            <Link 
              to="/contact" 
              className="block w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/signin" 
              className="block w-full text-center mt-4 btn btn-primary"
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
