import { motion } from 'framer-motion'
import { Clock, Building, Landmark } from 'lucide-react'

const conceptCards = [
  {
    icon: Clock,
    title: 'History',
    description: 'Explore the rich heritage and transformation of the Hochvolthaus from its origins in 1957.'
  },
  {
    icon: Building,
    title: 'Architecture',
    description: 'Discover the architectural vision and design principles that guide the redesign.'
  },
  {
    icon: Landmark,
    title: 'Urban Design',
    description: 'See how the building integrates with Munich\'s urban context and TUM campus.'
  }
]

function TheConcept({ onShowHistory }) {
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
            Explore
          </p>
          <h1 className="mb-6">The Concept</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Understanding the historical significance, architectural innovation, 
            and urban integration of the Hochvolthaus redesign project.
          </p>
        </div>

        {/* Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {conceptCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="card group cursor-pointer hover:shadow-2xl"
                onClick={() => card.title === 'History' && onShowHistory()}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="mb-3">{card.title}</h3>
                <p className="text-muted-foreground mb-4">{card.description}</p>
                <div className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Design Philosophy */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 grid md:grid-cols-2 gap-8"
        >
          <div className="card">
            <h3 className="mb-4">Heritage Preservation</h3>
            <p className="text-muted-foreground mb-4">
              The building embodies mid-20th century engineering architecture, representing the "Second Munich School" 
              with its material-driven aesthetic and post-war modernist values.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Maintain original architectural features</li>
              <li>• Respect historical significance</li>
              <li>• Preserve cultural value</li>
            </ul>
          </div>
          <div className="card bg-primary text-white">
            <h3 className="mb-4">Sustainable Integration</h3>
            <p className="text-white/90 mb-4">
              Modern interventions focus on sustainability, accessibility, and creating flexible spaces for 
              contemporary academic and collaborative needs.
            </p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Green building technologies</li>
              <li>• Energy-efficient systems</li>
              <li>• Flexible workspace design</li>
            </ul>
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 bg-secondary rounded-2xl p-8 lg:p-12"
        >
          <h2 className="mb-8 text-center">Project Timeline</h2>
          <div className="space-y-6">
            {[
              { year: '1957-1963', event: 'Original construction by Werner Eichberg and Franz Hart' },
              { year: '1985', event: 'Designated as important exemplar of "Second Munich School"' },
              { year: '2020', event: 'Initial assessment for redesign and adaptive reuse' },
              { year: '2025', event: 'Fusion Lab course - Redesign proposal by ITBE students' }
            ].map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-24">
                  <div className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-full text-sm">
                    {item.year}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-lg">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TheConcept
