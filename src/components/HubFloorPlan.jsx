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
    gridTemplate: { rows: 4, cols: 3 },
    rooms: [
      { id: 'b1', name: 'Storage Room', type: 'Storage', capacity: 5, cssArea: '1 / 1 / 3 / 2', events: [{ title: 'Storage Inventory', date: 'Nov 12, 2025' }] },
      { id: 'b2', name: 'Parking Area', type: 'Parking', capacity: 20, cssArea: '1 / 2 / 4 / 4', events: [] },
      { id: 'b3', name: 'Mechanical Room', type: 'Utility', capacity: 3, cssArea: '3 / 1 / 5 / 2', events: [{ title: 'Maintenance Check', date: 'Nov 10, 2025' }] },
      { id: 'b4', name: 'Electrical Room', type: 'Utility', capacity: 2, cssArea: '4 / 2 / 5 / 3', events: [] },
      { id: 'b5', name: 'Archive', type: 'Storage', capacity: 4, cssArea: '4 / 3 / 5 / 4', events: [] }
    ]
  },
  ground: {
    id: 'ground',
    name: 'Ground Floor',
    short: 'GR',
    level: 0,
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
  mezzanine: {
    id: 'mezzanine',
    name: 'Mezzanine',
    short: 'MZ',
    level: 0.5,
    totalArea: '320 m²',
    gridTemplate: { rows: 3, cols: 3 },
    rooms: [
      { id: 'm1', name: 'Open Workspace', type: 'Office', capacity: 25, cssArea: '1 / 1 / 3 / 3', events: [] },
      { id: 'm2', name: 'Phone Booths', type: 'Meeting', capacity: 4, cssArea: '1 / 3 / 2 / 4', events: [] },
      { id: 'm3', name: 'Quiet Zone', type: 'Office', capacity: 10, cssArea: '2 / 3 / 4 / 4', events: [{ title: 'Focus Hours', date: 'Daily' }] },
      { id: 'm4', name: 'Lounge', type: 'Amenity', capacity: 15, cssArea: '3 / 1 / 4 / 3', events: [] }
    ]
  },
  first: {
    id: 'first',
    name: 'First Floor',
    short: 'FI',
    level: 1,
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
