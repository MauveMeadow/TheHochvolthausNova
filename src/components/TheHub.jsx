import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Home, Layers, X, Calendar, Users, Clock, MapPin, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react'

// Floor data with rooms integrated
const FLOOR_DATA_INITIAL = {
  1: {
    id: 'basement',
    name: 'Under Ground',
    short: 'UG',
    level: 'Level 1',
    description: 'Study rooms, theatre and workspaces',
    color: '#ef4444',
    totalArea: '1,350.75 m²',
    gridTemplate: { rows: 9, cols: 14 },
    rooms: [
      // TOP ROW - Individual Study Rooms (Row 1)
      { id: 'b1', name: 'Individual Study 1', type: 'Office', capacity: 5, cssArea: '1 / 1 / 2 / 2', events: [] },
      { id: 'b2', name: 'Individual Study 2', type: 'Office', capacity: 5, cssArea: '1 / 2 / 2 / 3', events: [] },
      { id: 'b3', name: 'Individual Study 3', type: 'Office', capacity: 5, cssArea: '1 / 3 / 2 / 4', events: [] },
      { id: 'b4', name: 'Individual Study 4', type: 'Office', capacity: 5, cssArea: '1 / 4 / 2 / 5', events: [] },
      { id: 'b5', name: 'Individual Study 5', type: 'Office', capacity: 5, cssArea: '1 / 5 / 2 / 6', events: [] },
      { id: 'b6', name: 'Individual Study 6', type: 'Office', capacity: 5, cssArea: '1 / 6 / 2 / 7', events: [] },
      { id: 'b7', name: 'Individual Study 7', type: 'Office', capacity: 6, cssArea: '1 / 7 / 2 / 8', events: [] },
      { id: 'b8', name: 'Individual Study 8', type: 'Office', capacity: 6, cssArea: '1 / 8 / 2 / 9', events: [] },
      { id: 'b9', name: 'Individual Study 9', type: 'Office', capacity: 6, cssArea: '1 / 9 / 2 / 10', events: [] },
      { id: 'b10', name: 'Individual Study 10', type: 'Office', capacity: 6, cssArea: '1 / 10 / 2 / 11', events: [] },
      { id: 'b11', name: 'Group Study 1', type: 'Meeting', capacity: 8, cssArea: '1 / 11 / 2 / 12', events: [] },
      { id: 'b12', name: 'Group Study 2', type: 'Meeting', capacity: 8, cssArea: '1 / 12 / 2 / 13', events: [] },
      { id: 'b13', name: 'Group Study 3', type: 'Meeting', capacity: 8, cssArea: '1 / 13 / 2 / 15', events: [] },
      
      // SECOND ROW - Double Study & Recording Rooms (Row 2-3)
      { id: 'b14', name: 'Recording Room 1', type: 'Lab', capacity: 3, cssArea: '2 / 1 / 4 / 2', events: [] },
      { id: 'b15', name: 'Double Study 1', type: 'Office', capacity: 6, cssArea: '2 / 2 / 3 / 4', events: [] },
      { id: 'b16', name: 'Double Study 2', type: 'Office', capacity: 6, cssArea: '3 / 2 / 4 / 4', events: [] },
      { id: 'b17', name: 'Double Study 3', type: 'Office', capacity: 6, cssArea: '2 / 4 / 3 / 6', events: [] },
      { id: 'b18', name: 'Double Study 4', type: 'Office', capacity: 8, cssArea: '3 / 4 / 4 / 6', events: [] },
      { id: 'b19', name: 'Double Study 5', type: 'Office', capacity: 6, cssArea: '2 / 6 / 4 / 8', events: [] },
      { id: 'b20', name: 'Editing Room 1', type: 'Lab', capacity: 2, cssArea: '2 / 10 / 3 / 11', events: [] },
      { id: 'b21', name: 'Editing Room 2', type: 'Lab', capacity: 2, cssArea: '2 / 11 / 3 / 12', events: [] },
      { id: 'b22', name: 'Editing Room 3', type: 'Lab', capacity: 3, cssArea: '3 / 10 / 4 / 11', events: [] },
      { id: 'b23', name: 'Editing Room 4', type: 'Lab', capacity: 3, cssArea: '3 / 11 / 4 / 12', events: [] },
      { id: 'b24', name: 'Server Room 1', type: 'Utility', capacity: 2, cssArea: '2 / 12 / 3 / 15', events: [] },
      { id: 'b25', name: 'Server Room 2', type: 'Utility', capacity: 2, cssArea: '3 / 12 / 4 / 15', events: [] },
      
      // MIDDLE SECTION - AR/VR Rooms & Circulation (Row 4)
      { id: 'b26', name: 'Storage Room', type: 'Storage', capacity: 10, cssArea: '4 / 1 / 5 / 3', events: [] },
      { id: 'b27', name: 'AR/VR Room 3', type: 'Lab', capacity: 10, cssArea: '4 / 4 / 5 / 7', events: [] },
      { id: 'b28', name: 'AR/VR Room 4', type: 'Lab', capacity: 10, cssArea: '4 / 7 / 5 / 10', events: [] },
      { id: 'b29', name: 'Electrical Room', type: 'Utility', capacity: 3, cssArea: '4 / 12 / 5 / 15', events: [] },
      
      // LEFT SIDE - Offices (Rows 5-8)
      { id: 'b30', name: 'Printing Room', type: 'Utility', capacity: 6, cssArea: '5 / 1 / 6 / 3', events: [] },
      { id: 'b31', name: 'Creativity Room', type: 'Lab', capacity: 15, cssArea: '6 / 1 / 7 / 3', events: [] },
      { id: 'b32', name: 'Computer Room 1', type: 'Lab', capacity: 25, cssArea: '7 / 1 / 9 / 3', events: [] },
      
      // CENTER - Open Theatre (Main Feature)
      { id: 'b33', name: 'Open Theatre', type: 'Amenity', capacity: 200, cssArea: '5 / 3 / 10 / 12', events: [{ title: 'Grand Opening', date: 'Nov 28, 2025' }, { title: 'Live Performance', date: 'Dec 5, 2025' }] },
      
      // RIGHT SIDE - Computer Rooms (Rows 5-8)
      { id: 'b34', name: 'Computer Room 3', type: 'Lab', capacity: 20, cssArea: '5 / 12 / 7 / 15', events: [] },
      { id: 'b35', name: 'Computer Room 4', type: 'Lab', capacity: 20, cssArea: '7 / 12 / 9 / 15', events: [] },
      
      // BOTTOM ROW - Foyer (Row 9)
      { id: 'b36', name: 'Foyer', type: 'Common', capacity: 80, cssArea: '9 / 1 / 10 / 15', events: [] }
    ]
  },
  2: {
    id: 'ground',
    name: 'Ground Floor',
    short: 'GR',
    level: 'Level 2',
    description: 'Main entrance and lobby',
    color: '#22c55e',
    totalArea: '1,396.57 m²',
    gridTemplate: { rows: 4, cols: 4 },
    rooms: [
      { id: 'g1', name: 'Main Lobby', type: 'Common', capacity: 50, cssArea: '1 / 1 / 3 / 3', events: [{ title: 'Welcome Reception', date: 'Nov 15, 2025' }] },
      { id: 'g2', name: 'Reception', type: 'Office', capacity: 4, cssArea: '1 / 3 / 2 / 5', events: [] },
      { id: 'g3', name: 'Security Office', type: 'Office', capacity: 3, cssArea: '2 / 3 / 3 / 4', events: [] },
      { id: 'g4', name: 'Mail Room', type: 'Utility', capacity: 2, cssArea: '2 / 4 / 3 / 5', events: [] },
      { id: 'g5', name: 'Café', type: 'Amenity', capacity: 30, cssArea: '3 / 1 / 5 / 3', events: [{ title: 'Coffee Tasting', date: 'Nov 8, 2025' }] },
      { id: 'g6', name: 'Meeting Room A', type: 'Meeting', capacity: 12, cssArea: '3 / 3 / 4 / 5', events: [{ title: 'Team Standup', date: 'Nov 9, 2025' }] },
      { id: 'g7', name: 'Restrooms', type: 'Utility', capacity: 0, cssArea: '4 / 3 / 5 / 5', events: [] }
    ]
  },
  3: {
    id: 'mezzanine',
    name: 'Mezzanine',
    short: 'MZ',
    level: 'Level 3',
    description: 'Gallery and workspace',
    color: '#eab308',
    totalArea: '320 m²',
    gridTemplate: { rows: 3, cols: 3 },
    rooms: [
      { id: 'm1', name: 'Open Workspace', type: 'Office', capacity: 25, cssArea: '1 / 1 / 3 / 3', events: [] },
      { id: 'm2', name: 'Phone Booths', type: 'Meeting', capacity: 4, cssArea: '1 / 3 / 2 / 4', events: [] },
      { id: 'm3', name: 'Quiet Zone', type: 'Office', capacity: 10, cssArea: '2 / 3 / 4 / 4', events: [{ title: 'Focus Hours', date: 'Daily' }] },
      { id: 'm4', name: 'Lounge', type: 'Amenity', capacity: 15, cssArea: '3 / 1 / 4 / 3', events: [] }
    ]
  },
  4: {
    id: 'first',
    name: 'First Floor',
    short: 'FI',
    level: 'Level 4',
    description: 'Main offices',
    color: '#14b8a6',
    totalArea: '720 m²',
    gridTemplate: { rows: 4, cols: 4 },
    rooms: [
      { id: 'f1', name: 'Open Office A', type: 'Office', capacity: 40, cssArea: '1 / 1 / 3 / 3', events: [] },
      { id: 'f2', name: 'Meeting Room B', type: 'Meeting', capacity: 8, cssArea: '1 / 3 / 2 / 4', events: [{ title: 'Project Review', date: 'Nov 11, 2025' }] },
      { id: 'f3', name: 'Meeting Room C', type: 'Meeting', capacity: 8, cssArea: '1 / 4 / 2 / 5', events: [] },
      { id: 'f4', name: 'Break Room', type: 'Amenity', capacity: 20, cssArea: '2 / 3 / 3 / 5', events: [] },
      { id: 'f5', name: 'Open Office B', type: 'Office', capacity: 35, cssArea: '3 / 1 / 5 / 3', events: [] },
      { id: 'f6', name: 'Server Room', type: 'Utility', capacity: 2, cssArea: '3 / 3 / 4 / 4', events: [{ title: 'Hardware Update', date: 'Nov 20, 2025' }] },
      { id: 'f7', name: 'IT Support', type: 'Office', capacity: 6, cssArea: '3 / 4 / 5 / 5', events: [] },
      { id: 'f8', name: 'Restrooms', type: 'Utility', capacity: 0, cssArea: '4 / 3 / 5 / 4', events: [] }
    ]
  },
  5: {
    id: 'second',
    name: 'Second Floor',
    short: 'SE',
    level: 'Level 5',
    description: 'Private workspaces',
    color: '#3b82f6',
    totalArea: '720 m²',
    gridTemplate: { rows: 4, cols: 4 },
    rooms: [
      { id: 's1', name: 'Conference Hall', type: 'Meeting', capacity: 60, cssArea: '1 / 1 / 3 / 3', events: [{ title: 'Quarterly Review', date: 'Nov 25, 2025' }, { title: 'Town Hall', date: 'Dec 1, 2025' }] },
      { id: 's2', name: 'Boardroom', type: 'Meeting', capacity: 16, cssArea: '1 / 3 / 2 / 5', events: [{ title: 'Board Meeting', date: 'Nov 18, 2025' }] },
      { id: 's3', name: 'Executive Suite', type: 'Office', capacity: 5, cssArea: '2 / 3 / 3 / 5', events: [] },
      { id: 's4', name: 'Training Room', type: 'Meeting', capacity: 30, cssArea: '3 / 1 / 5 / 3', events: [{ title: 'New Hire Onboarding', date: 'Nov 14, 2025' }] },
      { id: 's5', name: 'Media Room', type: 'Amenity', capacity: 12, cssArea: '3 / 3 / 4 / 5', events: [] },
      { id: 's6', name: 'Wellness Room', type: 'Amenity', capacity: 6, cssArea: '4 / 3 / 5 / 5', events: [] }
    ]
  },
  6: {
    id: 'third',
    name: 'Third Floor',
    short: 'TH',
    level: 'Level 6',
    description: 'Executive offices',
    color: '#8b5cf6',
    totalArea: '580 m²',
    gridTemplate: { rows: 3, cols: 4 },
    rooms: [
      { id: 't1', name: 'Research Lab', type: 'Lab', capacity: 15, cssArea: '1 / 1 / 2 / 3', events: [{ title: 'Lab Safety Training', date: 'Nov 16, 2025' }] },
      { id: 't2', name: 'Testing Area', type: 'Lab', capacity: 8, cssArea: '1 / 3 / 2 / 5', events: [] },
      { id: 't3', name: 'Equipment Storage', type: 'Storage', capacity: 4, cssArea: '2 / 1 / 3 / 2', events: [] },
      { id: 't4', name: 'Analysis Room', type: 'Lab', capacity: 6, cssArea: '2 / 2 / 3 / 4', events: [{ title: 'Data Analysis Session', date: 'Nov 13, 2025' }] },
      { id: 't5', name: 'Clean Room', type: 'Lab', capacity: 4, cssArea: '2 / 4 / 4 / 5', events: [] },
      { id: 't6', name: 'Prep Area', type: 'Utility', capacity: 3, cssArea: '3 / 1 / 4 / 4', events: [] }
    ]
  },
  7: {
    id: 'roof',
    name: 'Roof',
    short: 'RF',
    level: 'Level 7',
    description: 'Rooftop terrace and utilities',
    color: '#6366f1',
    totalArea: '400 m²',
    gridTemplate: { rows: 3, cols: 3 },
    rooms: [
      { id: 'r1', name: 'Rooftop Garden', type: 'Amenity', capacity: 40, cssArea: '1 / 1 / 3 / 3', events: [{ title: 'Summer BBQ', date: 'Jul 15, 2026' }] },
      { id: 'r2', name: 'Solar Panel Array', type: 'Utility', capacity: 0, cssArea: '1 / 3 / 2 / 4', events: [] },
      { id: 'r3', name: 'HVAC Units', type: 'Utility', capacity: 0, cssArea: '2 / 3 / 3 / 4', events: [{ title: 'HVAC Maintenance', date: 'Nov 22, 2025' }] },
      { id: 'r4', name: 'Observation Deck', type: 'Amenity', capacity: 20, cssArea: '3 / 1 / 4 / 4', events: [] }
    ]
  }
}

// Room type colors
const getRoomColor = (type) => {
  const colors = {
    Storage: { bg: 'rgba(156, 163, 175, 0.3)', border: '#6b7280' },
    Parking: { bg: 'rgba(156, 163, 175, 0.3)', border: '#6b7280' },
    Utility: { bg: 'rgba(156, 163, 175, 0.4)', border: '#6b7280' },
    Office: { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6' },
    Meeting: { bg: 'rgba(34, 197, 94, 0.15)', border: '#22c55e' },
    Common: { bg: 'rgba(251, 191, 36, 0.15)', border: '#f59e0b' },
    Amenity: { bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7' },
    Lab: { bg: 'rgba(6, 182, 212, 0.15)', border: '#06b6d4' }
  }
  return colors[type] || { bg: '#e5e7eb', border: '#1f2937' }
}

function TheHub() {
  const [floorData, setFloorData] = useState(FLOOR_DATA_INITIAL)
  const [expandedFloor, setExpandedFloor] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [showLevelList, setShowLevelList] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    attendees: 1,
    title: ''
  })
  const [bookingError, setBookingError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleFloorClick = (floorId) => {
    if (expandedFloor === floorId) {
      setExpandedFloor(null)
      setSelectedRoom(null)
    } else {
      setExpandedFloor(floorId)
      setSelectedRoom(null)
    }
  }

  const handleRoomClick = (room, e) => {
    e.stopPropagation()
    setSelectedRoom(selectedRoom?.id === room.id ? null : room)
  }

  const openBookingModal = (e) => {
    e.stopPropagation()
    setBookingForm({
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      attendees: 1,
      title: ''
    })
    setBookingError('')
    setBookingModalOpen(true)
  }

  const closeBookingModal = () => {
    setBookingModalOpen(false)
    setBookingError('')
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    
    // Validate attendees
    if (bookingForm.attendees > selectedRoom.capacity) {
      setBookingError(`Error: Room only holds ${selectedRoom.capacity} people`)
      return
    }

    // Validate times
    if (bookingForm.startTime >= bookingForm.endTime) {
      setBookingError('Error: End time must be after start time')
      return
    }

    if (!bookingForm.title.trim()) {
      setBookingError('Error: Please enter a booking title')
      return
    }

    // Create new event
    const formattedDate = new Date(bookingForm.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    
    const newEvent = {
      title: bookingForm.title,
      date: formattedDate,
      time: `${bookingForm.startTime} - ${bookingForm.endTime}`,
      attendees: bookingForm.attendees
    }

    // Update floor data with new event
    setFloorData(prevData => {
      const newData = { ...prevData }
      const floorId = expandedFloor
      const roomIndex = newData[floorId].rooms.findIndex(r => r.id === selectedRoom.id)
      if (roomIndex !== -1) {
        newData[floorId] = {
          ...newData[floorId],
          rooms: newData[floorId].rooms.map((room, idx) => 
            idx === roomIndex 
              ? { ...room, events: [...room.events, newEvent] }
              : room
          )
        }
        // Update selected room to reflect new event
        setSelectedRoom({
          ...selectedRoom,
          events: [...selectedRoom.events, newEvent]
        })
      }
      return newData
    })

    // Close modal and show success
    setBookingModalOpen(false)
    setSuccessMessage(`Booking Confirmed for ${formattedDate} at ${bookingForm.startTime} - ${bookingForm.endTime}`)
    
    // Clear success message after 4 seconds
    setTimeout(() => {
      setSuccessMessage('')
    }, 4000)
  }

  const handleAttendeesChange = (value) => {
    const attendees = parseInt(value) || 0
    setBookingForm({ ...bookingForm, attendees })
    
    if (selectedRoom && attendees > selectedRoom.capacity) {
      setBookingError(`Error: Room only holds ${selectedRoom.capacity} people`)
    } else {
      setBookingError('')
    }
  }

  const floors = Object.entries(floorData).map(([id, data]) => ({
    id: parseInt(id),
    ...data
  })).sort((a, b) => b.id - a.id)

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
            Interactive Hub
          </p>
          <h1 className="mb-6">The Hub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore each floor of the Hochvolthaus. Click on any level to discover 
            the spatial organization and functional areas within.
          </p>
        </div>

        {/* Master Toggle Button */}
        <div className="building-levels-toggle mb-8">
          <button 
            className="building-levels-btn"
            onClick={() => setShowLevelList(!showLevelList)}
          >
            <span className="btn-icon">🏢</span>
            <span className="btn-text">Building Levels</span>
            <span className="btn-count">{floors.length} floors</span>
            <ChevronDown 
              className={`btn-chevron ${showLevelList ? 'rotated' : ''}`} 
              size={24} 
            />
          </button>
        </div>

        {/* Floor List - Conditionally Rendered */}
        <AnimatePresence>
          {showLevelList && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="floor-list-container mb-16"
            >
              <div className="floor-list">
                {floors.map((floor, index) => (
            <motion.div
              key={floor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className={`floor-card-expandable ${expandedFloor === floor.id ? 'expanded' : ''}`}
              style={{ '--floor-color': floor.color }}
            >
              {/* Floor Header - Clickable */}
              <div 
                className="floor-card-header"
                onClick={() => handleFloorClick(floor.id)}
              >
                <div className="floor-card-info">
                  <div 
                    className="floor-number"
                    style={{ backgroundColor: floor.color }}
                  >
                    <span>{floor.id}</span>
                  </div>
                  <div className="floor-details">
                    <span className="floor-level-label">{floor.level}</span>
                    <h3>{floor.name}</h3>
                    <p>{floor.description}</p>
                  </div>
                </div>
                <div className="floor-card-action">
                  <span className="floor-area">{floor.totalArea}</span>
                  <div className="floor-expand-icon" style={{ color: floor.color }}>
                    {expandedFloor === floor.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>
              </div>

              {/* Floor Content - Expandable */}
              <AnimatePresence>
                {expandedFloor === floor.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="floor-card-content"
                  >
                    <div className="floor-plan-wrapper">
                      {/* Blueprint */}
                      <div className="blueprint-section">
                        <div className="blueprint-header">
                          <h4>Floor Plan</h4>
                          <p>Click on any room to view details</p>
                        </div>
                        <div 
                          className="blueprint-grid"
                          style={{
                            gridTemplateRows: `repeat(${floor.gridTemplate.rows}, 1fr)`,
                            gridTemplateColumns: `repeat(${floor.gridTemplate.cols}, 1fr)`
                          }}
                        >
                          {floor.rooms.map(room => {
                            const colors = getRoomColor(room.type)
                            const isSelected = selectedRoom?.id === room.id
                            const hasEvents = room.events.length > 0

                            return (
                              <motion.div
                                key={room.id}
                                className={`blueprint-room ${isSelected ? 'selected' : ''}`}
                                style={{
                                  gridArea: room.cssArea,
                                  backgroundColor: colors.bg,
                                  borderColor: isSelected ? floor.color : colors.border
                                }}
                                onClick={(e) => handleRoomClick(room, e)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className="room-name">{room.name}</span>
                                {hasEvents && (
                                  <span className="room-event-badge">
                                    {room.events.length} event{room.events.length > 1 ? 's' : ''}
                                  </span>
                                )}
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Room Details Panel */}
                      <div className="room-details-panel">
                        <AnimatePresence mode="wait">
                          {selectedRoom ? (
                            <motion.div
                              key={selectedRoom.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="room-info-content"
                            >
                              <div className="room-info-header">
                                <h4>{selectedRoom.name}</h4>
                                <button 
                                  className="close-room-btn"
                                  onClick={(e) => { e.stopPropagation(); setSelectedRoom(null); }}
                                >
                                  <X size={18} />
                                </button>
                              </div>

                              <div className="room-meta">
                                <div className="meta-item">
                                  <MapPin size={16} />
                                  <span>{selectedRoom.type}</span>
                                </div>
                                <div className="meta-item">
                                  <Users size={16} />
                                  <span>{selectedRoom.capacity} people</span>
                                </div>
                              </div>

                              <div className="room-events-section">
                                <h5><Clock size={14} /> Scheduled Events</h5>
                                {selectedRoom.events.length > 0 ? (
                                  <ul className="mini-events-list">
                                    {selectedRoom.events.map((event, idx) => (
                                      <li key={idx}>
                                        <span className="event-name">{event.title}</span>
                                        <span className="event-date">{event.date}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="no-events-text">No events scheduled</p>
                                )}
                              </div>

                              <button 
                                className="btn btn-primary book-room-btn"
                                style={{ backgroundColor: floor.color }}
                                onClick={openBookingModal}
                              >
                                <Calendar size={16} />
                                Book Room
                              </button>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="placeholder"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="room-placeholder"
                            >
                              <MapPin size={32} strokeWidth={1} />
                              <p>Select a room to view details</p>
                              <span className="room-count">{floor.rooms.length} rooms on this floor</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Room Type Legend */}
                    <div className="floor-legend">
                      <span className="legend-title">Room Types:</span>
                      {[...new Set(floor.rooms.map(r => r.type))].map(type => (
                        <span key={type} className="legend-item">
                          <span 
                            className="legend-dot" 
                            style={{ backgroundColor: getRoomColor(type).border }}
                          ></span>
                          {type}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Building Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-secondary rounded-2xl p-8 lg:p-12"
        >
          <div className="grid grid-cols-3 gap-6 lg:gap-12 text-center">
            <div>
              <p className="text-4xl font-medium text-primary mb-2">7</p>
              <p className="text-sm text-muted-foreground">Levels</p>
            </div>
            <div className="border-l border-r border-black/5">
              <p className="text-4xl font-medium text-primary mb-2">~32m</p>
              <p className="text-sm text-muted-foreground">Height</p>
            </div>
            <div>
              <p className="text-4xl font-medium text-primary mb-2">9,730m²</p>
              <p className="text-sm text-muted-foreground">Total Area</p>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            <strong>Tip:</strong> Click on any floor level to expand and explore the interactive floor plan.
            Select a room to view its details and book it.
          </p>
        </motion.div>
      </motion.div>

      {/* Success Message Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="success-toast"
          >
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModalOpen && selectedRoom && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBookingModal}
          >
            <motion.div
              className="modal-content booking-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeBookingModal}>
                <X size={20} />
              </button>

              <div className="modal-header">
                <h3>Book {selectedRoom.name}</h3>
                <p className="capacity-info">
                  <Users size={16} />
                  Maximum Capacity: <strong>{selectedRoom.capacity} people</strong>
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="form-group">
                  <label htmlFor="bookingTitle">
                    <Calendar size={16} />
                    Booking Title
                  </label>
                  <input
                    type="text"
                    id="bookingTitle"
                    value={bookingForm.title}
                    onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })}
                    placeholder="e.g., Team Meeting, Workshop"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bookingDate">
                    <Calendar size={16} />
                    Date
                  </label>
                  <input
                    type="date"
                    id="bookingDate"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startTime">
                      <Clock size={16} />
                      Start Time
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      value={bookingForm.startTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">
                      <Clock size={16} />
                      End Time
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      value={bookingForm.endTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="attendees">
                    <Users size={16} />
                    Number of Attendees
                  </label>
                  <input
                    type="number"
                    id="attendees"
                    min="1"
                    max={selectedRoom.capacity}
                    value={bookingForm.attendees}
                    onChange={(e) => handleAttendeesChange(e.target.value)}
                    required
                  />
                  {bookingForm.attendees > selectedRoom.capacity && (
                    <span className="field-warning">
                      <AlertCircle size={14} />
                      Exceeds room capacity
                    </span>
                  )}
                </div>

                {bookingError && (
                  <div className="booking-error">
                    <AlertCircle size={16} />
                    {bookingError}
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeBookingModal}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={bookingForm.attendees > selectedRoom.capacity}
                  >
                    <CheckCircle size={16} />
                    Confirm Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TheHub
