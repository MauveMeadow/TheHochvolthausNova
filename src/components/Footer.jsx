import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'

function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.content}>
          {/* Left side - Description */}
          <div style={styles.descriptionSection}>
            <h3 style={styles.title}>Hochvolthaus Nova</h3>
            <p style={styles.description}>
              An innovative research project showcasing sustainable building technologies 
              and smart energy solutions at TUM Campus in Munich.
            </p>
          </div>

          {/* Right side - Contact Info */}
          <div style={styles.contactSection}>
            <div style={styles.contactItem}>
              <Mail size={18} style={styles.icon} />
              <a href="mailto:fusionlab500@gmail.com" style={styles.contactLink}>
                fusionlab500@gmail.com
              </a>
            </div>
            <div style={styles.contactItem}>
              <Phone size={18} style={styles.icon} />
              <a href="tel:+4900000000" style={styles.contactLink}>
                +49 (0) 0000000
              </a>
            </div>
            <Link to="/contact" style={styles.contactUsLink}>
              Contact Us →
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Copyright */}
        <p style={styles.copyright}>
          © 2025 Hochvolthaus Nova. All rights reserved. Part of TUM Fusion Lab.
        </p>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    backgroundColor: '#1d1d1f',
    color: '#ffffff',
    padding: '48px 0 24px 0',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '32px',
  },
  descriptionSection: {
    flex: '1 1 300px',
    maxWidth: '400px',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#ffffff',
  },
  description: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
  },
  contactSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  contactLink: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
  },
  contactUsLink: {
    display: 'inline-block',
    marginTop: '8px',
    color: '#007AFF',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '32px 0 24px 0',
  },
  copyright: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    textAlign: 'center',
  },
}

export default Footer
