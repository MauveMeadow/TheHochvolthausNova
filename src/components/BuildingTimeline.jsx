import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function BuildingTimeline() {
  const [activePhase, setActivePhase] = useState(0)

  const timelineData = [
    {
      month: 'Month 1-2',
      title: 'Foundation & Planning',
      status: 'completed',
      events: [
        { date: 'Week 1', task: 'Site preparation and clearing', status: 'completed' },
        { date: 'Week 2-3', task: 'Foundation excavation', status: 'completed' },
        { date: 'Week 4', task: 'Foundation concrete pouring', status: 'completed' }
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      month: 'Month 3-5',
      title: 'Structural Construction',
      status: 'in-progress',
      events: [
        { date: 'Week 9-12', task: 'Steel frame installation', status: 'in-progress' },
        { date: 'Week 13-16', task: 'Concrete flooring', status: 'pending' },
        { date: 'Week 17-20', task: 'Exterior walls construction', status: 'pending' }
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      month: 'Month 6-8',
      title: 'MEP Systems Installation',
      status: 'pending',
      events: [
        { date: 'Week 21-24', task: 'Electrical wiring installation', status: 'pending' },
        { date: 'Week 25-28', task: 'HVAC system setup', status: 'pending' },
        { date: 'Week 29-32', task: 'Plumbing & water systems', status: 'pending' }
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      month: 'Month 9-11',
      title: 'Interior & Finishing',
      status: 'pending',
      events: [
        { date: 'Week 33-36', task: 'Interior wall partitions', status: 'pending' },
        { date: 'Week 37-40', task: 'Flooring installation', status: 'pending' },
        { date: 'Week 41-44', task: 'Painting & wall finishing', status: 'pending' }
      ],
      color: 'from-orange-500 to-orange-600'
    },
    {
      month: 'Month 12-16',
      title: 'Advanced Systems & Smart Tech',
      status: 'pending',
      events: [
        { date: 'Week 45-52', task: 'Smart building systems', status: 'pending' },
        { date: 'Week 53-60', task: 'Renewable energy installation', status: 'pending' },
        { date: 'Week 61-68', task: 'IoT sensors & automation', status: 'pending' }
      ],
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      month: 'Month 17-20',
      title: 'Maintenance Preparation',
      status: 'pending',
      events: [
        { date: 'Week 69-72', task: 'Preventive maintenance planning', status: 'pending' },
        { date: 'Week 73-76', task: 'Equipment testing', status: 'pending' },
        { date: 'Week 77-80', task: 'Safety protocols setup', status: 'pending' }
      ],
      color: 'from-pink-500 to-pink-600'
    },
    {
      month: 'Month 21-22',
      title: 'Quality Assurance',
      status: 'pending',
      events: [
        { date: 'Week 81-84', task: 'Final inspections & testing', status: 'pending' },
        { date: 'Week 85-88', task: 'Certification & compliance', status: 'pending' },
        { date: 'Week 89-92', task: 'Pre-launch preparations', status: 'pending' }
      ],
      color: 'from-red-500 to-red-600'
    },
    {
      month: 'Month 23-24',
      title: 'Launch & Ongoing Maintenance',
      status: 'pending',
      events: [
        { date: 'Week 93-96', task: 'Building launch & opening day', status: 'pending' },
        { date: 'Week 97-100', task: 'First quarter maintenance checks', status: 'pending' },
        { date: 'Beyond Week 100', task: 'Continuous maintenance schedule', status: 'pending' }
      ],
      color: 'from-yellow-500 to-yellow-600'
    }
  ]

  const maintenanceSchedule = [
    { frequency: 'Weekly', tasks: ['HVAC filter checks', 'System monitoring', 'Facility inspections'] },
    { frequency: 'Monthly', tasks: ['Deep cleaning', 'Equipment maintenance', 'Safety audits'] },
    { frequency: 'Quarterly', tasks: ['Preventive maintenance', 'System optimization', 'Renovation planning'] },
    { frequency: 'Annually', tasks: ['Major system overhaul', 'Comprehensive inspection', 'Upgrades & renovations'] }
  ]

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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Project Timeline</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Comprehensive 24-month construction timeline with maintenance and renovation schedules 
            for The Hochvolthaus Nova project.
          </p>
        </motion.div>

        {/* Main Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Construction Phases</h2>
          <div className="space-y-4">
            {timelineData.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActivePhase(index)}
                className={`card cursor-pointer transition-all ${
                  activePhase === index ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Timeline Indicator */}
                  <div className="flex-shrink-0">
                    <motion.div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${phase.color} 
                        flex items-center justify-center text-white shadow-lg`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {phase.status === 'completed' ? (
                        <CheckCircle2 size={24} />
                      ) : phase.status === 'in-progress' ? (
                        <Clock size={24} />
                      ) : (
                        <Calendar size={24} />
                      )}
                    </motion.div>
                  </div>

                  {/* Phase Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">{phase.month}</p>
                        <h3 className="text-xl font-bold">{phase.title}</h3>
                      </div>
                      <motion.span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          phase.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : phase.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        layoutId="status"
                      >
                        {phase.status === 'completed'
                          ? 'Completed'
                          : phase.status === 'in-progress'
                          ? 'In Progress'
                          : 'Pending'}
                      </motion.span>
                    </div>

                    {/* Phase Tasks */}
                    <motion.div
                      initial={false}
                      animate={{ height: activePhase === index ? 'auto' : 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-2">
                        {phase.events.map((event, eventIndex) => (
                          <motion.div
                            key={eventIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: eventIndex * 0.1 }}
                            className="text-sm"
                          >
                            <span className="font-semibold text-primary">{event.date}</span>
                            <span className="text-gray-600 ml-2">• {event.task}</span>
                            <span
                              className={`ml-2 text-xs font-medium ${
                                event.status === 'completed'
                                  ? 'text-green-600'
                                  : event.status === 'in-progress'
                                  ? 'text-blue-600'
                                  : 'text-gray-500'
                              }`}
                            >
                              [{event.status}]
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${phase.color}`}
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        phase.status === 'completed'
                          ? '100%'
                          : phase.status === 'in-progress'
                          ? '60%'
                          : '0%'
                    }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Maintenance Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8">Maintenance & Renovation Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {maintenanceSchedule.map((schedule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
              >
                <h3 className="text-lg font-bold text-primary mb-4">{schedule.frequency}</h3>
                <ul className="space-y-2">
                  {schedule.tasks.map((task, taskIndex) => (
                    <motion.li
                      key={taskIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 + taskIndex * 0.05 }}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-primary font-bold text-lg leading-none mt-1">•</span>
                      <span>{task}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-8">Project Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="card text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">24</div>
              <p className="text-muted-foreground">Total Project Duration (Months)</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 }}
              className="card text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">8</div>
              <p className="text-muted-foreground">Major Construction Phases</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="card text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">4</div>
              <p className="text-muted-foreground">Maintenance Frequency Levels</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BuildingTimeline
