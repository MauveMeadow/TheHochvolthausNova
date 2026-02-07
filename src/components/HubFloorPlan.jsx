import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Users, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react'

// Floor data with rooms and their CSS Grid positions
const FLOOR_DATA = {
  basement: {
    id: 'basement',
    name: 'Under Ground',
    short: 'UG',
    level: -1,
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
  ground: {
    id: 'ground',
    name: 'Ground Floor',
    short: 'GR',
    level: 0,
    totalArea: '1,396.57 m²',
    gridTemplate: { rows: 8, cols: 10 },
    rooms: [
      { id: 'g1', name: 'Exhibition', type: 'Common', capacity: 60, cssArea: '1 / 1 / 4 / 4', events: [{ title: 'Art Exhibition Opening', date: 'Nov 15, 2025' }] },
      { id: 'g2', name: 'Room 1', type: 'Office', capacity: 8, cssArea: '1 / 4 / 2 / 5', events: [] },
      { id: 'g3', name: 'Provo', type: 'Lab', capacity: 6, cssArea: '1 / 5 / 2 / 6', events: [] },
      { id: 'g4', name: 'Exhibition Storage', type: 'Storage', capacity: 4, cssArea: '1 / 6 / 2 / 8', events: [] },
      { id: 'g5', name: 'Room 2', type: 'Office', capacity: 8, cssArea: '2 / 4 / 3 / 6', events: [] },
      { id: 'g6', name: 'Café', type: 'Amenity', capacity: 30, cssArea: '1 / 8 / 3 / 11', events: [{ title: 'Coffee Tasting', date: 'Nov 8, 2025' }] },
      { id: 'g7', name: 'Corridor', type: 'Common', capacity: 0, cssArea: '3 / 8 / 4 / 11', events: [] },
      { id: 'g8', name: 'Lounge Area', type: 'Amenity', capacity: 20, cssArea: '4 / 1 / 6 / 3', events: [] },
      { id: 'g9', name: 'Amphitheater', type: 'Meeting', capacity: 120, cssArea: '4 / 3 / 7 / 8', events: [{ title: 'Guest Lecture', date: 'Nov 20, 2025' }] },
      { id: 'g10', name: 'Reading Area', type: 'Amenity', capacity: 15, cssArea: '5 / 8 / 7 / 11', events: [] },
      { id: 'g11', name: 'Seating Area', type: 'Common', capacity: 25, cssArea: '6 / 1 / 8 / 3', events: [] },
      { id: 'g12', name: 'Info Desk', type: 'Office', capacity: 4, cssArea: '7 / 8 / 8 / 11', events: [] },
      { id: 'g13', name: 'Main Entrance', type: 'Common', capacity: 40, cssArea: '8 / 1 / 9 / 11', events: [] }
    ]
  },
  mezzanine: {
    id: 'mezzanine',
    name: 'Mezzanine',
    short: 'MZ',
    level: 0.5,
    totalArea: '320 m²',
    gridTemplate: { rows: 1, cols: 1 },
    rooms: [
      { id: 'm1', name: 'Corridor', type: 'Common', capacity: 50, cssArea: '1 / 1 / 2 / 2', events: [] }
    ]
  },
  first: {
    id: 'first',
    name: 'First Floor',
    short: 'FI',
    level: 1,
    totalArea: '720 m²',
    gridTemplate: { rows: 5, cols: 7 },
    rooms: [
      { id: 'f1', name: 'Lecture Hall', type: 'Meeting', capacity: 80, cssArea: '1 / 1 / 3 / 2', events: [{ title: 'Guest Lecture', date: 'Nov 20, 2025' }] },
      { id: 'f2', name: 'Office 1', type: 'Office', capacity: 6, cssArea: '1 / 2 / 2 / 3', events: [] },
      { id: 'f3', name: 'Office 2', type: 'Office', capacity: 6, cssArea: '1 / 3 / 2 / 4', events: [] },
      { id: 'f4', name: 'Office 3', type: 'Office', capacity: 6, cssArea: '1 / 4 / 2 / 5', events: [] },
      { id: 'f5', name: 'Office 4', type: 'Office', capacity: 6, cssArea: '1 / 5 / 2 / 6', events: [] },
      { id: 'f6', name: 'Core Area', type: 'Common', capacity: 30, cssArea: '2 / 2 / 4 / 4', events: [] },
      { id: 'f7', name: 'Open Office', type: 'Office', capacity: 40, cssArea: '2 / 4 / 5 / 7', events: [] },
      { id: 'f8', name: 'Meeting Room 1', type: 'Meeting', capacity: 8, cssArea: '3 / 1 / 4 / 2', events: [] },
      { id: 'f9', name: 'Meeting Room 2', type: 'Meeting', capacity: 8, cssArea: '3 / 2 / 4 / 3', events: [{ title: 'Team Meeting', date: 'Nov 10, 2025' }] },
      { id: 'f10', name: 'Meeting Room 3', type: 'Meeting', capacity: 8, cssArea: '4 / 1 / 5 / 2', events: [] },
      { id: 'f11', name: 'Meeting Room 4', type: 'Meeting', capacity: 8, cssArea: '4 / 2 / 5 / 3', events: [] },
      { id: 'f12', name: 'Meeting Room 5', type: 'Meeting', capacity: 8, cssArea: '5 / 1 / 6 / 2', events: [] },
      { id: 'f13', name: 'Meeting Room 6', type: 'Meeting', capacity: 8, cssArea: '5 / 2 / 6 / 3', events: [] },
      { id: 'f14', name: 'Meeting Room 7', type: 'Meeting', capacity: 10, cssArea: '3 / 3 / 6 / 4', events: [] },
      { id: 'f15', name: 'Meeting Room 8', type: 'Meeting', capacity: 10, cssArea: '3 / 4 / 6 / 5', events: [] },
      { id: 'f16', name: 'Meeting Room 9', type: 'Meeting', capacity: 10, cssArea: '3 / 5 / 6 / 6', events: [] },
      { id: 'f17', name: 'Office Space 1', type: 'Office', capacity: 12, cssArea: '3 / 6 / 4 / 7', events: [] },
      { id: 'f18', name: 'Office Space 2', type: 'Office', capacity: 12, cssArea: '4 / 6 / 5 / 7', events: [] },
      { id: 'f19', name: 'Office Space 3', type: 'Office', capacity: 12, cssArea: '5 / 6 / 6 / 7', events: [] }
    ]
  },
  second: {
    id: 'second',
    name: 'Second Floor',
    short: 'SE',
    level: 2,
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
  third: {
    id: 'third',
    name: 'Third Floor',
    short: 'TH',
    level: 3,
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
  roof: {
    id: 'roof',
    name: 'Roof',
    short: 'RF',
    level: 4,
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

const LEVEL_ORDER = ['basement', 'ground', 'mezzanine', 'first', 'second', 'third', 'roof']

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

function HubFloorPlan() {
  const [currentLevel, setCurrentLevel] = useState('ground')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showStats, setShowStats] = useState(false)

  const floor = FLOOR_DATA[currentLevel]

  // Get all events for the current floor
  const getAllEvents = () => {
    const events = []
    floor.rooms.forEach(room => {
      room.events.forEach(event => {
        events.push({ ...event, room: room.name })
      })
    })
    return events
  }

  // Room statistics
  const getRoomStats = () => {
    const stats = { total: floor.rooms.length, byType: {} }
    floor.rooms.forEach(room => {
      stats.byType[room.type] = (stats.byType[room.type] || 0) + 1
    })
    return stats
  }

  const handleRoomClick = (room) => {
    setSelectedRoom(room.id === selectedRoom?.id ? null : room)
  }

  return (
    <div className="hub-floor-plan">
      {/* Level Tabs */}
      <div className="floor-tabs">
        {LEVEL_ORDER.map(levelKey => {
          const level = FLOOR_DATA[levelKey]
          return (
            <button
              key={levelKey}
              className={`floor-tab ${currentLevel === levelKey ? 'active' : ''}`}
              onClick={() => {
                setCurrentLevel(levelKey)
                setSelectedRoom(null)
              }}
            >
              <span className="floor-tab-name">{level.short || level.name}</span>
              <span className="floor-tab-level">Level {level.level}</span>
            </button>
          )
        })}
      </div>

      <div className="floor-content">
        {/* Blueprint Area */}
        <div className="blueprint-container">
          <div className="blueprint-header">
            <h3>Interactive Floor Plan</h3>
            <p>Click on any room to view or add events</p>
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
                    borderColor: isSelected ? '#001960' : colors.border
                  }}
                  onClick={() => handleRoomClick(room)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  layout
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

          <div className="blueprint-footer">
            <span>Total Floor Area: {floor.totalArea}</span>
            <span>|</span>
            <span>Floor: {floor.short || floor.name}</span>
          </div>
        </div>

        {/* Side Panel */}
        <div className="side-panel">
          <AnimatePresence mode="wait">
            {selectedRoom ? (
              <motion.div
                key={selectedRoom.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="room-details"
              >
                <div className="room-details-header">
                  <h3>{selectedRoom.name}</h3>
                  <div className="room-actions">
                    <button className="btn btn-primary room-book-btn">
                      <Calendar size={16} />
                      Book Room
                    </button>
                    <button className="btn btn-secondary room-event-btn">
                      + Event
                    </button>
                  </div>
                </div>

                <div className="room-info-cards">
                  <div className="info-card">
                    <MapPin size={18} />
                    <div>
                      <span className="info-label">Type</span>
                      <span className="info-value">{selectedRoom.type}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <Users size={18} />
                    <div>
                      <span className="info-label">Capacity</span>
                      <span className="info-value">{selectedRoom.capacity} people</span>
                    </div>
                  </div>
                </div>

                <div className="room-section">
                  <h4><Calendar size={16} /> Room Bookings</h4>
                  <div className="bookings-placeholder">
                    <div className="calendar-icon-large">
                      <Calendar size={32} strokeWidth={1} />
                    </div>
                    <p>No bookings for this room yet</p>
                  </div>
                </div>

                <div className="room-section">
                  <h4><Clock size={16} /> Scheduled Events</h4>
                  {selectedRoom.events.length > 0 ? (
                    <ul className="events-list">
                      {selectedRoom.events.map((event, idx) => (
                        <li key={idx} className="event-item">
                          <span className="event-title">{event.title}</span>
                          <span className="event-date">{event.date}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-events">No events scheduled</p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="default-panel"
              >
                <div className="default-panel-icon">
                  <MapPin size={48} strokeWidth={1} />
                </div>
                <h3>Select a Room</h3>
                <p>Click on any room in the floor plan to view details, check availability, and schedule events.</p>

                <div className="floor-summary">
                  <h4>All Events ({getAllEvents().length})</h4>
                  {getAllEvents().length > 0 ? (
                    <ul className="events-list">
                      {getAllEvents().slice(0, 5).map((event, idx) => (
                        <li key={idx} className="event-item">
                          <span className="event-title">{event.title}</span>
                          <span className="event-room">{event.room} - {event.date}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-events">No events on this floor</p>
                  )}
                </div>

                <div className="room-stats-section">
                  <button 
                    className="stats-toggle"
                    onClick={() => setShowStats(!showStats)}
                  >
                    <span className="stats-dots">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot blue"></span>
                    </span>
                    Room Statistics
                    {showStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  {showStats && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="stats-content"
                    >
                      {Object.entries(getRoomStats().byType).map(([type, count]) => (
                        <div key={type} className="stat-row">
                          <span 
                            className="stat-color"
                            style={{ backgroundColor: getRoomColor(type).border }}
                          ></span>
                          <span className="stat-type">{type}</span>
                          <span className="stat-count">{count}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default HubFloorPlan
