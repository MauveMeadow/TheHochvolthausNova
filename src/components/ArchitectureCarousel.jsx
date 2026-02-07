import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// SVG Illustrations
const DesignLogicDiagram = () => (
  <div className="grid grid-cols-2 gap-2 h-full">
    {/* INTERACTION - Complex geometric pattern */}
    <div className="bg-white border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center">
      <svg viewBox="0 0 400 200" className="w-20 h-16">
        {/* Light pink background shapes */}
        <rect x="240" y="20" width="80" height="60" fill="#fce7e7" />
        <rect x="280" y="90" width="60" height="50" fill="#fce7e7" />
        <rect x="0" y="140" width="100" height="30" fill="#fce7e7" />
        
        {/* Red geometric blocks - Interaction pattern */}
        <rect x="0" y="0" width="80" height="80" fill="#ef4444" />
        <rect x="96" y="0" width="80" height="50" fill="#ef4444" />
        <rect x="96" y="65" width="80" height="70" fill="#ef4444" />
        <rect x="192" y="0" width="30" height="45" fill="#ef4444" />
        
        <rect x="65" y="120" width="100" height="60" fill="#ef4444" />
        <rect x="192" y="100" width="80" height="80" fill="#ef4444" />
        <rect x="280" y="145" width="80" height="35" fill="#ef4444" />
      </svg>
    </div>

    {/* CIRCULATION - Vertical movement with arrows */}
    <div className="bg-white border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center">
      <svg viewBox="0 0 400 200" className="w-20 h-16">
        {/* Top section with upward arrow */}
        <rect x="0" y="0" width="400" height="90" fill="#ef4444" />
        <line x1="200" y1="20" x2="200" y2="70" stroke="white" strokeWidth="4" />
        
        {/* Up arrow */}
        <polygon points="200,20 220,40 180,40" fill="white" />
        
        {/* Division line */}
        <line x1="0" y1="90" x2="400" y2="90" stroke="white" strokeWidth="3" />
        
        {/* Bottom section with downward arrow */}
        <rect x="0" y="90" width="400" height="110" fill="#ef4444" />
        <line x1="200" y1="110" x2="200" y2="170" stroke="white" strokeWidth="4" />
        
        {/* Down arrow */}
        <polygon points="200,170 220,150 180,150" fill="white" />
      </svg>
    </div>

    {/* ADAPTABILITY - Space with flexibility pattern */}
    <div className="bg-white border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center">
      <svg viewBox="0 0 400 300" className="w-20 h-16">
        {/* Red bars on left */}
        <rect x="10" y="20" width="30" height="80" fill="#ef4444" />
        <rect x="10" y="120" width="30" height="80" fill="#ef4444" />
        <rect x="10" y="220" width="30" height="60" fill="#ef4444" />
        
        {/* Stacked rectangles in middle */}
        <rect x="60" y="20" width="140" height="60" fill="#ef4444" />
        <rect x="60" y="110" width="100" height="60" fill="#ef4444" />
        <rect x="60" y="200" width="140" height="80" fill="#ef4444" />
        
        {/* Large area on right */}
        <rect x="220" y="20" width="170" height="260" fill="#ef4444" />
      </svg>
    </div>

    {/* CONNECTION - Horizontal and vertical elements */}
    <div className="bg-white border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center">
      <svg viewBox="0 0 400 300" className="w-20 h-16">
        {/* Top section */}
        <rect x="0" y="0" width="400" height="100" fill="#ef4444" />
        <line x1="140" y1="0" x2="140" y2="100" stroke="white" strokeWidth="4" />
        <line x1="240" y1="0" x2="240" y2="100" stroke="white" strokeWidth="4" />
        
        {/* Middle section */}
        <rect x="0" y="100" width="400" height="100" fill="#ef4444" />
        <line x1="100" y1="100" x2="100" y2="200" stroke="white" strokeWidth="4" />
        <line x1="200" y1="100" x2="200" y2="200" stroke="white" strokeWidth="4" />
        <line x1="300" y1="100" x2="300" y2="200" stroke="white" strokeWidth="4" />
        
        {/* Bottom section */}
        <rect x="0" y="200" width="400" height="100" fill="#ef4444" />
        <line x1="180" y1="200" x2="180" y2="300" stroke="white" strokeWidth="4" />
      </svg>
    </div>
  </div>
)

const InteractionIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    {/* Light pink background shapes */}
    <rect x="240" y="20" width="80" height="60" fill="#fce7e7" />
    <rect x="280" y="130" width="60" height="50" fill="#fce7e7" />
    <rect x="0" y="200" width="100" height="40" fill="#fce7e7" />
    
    {/* Red geometric blocks - Interaction pattern */}
    <rect x="0" y="0" width="90" height="90" fill="#ef4444" />
    <rect x="110" y="0" width="90" height="70" fill="#ef4444" />
    <rect x="110" y="90" width="90" height="80" fill="#ef4444" />
    <rect x="220" y="0" width="40" height="55" fill="#ef4444" />
    
    <rect x="75" y="160" width="110" height="70" fill="#ef4444" />
    <rect x="220" y="120" width="90" height="100" fill="#ef4444" />
    <rect x="310" y="200" width="80" height="50" fill="#ef4444" />
  </svg>
)

const AdaptabilityIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    {/* Red background shapes */}
    <rect x="30" y="0" width="100" height="150" fill="#ef4444" />
    <rect x="150" y="20" width="120" height="100" fill="#ef4444" />
    <rect x="280" y="60" width="100" height="130" fill="#ef4444" />
    <rect x="50" y="170" width="300" height="80" fill="#ef4444" />
    
    {/* White creative spaces inside */}
    <rect x="50" y="20" width="60" height="60" fill="white" />
    <rect x="170" y="50" width="80" height="50" fill="white" />
    <rect x="300" y="30" width="60" height="80" fill="white" />
    <rect x="80" y="190" width="90" height="50" fill="white" />
    <rect x="220" y="185" width="80" height="55" fill="white" />
  </svg>
)

const CirculationIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    {/* Top section */}
    <rect x="0" y="0" width="400" height="140" fill="#ef4444" />
    <line x1="200" y1="30" x2="200" y2="110" stroke="white" strokeWidth="5" />
    <polygon points="200,30 225,60 175,60" fill="white" />
    
    {/* Vertical divider */}
    <line x1="0" y1="140" x2="400" y2="140" stroke="white" strokeWidth="4" />
    
    {/* Bottom section */}
    <rect x="0" y="140" width="400" height="160" fill="#ef4444" />
    <line x1="200" y1="160" x2="200" y2="280" stroke="white" strokeWidth="5" />
    <polygon points="200,280 225,250 175,250" fill="white" />
  </svg>
)

const FormSpaceStructure = () => (
  <svg viewBox="0 0 1200 500" className="w-full h-full">
    {/* Building 1 - Simple form with lighter tones */}
    <g>
      {/* Top roof */}
      <polygon points="80,120 180,80 280,120 180,160" fill="#999999" />
      {/* Front left face */}
      <polygon points="80,120 80,280 180,320 180,160" fill="#b3b3b3" />
      {/* Front right face */}
      <polygon points="180,160 180,320 280,280 280,120" fill="#a9a9a9" />
      {/* Door opening */}
      <polygon points="100,220 100,290 140,290 140,220" fill="white" stroke="#999" strokeWidth="1" />
    </g>

    {/* Building 2 - With stairwell cylinder */}
    <g>
      {/* Top roof */}
      <polygon points="350,100 480,50 610,100 480,150" fill="#666666" />
      {/* Front left face */}
      <polygon points="350,100 350,300 480,350 480,150" fill="#999999" />
      {/* Front right face */}
      <polygon points="480,150 480,350 610,300 610,100" fill="#b3b3b3" />
      {/* Stairwell cylinder */}
      <circle cx="420" cy="240" r="20" fill="#f5f5f5" stroke="#999" strokeWidth="1" />
      <ellipse cx="420" cy="240" rx="20" ry="8" fill="#ffffff" />
    </g>

    {/* Building 3 - Larger structure with dark top */}
    <g>
      {/* Top roof - dark */}
      <polygon points="700,80 860,20 1020,80 860,140" fill="#555555" />
      {/* Front left face */}
      <polygon points="700,80 700,320 860,380 860,140" fill="#999999" />
      {/* Front right face */}
      <polygon points="860,140 860,380 1020,320 1020,80" fill="#777777" />
      {/* Large stairwell cylinder */}
      <circle cx="820" cy="260" r="28" fill="#f5f5f5" stroke="#999" strokeWidth="1" />
      <ellipse cx="820" cy="260" rx="28" ry="12" fill="#ffffff" />
    </g>

    {/* Building 4 - Simple cubic form bottom right */}
    <g>
      {/* Top roof */}
      <polygon points="850,420 940,390 1030,420 940,450" fill="#d9d9d9" />
      {/* Front left face */}
      <polygon points="850,420 850,480 940,510 940,450" fill="#e8e8e8" />
      {/* Front right face */}
      <polygon points="940,450 940,510 1030,480 1030,420" fill="#d9d9d9" />
    </g>
  </svg>
)

const VerticalCirculation = () => (
  <svg viewBox="0 0 1000 600" className="w-full h-full">
    {/* Left Section A building */}
    <g>
      <polygon points="100,200 100,400 200,450 200,250" fill="#b3b3b3" />
      <polygon points="200,250 200,450 300,500 300,300" fill="#666666" />
      <polygon points="100,200 200,250 300,300 200,200" fill="#d9d9d9" />
      <polygon points="130,320 130,380 160,390 160,310" fill="white" />
    </g>

    {/* Middle - stairs visualization */}
    <g>
      {/* Building structure behind */}
      <rect x="350" y="250" width="150" height="150" fill="#f3f3f3" opacity="0.3" />
      
      {/* Stairs - red steps */}
      <polygon points="380,380 380,350 410,350 410,380" fill="#ef4444" />
      <line x1="390" y1="350" x2="420" y2="320" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" />
      
      <polygon points="420,350 420,320 450,320 450,350" fill="#ef4444" />
      <line x1="430" y1="320" x2="460" y2="290" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" />
      
      <polygon points="460,320 460,290 490,290 490,320" fill="#ef4444" />
      <line x1="470" y1="290" x2="500" y2="260" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" />
    </g>

    {/* Right - new structure with stairs */}
    <g>
      <polygon points="650,200 650,400 750,450 750,250" fill="#b3b3b3" />
      <polygon points="750,250 750,450 850,500 850,300" fill="#666666" />
      <polygon points="650,200 750,250 850,300 750,200" fill="#d9d9d9" />
      
      {/* Integrated stairs */}
      <polygon points="680,280 680,250 710,260 710,300" fill="#ef4444" />
      <polygon points="710,260 710,230 740,240 740,280" fill="#ef4444" />
      <polygon points="740,240 740,210 770,220 770,260" fill="#ef4444" />
      
      {/* Grid pattern for floors */}
      <line x1="680" y1="340" x2="800" y2="340" stroke="#999" strokeWidth="2" />
      <line x1="680" y1="360" x2="800" y2="360" stroke="#999" strokeWidth="2" />
    </g>

    {/* Labels */}
    <text x="200" y="520" fontSize="13" fill="#ef4444" textAnchor="middle" fontWeight="bold">Section A</text>
    <text x="200" y="545" fontSize="11" fill="#666" textAnchor="middle">Isolated vertical</text>
    <text x="200" y="560" fontSize="11" fill="#666" textAnchor="middle">circulation</text>

    <text x="500" y="480" fontSize="12" fill="#1d1d1f" textAnchor="middle">New system of open stairs</text>
    <text x="500" y="500" fontSize="12" fill="#666" textAnchor="middle">connects ground to upper levels</text>

    <text x="750" y="520" fontSize="13" fill="#1d1d1f" textAnchor="middle" fontWeight="bold">Integrated Stairs</text>
    <text x="750" y="545" fontSize="11" fill="#666" textAnchor="middle">Visible, intuitive,</text>
    <text x="750" y="560" fontSize="11" fill="#666" textAnchor="middle">spatially integrated</text>
  </svg>
)

const HorizontalVerticalFlow = () => (
  <svg viewBox="0 0 1000 600" className="w-full h-full">
    {/* Section B - Left building */}
    <g>
      <polygon points="80,200 80,400 180,450 180,250" fill="#b3b3b3" />
      <polygon points="180,250 180,450 280,500 280,300" fill="#666666" />
      <polygon points="80,200 180,250 280,300 180,200" fill="#d9d9d9" />
      <polygon points="120,320 120,380 150,390 150,310" fill="white" />
    </g>

    {/* Horizontal circulation layers */}
    <g>
      <text x="380" y="180" fontSize="13" fill="#1d1d1f" fontWeight="bold">Horizontal circulation:</text>
      <text x="380" y="205" fontSize="12" fill="#666">Each added level supports</text>
      <text x="380" y="225" fontSize="12" fill="#666">a specific programmatic role</text>
      
      {/* Stacked layers */}
      <polygon points="350,260 450,240 500,270 400,290" fill="#f3f3f3" stroke="#999" strokeWidth="2" />
      <polygon points="350,300 450,280 500,310 400,330" fill="#f3f3f3" stroke="#999" strokeWidth="2" />
      <polygon points="350,340 450,320 500,350 400,370" fill="#f3f3f3" stroke="#999" strokeWidth="2" />
      <polygon points="350,380 450,360 500,390 400,410" fill="#f3f3f3" stroke="#999" strokeWidth="2" />
    </g>

    {/* Vertical circulation - Right side */}
    <g>
      <text x="750" y="180" fontSize="13" fill="#1d1d1f" fontWeight="bold">Vertical circulation:</text>
      <text x="750" y="205" fontSize="12" fill="#666">Large seating stairs connect</text>
      <text x="750" y="225" fontSize="12" fill="#666">ground to basement level</text>
      
      {/* Building structure */}
      <polygon points="660,260 760,240 810,270 710,290" fill="#d9d9d9" stroke="#999" strokeWidth="2" />
      <polygon points="660,290 760,270 810,300 710,320" fill="#b3b3b3" stroke="#999" strokeWidth="2" />
      
      {/* Vertical stairs */}
      <line x1="690" y1="290" x2="690" y2="380" stroke="#ef4444" strokeWidth="6" />
      <polygon points="685,290 695,290 695,310 685,310" fill="#ef4444" />
      <polygon points="685,330 695,330 695,350 685,350" fill="#ef4444" />
      <polygon points="685,370 695,370 695,390 685,390" fill="#ef4444" />
    </g>

    {/* Bottom labels */}
    <text x="200" y="540" fontSize="13" fill="#1d1d1f" textAnchor="middle" fontWeight="bold">Section B</text>
    <text x="200" y="560" fontSize="11" fill="#666" textAnchor="middle">Expanded with four new levels</text>

    <text x="500" y="540" fontSize="11" fill="#1d1d1f" textAnchor="middle">Layered & Flexible</text>
    <text x="750" y="540" fontSize="11" fill="#1d1d1f" textAnchor="middle">Clear Continuity</text>
  </svg>
)

const EntranceStrategy = () => (
  <svg viewBox="0 0 1000 600" className="w-full h-full">
    {/* Left - Site plan */}
    <g>
      <text x="250" y="30" fontSize="14" fill="#1d1d1f" fontWeight="bold" textAnchor="middle">Existing Access Points</text>
      
      {/* Building outline */}
      <polygon points="150,80 350,80 350,280 150,280" fill="#999999" />
      <polygon points="160,90 340,90 340,270 160,270" fill="#d9d9d9" />
      
      {/* Entrances C and D */}
      <circle cx="150" cy="180" r="8" fill="#001960" />
      <text x="120" y="210" fontSize="12" fill="#001960" fontWeight="bold">C</text>
      
      <circle cx="350" cy="180" r="8" fill="#001960" />
      <text x="360" y="210" fontSize="12" fill="#001960" fontWeight="bold">D</text>
      
      {/* Surrounding streets */}
      <line x1="50" y1="80" x2="450" y2="80" stroke="#999" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="50" y1="280" x2="450" y2="280" stroke="#999" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="150" y1="0" x2="150" y2="350" stroke="#999" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="350" y1="0" x2="350" y2="350" stroke="#999" strokeWidth="2" strokeDasharray="3,3" />
    </g>

    {/* Right - New entrance strategy */}
    <g>
      <text x="750" y="30" fontSize="14" fill="#1d1d1f" fontWeight="bold" textAnchor="middle">New Entrance Strategy</text>
      
      {/* Building outline */}
      <polygon points="650,80 850,80 850,280 650,280" fill="#999999" />
      <polygon points="660,90 840,90 840,270 660,270" fill="#d9d9d9" />
      
      {/* All entrances */}
      <circle cx="650" cy="180" r="8" fill="#ef4444" />
      <text x="620" y="210" fontSize="12" fill="#ef4444" fontWeight="bold">B</text>
      
      <circle cx="750" cy="80" r="8" fill="#ef4444" />
      <text x="745" y="60" fontSize="12" fill="#ef4444" fontWeight="bold">A</text>
      
      <circle cx="850" cy="180" r="8" fill="#001960" />
      <text x="860" y="210" fontSize="12" fill="#001960" fontWeight="bold">D</text>
      
      <circle cx="750" cy="280" r="8" fill="#001960" />
      <text x="745" y="305" fontSize="12" fill="#001960" fontWeight="bold">C</text>
      
      {/* Circulation paths */}
      <line x1="750" y1="88" x2="750" y2="200" stroke="#ef4444" strokeWidth="2" />
      <line x1="750" y1="200" x2="660" y2="180" stroke="#ef4444" strokeWidth="2" />
      <line x1="750" y1="200" x2="750" y2="270" stroke="#001960" strokeWidth="2" />
    </g>

    {/* Legend and description */}
    <text x="500" y="380" fontSize="12" fill="#1d1d1f" fontWeight="bold" textAnchor="middle">Primary Entrances (A - Main Access)</text>
    <text x="500" y="405" fontSize="11" fill="#666" textAnchor="middle">Secondary Entrances (B - Exhibition)</text>
    <text x="500" y="430" fontSize="11" fill="#666" textAnchor="middle">Existing Entrances (C, D - Service Access)</text>
  </svg>
)

const architectureSlides = [
  {
    id: 'design-logic',
    title: 'Design Logic',
    illustration: <DesignLogicDiagram />,
    sections: [
      {
        name: 'INTERACTION',
        subtitle: 'Transferring from isolated to interactive',
        description: 'Spaces designed to encourage collaboration and engagement rather than isolated work.'
      },
      {
        name: 'ADAPTABILITY',
        subtitle: 'Flexible & Generative',
        description: 'The space should be generous enough to let people do different things.'
      },
      {
        name: 'CIRCULATION',
        subtitle: 'Connection-Driven',
        description: 'Let the space define the connection between different areas.'
      }
    ]
  },
  {
    id: 'form-space-1',
    title: 'Form and Space - Building Structure',
    illustration: <FormSpaceStructure />,
    sections: [
      {
        name: 'GENERAL MASSING',
        subtitle: 'Overall Spatial Organization',
        description: 'General building massing illustrating the overall spatial organization and transformation strategy.'
      },
      {
        name: 'SPATIAL SECTIONS',
        subtitle: 'Two Distinct Areas',
        description: 'The building is structured as two clearly defined spatial sections responding to different contextual conditions.'
      }
    ]
  },
  {
    id: 'form-space-2',
    title: 'Form and Space - Vertical Circulation',
    illustration: <VerticalCirculation />,
    sections: [
      {
        name: 'SECTION A',
        subtitle: 'Vertical Challenges',
        description: 'Although the original building contained vertical circulation, it was isolated and difficult to read within the interior.'
      },
      {
        name: 'NEW STAIR SYSTEM',
        subtitle: 'Open & Integrated',
        description: 'A new system of open stairs connects the ground floor to the upper levels, making vertical movement visible, intuitive, and spatially integrated.'
      }
    ]
  },
  {
    id: 'form-space-3',
    title: 'Form and Space - Circulation Flow',
    illustration: <HorizontalVerticalFlow />,
    sections: [
      {
        name: 'SECTION B',
        subtitle: 'Building Expansion',
        description: 'The front part of the building is expanded by inserting four new spatial levels aligned with the existing structure.'
      },
      {
        name: 'HORIZONTAL CIRCULATION',
        subtitle: 'Layered & Flexible Use',
        description: 'Each added level supports a specific programmatic role, contributing to a layered and flexible use of the building.'
      },
      {
        name: 'VERTICAL CONTINUITY',
        subtitle: 'Connected Levels',
        description: 'Large seating stairs connect the ground floor to the basement, creating an in-between space for pause, orientation, and informal use with two lifts connecting basement to upper floors, ensuring clear and accessible vertical continuity between levels and added levels.'
      }
    ]
  },
  {
    id: 'entrance',
    title: 'Entrance Strategy',
    illustration: <EntranceStrategy />,
    sections: [
      {
        name: 'EXISTING ACCESS',
        subtitle: 'Current Entry Points',
        description: 'The building already contains existing access points at entrances C and D.'
      },
      {
        name: 'MAIN ENTRANCE',
        subtitle: 'Point A - Primary Access',
        description: 'Entrance A functions as the main access point, providing clear user orientation and primary functional access.'
      },
      {
        name: 'EXHIBITION ACCESS',
        subtitle: 'Point B - Secondary Access',
        description: 'Entrance B serves the exhibition and café areas, providing greater functional flexibility and clearer user orientation.'
      }
    ]
  }
]

const ArchitectureCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const paginate = (newDirection) => {
    setDirection(newDirection)
    setCurrentSlide((prev) => {
      let next = prev + newDirection
      if (next < 0) next = architectureSlides.length - 1
      if (next >= architectureSlides.length) next = 0
      return next
    })
  }

  const slide = architectureSlides[currentSlide]

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Slide Content */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="flex-1 grid grid-cols-2 gap-8 items-center"
        >
          {/* Left - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="h-auto flex items-center justify-center"
          >
            <div className="w-full h-full">
              {slide.illustration}
            </div>
          </motion.div>

          {/* Right - Content */}
          <div className="space-y-8">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-3xl font-bold text-primary mb-2">{slide.title}</h3>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-blue-500 rounded-full" />
            </motion.div>

            {/* Sections Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`grid ${
                slide.sections.length === 3 ? 'grid-cols-1 gap-4' :
                slide.sections.length === 2 ? 'grid-cols-1 gap-4' :
                'grid-cols-1 gap-4'
              }`}
            >
              {slide.sections.map((section, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="bg-gradient-to-br from-primary/5 to-white rounded-xl p-4 border border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="text-xs font-bold text-primary tracking-widest mb-1">
                    {section.name}
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 text-sm">
                    {section.subtitle}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {section.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100"
      >
        {/* Left Arrow */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(-1)}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-primary/10 hover:bg-primary hover:text-white text-primary"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        {/* Slide Counter and Indicators */}
        <div className="flex flex-col items-center gap-4">
          {/* Counter */}
          <div className="text-sm font-semibold text-muted-foreground">
            <span className="text-primary font-bold text-lg">{currentSlide + 1}</span>
            <span className="text-muted-foreground"> / {architectureSlides.length}</span>
          </div>

          {/* Dot Indicators */}
          <div className="flex gap-3">
            {architectureSlides.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentSlide ? 1 : -1)
                  setCurrentSlide(idx)
                }}
                className={`transition-all ${
                  idx === currentSlide
                    ? 'bg-primary w-8 h-3 rounded-full'
                    : 'bg-gray-300 w-3 h-3 rounded-full hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(1)}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-primary/10 hover:bg-primary hover:text-white text-primary"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </div>
  )
}

export default ArchitectureCarousel
