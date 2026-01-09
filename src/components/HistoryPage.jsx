import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Building2, Users } from 'lucide-react'

function HistoryPage({ onBack }) {
  const historyContent = `The Hochvolthaus (High-Voltage House) on the Technische Universität München (TUM) main campus in Theresienstraße was built between 1957 and 1963 for research in high-voltage electrical engineering. Designed by architects Werner Eichberg and Franz Hart, the building represents mid-20th-century technical modernism - an architecture shaped by extreme functional and safety constraints.

Its design separates the high-voltage hall, used for electrical discharge and insulation experiments, from adjacent laboratory and office areas. Thick non-conductive masonry walls, careful routing of cables, and minimized metal components protect against stray currents and electromagnetic interference. The result is a highly specialized architectural solution balancing safety, structure, and scientific function.

From the outside, the Hochvolthaus presents a plain, fortress-like façade - a deliberate aesthetic of industrial purpose. Today, the building remains part of the TUM campus infrastructure and is being used by the Associate Professorship of High Voltage Engineering and Switchgear Technology (Prof. Jossen komm.)`

  const timelineEvents = [
    {
      year: '1957-1963',
      event: 'Original construction by Werner Eichberg and Franz Hart',
      description: 'The Hochvolthaus was built as a specialized research facility for high-voltage electrical engineering experiments.'
    },
    {
      year: '1985',
      event: 'Designated as important exemplar of "Second Munich School"',
      description: 'The building was recognized as a significant example of post-war technical modernism and engineering architecture.'
    },
    {
      year: '2020',
      event: 'Initial assessment for redesign and adaptive reuse',
      description: 'Began evaluation of how this historic building could be repurposed for contemporary academic needs.'
    },
    {
      year: '2025',
      event: 'Fusion Lab course - Redesign proposal by ITBE students',
      description: 'Students from the Integrated Technology in the Built Environment program developed innovative redesign concepts.'
    }
  ]

  const highlights = [
    {
      icon: Building2,
      title: 'Architectural Innovation',
      description: 'A masterpiece of mid-20th century technical modernism with fortress-like façade representing industrial purpose.'
    },
    {
      icon: Clock,
      title: 'Historical Significance',
      description: 'Built in 1957-1963 by renowned architects Werner Eichberg and Franz Hart, marking an important era in engineering architecture.'
    },
    {
      icon: Users,
      title: 'Academic Excellence',
      description: 'Home to the Associate Professorship of High Voltage Engineering and Switchgear Technology, continuing its research mission.'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white"
    >
      {/* Navigation Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200"
      >
        <div className="container max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h2 className="text-2xl font-bold text-primary">History of Hochvolthaus</h2>
          <div className="w-32" /> {/* Spacer for alignment */}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              The Hochvolthaus
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A landmark of post-war technical architecture and scientific innovation
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl mb-8"
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-8">
                <Building2 className="w-32 h-32 mx-auto mb-6 text-primary opacity-20" />
                <p className="text-muted-foreground text-lg">
                  Building visualization
                  <br />
                  <span className="text-sm">Historic high-voltage research facility</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main History Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="card bg-white/80 backdrop-blur border border-gray-200">
            <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
              {historyContent}
            </p>
          </div>
        </motion.div>

        {/* Key Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Key Highlights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="card bg-white/80 backdrop-blur border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{highlight.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{highlight.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Timeline</h2>
          <div className="space-y-6">
            {timelineEvents.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="card bg-white/80 backdrop-blur border border-gray-200"
              >
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-full text-sm font-bold">
                      {item.year}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-bold mb-2">{item.event}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Architectural Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Architectural Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-white/80 backdrop-blur border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Design Features</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>Separated high-voltage hall for electrical discharge and insulation experiments</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>Adjacent laboratory and office areas protected from high-voltage hazards</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>Thick non-conductive masonry walls for safety</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>Carefully routed cables minimizing electromagnetic interference</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>Minimized metal components to protect against stray currents</span>
                </li>
              </ul>
            </div>
            <div className="card bg-primary text-white">
              <h3 className="text-xl font-bold mb-4">Architectural Significance</h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex gap-3">
                  <span className="font-bold mt-0.5">•</span>
                  <span>Mid-20th century technical modernism</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold mt-0.5">•</span>
                  <span>Example of "Second Munich School" architecture</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold mt-0.5">•</span>
                  <span>Fortress-like façade reflecting industrial purpose</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold mt-0.5">•</span>
                  <span>Balance of safety, structure, and scientific function</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold mt-0.5">•</span>
                  <span>Designated important exemplar in 1985</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* The Architects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">The Architects</h2>
          
          {/* Franz Hart Section */}
          <div className="card bg-white/80 backdrop-blur border border-gray-200">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-primary mb-2">Franz Hart</h3>
              <p className="text-muted-foreground font-medium">25.11.1910 - 9.02.1996</p>
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Franz Hart was a German architect and university teacher who played a pivotal role in shaping Munich's 
                post-war architectural landscape. He studied from 1929 to 1934 at the Technical University of Munich, 
                where he learned from distinguished architects including Robert Vorhölzer and Hans Döllgast.
              </p>
              
              <p>
                After graduating, he worked from 1935 to 1942 in architectural firms in Munich and Dortmund, where he 
                was responsible in particular for statics and construction. Following three years of military service, 
                Franz Hart established his own practice as an architect, typographer, and publisher in Munich in 1945.
              </p>
              
              <p>
                He coined the cityscape of Munich through several public buildings and façade designs. His most prominent 
                buildings include the platform hall of the Munich Central Station, the Patent Office, and various buildings 
                for the Technical University of Munich.
              </p>
              
              <div className="bg-primary/5 rounded-lg p-6 border-l-4 border-primary">
                <p className="font-semibold text-primary mb-3">Architectural Philosophy</p>
                <p>
                  Hart was one of the most influential and formative architects of the postwar period in Munich. His designs 
                  bear witness to a moderately modern but exceptionally precise formal language and an explicitly modern 
                  interpretation of urban space. He was one of the pioneers dealing intensively with building in the 
                  historical context.
                </p>
              </div>
              
              <p>
                In many cases, the realized buildings can be regarded as urban or architectural solitaires, which do not 
                subordinate themselves to the existing, but set self-confident accents.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-secondary rounded-lg p-4">
                  <p className="font-semibold text-primary mb-2">Academic Career</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Lecturer at TUM (1946-1948)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Professor of Structural Engineering (1948-1978)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>30 years shaping future architects</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-secondary rounded-lg p-4">
                  <p className="font-semibold text-primary mb-2">Notable Works</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Munich Central Station platform hall</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Patent Office</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>TUM buildings including Hochvolthaus</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-sm italic pt-4">
                His architectural office in Munich continued to operate for years after his death, testament to his 
                lasting influence on German architecture.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Current Use */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card bg-secondary rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold mb-6">Current Use & Legacy</h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            Today, the Hochvolthaus remains an integral part of the TUM campus infrastructure. It continues to serve 
            the academic and research missions for which it was originally designed.
          </p>
          <div className="bg-white rounded-lg p-6 border-l-4 border-primary">
            <p className="font-semibold text-primary mb-2">Associate Professorship of High Voltage Engineering and Switchgear Technology</p>
            <p className="text-muted-foreground">
              Prof. Jossen komm. leads the research and education programs that continue the building's legacy of 
              excellence in high-voltage engineering.
            </p>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 text-center"
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Home
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default HistoryPage
