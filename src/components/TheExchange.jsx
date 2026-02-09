import { motion } from 'framer-motion'
import { Briefcase, Megaphone, Users, TrendingUp, Zap, Brain, Leaf, Radio, Calendar, Lightbulb, Shield, Share2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TheExchange() {
  const navigate = useNavigate()
  const [activeResearchTab, setActiveResearchTab] = useState(0)
  const [activeBulletinTab, setActiveBulletinTab] = useState(0)
  const researchProjects = [
    {
      id: 1,
      title: 'Advanced Energy Storage Systems',
      lab: 'TUM Fusion Lab',
      status: 'In Progress',
      description: 'Developing next-generation battery technology for sustainable energy storage.',
      team: '8 researchers',
      image: '🔋'
    },
    {
      id: 2,
      title: 'AI-Driven Building Management',
      lab: 'Smart Systems Lab',
      status: 'In Progress',
      description: 'Intelligent automation systems for optimizing building operations.',
      team: '6 researchers',
      image: '🤖'
    },
    {
      id: 3,
      title: 'Sustainable Materials Research',
      lab: 'Materials Innovation Lab',
      status: 'In Progress',
      description: 'Creating eco-friendly building materials with enhanced performance.',
      team: '5 researchers',
      image: '🌱'
    },
    {
      id: 4,
      title: 'IoT Sensor Network Integration',
      lab: 'Connected Spaces Lab',
      status: 'In Progress',
      description: 'Building comprehensive IoT infrastructure for real-time monitoring.',
      team: '7 researchers',
      image: '📡'
    }
  ]

  const bulletinItems = [
    {
      id: 1,
      title: 'Monthly Lab Showcase - February 2026',
      date: 'Feb 15, 2026',
      time: '14:00 - 16:00',
      location: 'Main Atrium',
      type: 'Event',
      description: 'Join us for an interactive presentation of ongoing research projects across all labs.'
    },
    {
      id: 2,
      title: 'Innovation Forum: Future of Smart Buildings',
      date: 'Feb 22, 2026',
      time: '16:00 - 18:00',
      location: 'Conference Room 3',
      type: 'Workshop',
      description: 'Panel discussion with industry experts on emerging trends in building technology.'
    },
    {
      id: 3,
      title: 'New Equipment: Advanced Testing Laboratory',
      date: 'Feb 18, 2026',
      location: 'Level 4',
      type: 'Announcement',
      description: 'New state-of-the-art testing equipment now available for research projects.'
    },
    {
      id: 4,
      title: 'Collaboration Opportunity: Tech Partnerships',
      date: 'Feb 25, 2026',
      location: 'The Hub',
      type: 'Opportunity',
      description: 'Seeking partnerships with industry partners for joint innovation initiatives.'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const getResearchIcon = (index) => {
    const icons = [Zap, Brain, Leaf, Radio]
    return icons[index]
  }

  const getBulletinIcon = (index) => {
    const icons = [Calendar, Lightbulb, Shield, Share2]
    return icons[index]
  }

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
          <p className="text-base font-semibold uppercase tracking-wide text-foreground/70 mb-4">
            Community & Collaboration
          </p>
          <h1 className="mb-6">The Exchange</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover ongoing research initiatives, connect with innovators, and stay updated on events 
            at the TUM Fusion Lab as the Hochvolthaus is reimagined as a modern hub for innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Research Showcase */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Research Showcase</h2>
                  <p className="text-muted-foreground">Ongoing projects in our specialized labs</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Research Tabs */}
              <div className="flex flex-wrap gap-3 mb-6">
                {researchProjects.map((project, index) => {
                  const Icon = getResearchIcon(index)
                  const isActive = activeResearchTab === index
                  return (
                    <motion.button
                      key={project.id}
                      onClick={() => setActiveResearchTab(index)}
                      className="flex items-center gap-2 border-none cursor-pointer"
                      style={{
                        background: isActive 
                          ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                          : 'var(--secondary)',
                        color: isActive ? '#ffffff' : 'var(--muted-foreground)',
                        border: 'none !important',
                        borderWidth: '0 !important',
                        outline: 'none !important',
                        outlineWidth: '0',
                        outlineStyle: 'none',
                        outlineColor: 'transparent',
                        borderRadius: '1rem',
                        padding: '0.875rem 1.25rem',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        boxShadow: isActive 
                          ? '0 4px 20px rgba(37, 99, 235, 0.3)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.3s ease'
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: isActive 
                          ? '0 6px 25px rgba(37, 99, 235, 0.4)' 
                          : '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="whitespace-nowrap">{project.lab.split(' ')[0]}</span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Research Content */}
              <motion.div
                key={activeResearchTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-xl border border-blue-400/50 bg-blue-50/30 dark:bg-blue-950/20"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{researchProjects[activeResearchTab].image}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                          {researchProjects[activeResearchTab].title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{researchProjects[activeResearchTab].lab}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {researchProjects[activeResearchTab].status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{researchProjects[activeResearchTab].description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{researchProjects[activeResearchTab].team}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Bulletin Board */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Bulletin Board</h2>
                  <p className="text-muted-foreground">Events & announcements</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Bulletin Tabs */}
              <div className="flex flex-wrap gap-3 mb-6">
                {bulletinItems.map((item, index) => {
                  const Icon = getBulletinIcon(index)
                  const isActive = activeBulletinTab === index
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveBulletinTab(index)}
                      className="flex items-center gap-2 border-none cursor-pointer"
                      style={{
                        background: isActive 
                          ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                          : 'var(--secondary)',
                        color: isActive ? '#ffffff' : 'var(--muted-foreground)',
                        border: 'none !important',
                        borderWidth: '0 !important',
                        outline: 'none !important',
                        outlineWidth: '0',
                        outlineStyle: 'none',
                        outlineColor: 'transparent',
                        borderRadius: '1rem',
                        padding: '0.875rem 1.25rem',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        boxShadow: isActive 
                          ? '0 4px 20px rgba(249, 115, 22, 0.3)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.3s ease'
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: isActive 
                          ? '0 6px 25px rgba(249, 115, 22, 0.4)' 
                          : '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="whitespace-nowrap">{item.type}</span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Bulletin Content */}
              <motion.div
                key={activeBulletinTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-xl border border-orange-400/50 bg-orange-50/30 dark:bg-orange-950/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-orange-600 dark:text-orange-400 flex-1">
                    {bulletinItems[activeBulletinTab].title}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                    bulletinItems[activeBulletinTab].type === 'Event' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    bulletinItems[activeBulletinTab].type === 'Workshop' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    bulletinItems[activeBulletinTab].type === 'Announcement' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {bulletinItems[activeBulletinTab].type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{bulletinItems[activeBulletinTab].description}</p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">📅</span>
                    <span>{bulletinItems[activeBulletinTab].date}</span>
                    {bulletinItems[activeBulletinTab].time && <span className="text-muted-foreground">at {bulletinItems[activeBulletinTab].time}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">📍</span>
                    <span>{bulletinItems[activeBulletinTab].location}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 p-8 rounded-xl bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/30 dark:to-orange-950/30 border border-blue-200/50 dark:border-blue-900/50"
        >
          <div className="flex items-start gap-4">
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold mb-2">Join the Innovation Ecosystem</h3>
              <p className="text-muted-foreground mb-4">
                Be part of a thriving community of researchers, innovators, and industry partners. 
                Collaborate on cutting-edge projects and help shape the future of sustainable development at the Hochvolthaus.
              </p>
              <button 
                onClick={() => navigate('/get-involved')}
                className="btn btn-primary"
              >
                Get Involved
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TheExchange
