import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Project Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Project</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/">The Concept</Link></li>
              <li><Link to="/">The Hub</Link></li>
              <li><Link to="/">Models 3D</Link></li>
              <li><Link to="/">The Exchange</Link></li>
              <li><Link to="/location-map">Location Map</Link></li>
              <li><Link to="/building-timeline">Building Timeline</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><Link to="/analysis">Analysis Viewer</Link></li>
              <li><Link to="/forma-analysis">Forma Analysis</Link></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Documentation</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">3D Models</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">IFC Files</a></li>
            </ul>
          </div>

          {/* Community Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Community</h4>
            <ul className="footer-links">
              <li><Link to="/get-involved">Get Involved</Link></li>
              <li><Link to="/reservations">Room Reservation</Link></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Events</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Workshops</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Contribute</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Help Center</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">FAQ</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Report Issue</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Feedback</a></li>
            </ul>
          </div>

          {/* About Column */}
          <div className="footer-column">
            <h4 className="footer-heading">About</h4>
            <ul className="footer-links">
              <li><a href="#" target="_blank" rel="noopener noreferrer">About Us</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Terms of Service</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Sitemap</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Careers</a></li>
            </ul>
          </div>

          {/* Company Description */}
          <div className="footer-info">
            <h3 className="footer-title">Hochvolthaus Nova</h3>
            <p className="footer-description">
              Hochvolthaus Nova is an innovative research and demonstration project showcasing sustainable building technologies and smart energy solutions. We combine architecture, advanced analytics, and community engagement to create a modern learning space at TUM Campus in Munich, pioneering the future of high-performance, energy-efficient buildings.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <p className="footer-copyright">
            © 2025 Hochvolthaus Nova. All rights reserved. Part of TUM Fusion Lab.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
