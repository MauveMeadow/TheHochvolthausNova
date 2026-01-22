import { motion } from 'framer-motion'
import { Mail, Linkedin, User } from 'lucide-react'

const teamMembers = [
  {
    name: 'Mays Alsheikh',
    role: "ITBE Master's Student",
    email: 'mays.alsheikh@tum.de',
    linkedin: 'https://www.linkedin.com/in/mays-alsheikh'
  },
  {
    name: 'Samin Eghbali',
    role: "ITBE Master's Student",
    email: 'samin.eghbali@tum.de',
    linkedin: 'https://www.linkedin.com/in/samin-eghbali'
  },
  {
    name: 'Rafael Rodrigues Giglio',
    role: "ITBE Master's Student",
    email: 'rafael.giglio@tum.de',
    linkedin: 'https://www.linkedin.com/in/rafael-giglio'
  },
  {
    name: 'Tianzhuo Wang',
    role: "ITBE Master's Student",
    email: 'tianzhuo.wang@tum.de',
    linkedin: 'https://www.linkedin.com'
  },
  {
    name: 'Chandana Mahesh',
    role: "ITBE Master's Student",
    email: 'chandana.mahesh@tum.de',
    linkedin: 'https://www.linkedin.com/in/chandana-mahesh'
  },
  {
    name: 'Antonia-Ioulia Pozatzidou',
    role: "ITBE Master's Student",
    email: 'antonia.pozatzidou@tum.de',
    linkedin: 'https://www.linkedin.com/in/antonia-pozatzidou'
  }
]

function TheMinds() {
  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4">
            Meet the Team
          </p>
          <h1 className="mb-6">The Minds</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ITBE Master's students at the Technical University of Munich working on 
            the Fusion Lab course, reimagining the future of the Hochvolthaus.
          </p>
        </div>

        {/* Team Grid */}
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.email}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="team-member card"
            >
              <div className="team-member-avatar">
                <User size={64} />
              </div>
              <h3>{member.name}</h3>
              <div className="role">{member.role}</div>
              <div className="team-member-links">
                <a 
                  href={`mailto:${member.email}`}
                  className="social-link"
                  title="Email"
                >
                  <Mail size={18} />
                </a>
                <a 
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  title="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Course Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 bg-primary text-white rounded-2xl p-8 lg:p-12 text-center"
        >
          <h2 className="mb-4">Fusion Lab Course</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            This project is part of the Fusion Lab course at TUM, where ITBE students 
            explore innovative approaches to architectural redesign, combining technical 
            expertise with creative vision for sustainable building transformation.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm">
            <div>
              <div className="font-medium mb-1">Course</div>
              <div className="opacity-80">Fusion Lab</div>
            </div>
            <div className="hidden sm:block w-px bg-white/20"></div>
            <div>
              <div className="font-medium mb-1">Program</div>
              <div className="opacity-80">Masters ITBE</div>
            </div>
            <div className="hidden sm:block w-px bg-white/20"></div>
            <div>
              <div className="font-medium mb-1">University</div>
              <div className="opacity-80">TU München</div>
            </div>
            <div className="hidden sm:block w-px bg-white/20"></div>
            <div>
              <div className="font-medium mb-1">Year</div>
              <div className="opacity-80">2025-2026</div>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              For more information about the project
            </p>
            <a 
              href="mailto:info@fusionlab.tum.de" 
              className="text-primary hover:underline"
            >
              info@fusionlab.tum.de
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TheMinds
