import React from 'react'
import tumLogo from '../../tum-logo.png'

/**
 * BuildingTitle Component
 * Displays TUM logo alongside "Hochvolthaus Nova" text
 * @param {string} variant - 'dark' or 'light' for different backgrounds
 */
function BuildingTitle({ variant = 'dark', onClick }) {
  const textColor = variant === 'light' ? '#ffffff' : '#0065BD'
  const logoColor = '#0065BD'

  return (
    <button 
      onClick={onClick}
      className="building-title-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.25rem',
      }}
    >
      {/* TUM Logo (PNG) */}
      <img
        src={tumLogo}
        alt="TUM Logo"
        style={{ height: 40, width: 'auto', display: 'block' }}
      />

      {/* Building Name */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          lineHeight: 1.1,
        }}
      >
        <span 
          style={{
            fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: '1.25rem',
            fontWeight: 600,
            color: textColor,
            letterSpacing: '-0.01em',
          }}
        >
          Hochvolthaus
        </span>
        <span 
          style={{
            fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: '1.25rem',
            fontWeight: 800,
            color: textColor,
            letterSpacing: '-0.01em',
          }}
        >
          Nova
        </span>
      </div>
    </button>
  )
}

export default BuildingTitle
