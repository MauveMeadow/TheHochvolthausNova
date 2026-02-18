import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'

function Hero({ onExplore }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <div className="h-screen w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-white">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-br from-primary via-primary/80 to-indigo-600 bg-clip-text text-transparent leading-tight"
        >
          The Hochvolthaus Nova
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Transforming Historic Architecture into a Modern Hub for Innovation and Sustainable Design
        </motion.p>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-muted-foreground/80 mb-12 max-w-xl mx-auto"
        >
          Discover how we're reimagining a landmark 1957 engineering building for the future, 
          blending heritage preservation with cutting-edge sustainability.
        </motion.p>



        {/* Scroll Indicator */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center"
        >
          <motion.button
            onClick={onExplore}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 rounded-full border border-primary/20 hover:border-primary/40 transition-colors hover:bg-primary/5 text-primary"
          >
            <ChevronDown size={24} />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  )
}

export default Hero
