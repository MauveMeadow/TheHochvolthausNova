import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, MapPin, User, Mail, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'

// Mock rooms data
const ROOMS = [
  { id: 'room-a', name: 'Quiet Study Room A', capacity: 1, description: 'Individual study space' },
  { id: 'room-b', name: 'Group Room B', capacity: 6, description: 'Collaborative workspace' },
  { id: 'room-c', name: 'Media Room', capacity: 4, description: 'AV equipment available' },
  { id: 'room-d', name: 'Conference Room D', capacity: 10, description: 'Large meetings & presentations' }
]

// Time slots from 8:00 to 20:00
const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8
  return {
    id: `slot-${hour}`,
    start: `${hour.toString().padStart(2, '0')}:00`,
    end: `${(hour + 1).toString().padStart(2, '0')}:00`,
    hour
  }
})

// Generate mock bookings
const generateMockBookings = () => {
  const today = new Date()
  const bookings = []
  
  // Add some bookings for today
  bookings.push({
    id: 'booking-1',
    roomId: 'room-a',
    date: today.toISOString().split('T')[0],
    hour: 10,
    name: 'Anna Schmidt',
    studentId: 'ST2024001',
    email: 'anna.schmidt@university.edu'
  })
  bookings.push({
    id: 'booking-2',
    roomId: 'room-b',
    date: today.toISOString().split('T')[0],
    hour: 14,
    name: 'Max Müller',
    studentId: 'ST2024002',
    email: 'max.mueller@university.edu'
  })
  bookings.push({
    id: 'booking-3',
    roomId: 'room-b',
    date: today.toISOString().split('T')[0],
    hour: 15,
    name: 'Max Müller',
    studentId: 'ST2024002',
    email: 'max.mueller@university.edu'
  })
  bookings.push({
    id: 'booking-4',
    roomId: 'room-c',
    date: today.toISOString().split('T')[0],
    hour: 9,
    name: 'Lisa Weber',
    studentId: 'ST2024003',
    email: 'lisa.weber@university.edu'
  })
  
  // Add some bookings for tomorrow
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  bookings.push({
    id: 'booking-5',
    roomId: 'room-a',
    date: tomorrow.toISOString().split('T')[0],
    hour: 11,
    name: 'Tom Fischer',
    studentId: 'ST2024004',
    email: 'tom.fischer@university.edu'
  })
  bookings.push({
    id: 'booking-6',
    roomId: 'room-d',
    date: tomorrow.toISOString().split('T')[0],
    hour: 13,
    name: 'Sarah Klein',
    studentId: 'ST2024005',
    email: 'sarah.klein@university.edu'
  })
  
  return bookings
}

function RoomReservation() {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0])
  const [bookings, setBookings] = useState(generateMockBookings)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [formData, setFormData] = useState({ name: '', studentId: '', email: '' })
  const [formErrors, setFormErrors] = useState({})

  // Get current hour for "past" detection
  const currentHour = new Date().getHours()
  const isToday = selectedDate === today

  // Get slot status
  const getSlotStatus = (slot) => {
    // Check if past
    if (isToday && slot.hour < currentHour) {
      return 'past'
    }
    
    // Check if booked
    const isBooked = bookings.some(
      b => b.roomId === selectedRoom.id && b.date === selectedDate && b.hour === slot.hour
    )
    
    return isBooked ? 'booked' : 'available'
  }

  // Get booking info for a slot
  const getBookingInfo = (slot) => {
    return bookings.find(
      b => b.roomId === selectedRoom.id && b.date === selectedDate && b.hour === slot.hour
    )
  }

  // Handle slot click
  const handleSlotClick = (slot) => {
    const status = getSlotStatus(slot)
    if (status === 'available') {
      setSelectedSlot(slot)
      setModalOpen(true)
      setFormData({ name: '', studentId: '', email: '' })
      setFormErrors({})
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.studentId.trim()) errors.studentId = 'Student ID is required'
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const newBooking = {
      id: `booking-${Date.now()}`,
      roomId: selectedRoom.id,
      date: selectedDate,
      hour: selectedSlot.hour,
      ...formData
    }

    setBookings(prev => [...prev, newBooking])
    setModalOpen(false)
    setSelectedSlot(null)
  }

  // Count available slots for each room
  const roomAvailability = useMemo(() => {
    return ROOMS.map(room => {
      const available = TIME_SLOTS.filter(slot => {
        if (isToday && slot.hour < currentHour) return false
        return !bookings.some(
          b => b.roomId === room.id && b.date === selectedDate && b.hour === slot.hour
        )
      }).length
      return { ...room, available }
    })
  }, [selectedDate, bookings, isToday, currentHour])

  return (
    <div className="reservation-page">
      {/* Header */}
      <header className="reservation-header">
        <div className="container">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Room Reservation</h1>
          <p>Book a study space at Hochvolthaus</p>
        </div>
      </header>

      <div className="reservation-container container">
        {/* Sidebar */}
        <aside className="reservation-sidebar">
          {/* Date Picker */}
          <div className="sidebar-section">
            <h3><Calendar size={18} /> Select Date</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="date-picker"
            />
          </div>

          {/* Room List */}
          <div className="sidebar-section">
            <h3><MapPin size={18} /> Select Room</h3>
            <div className="room-list">
              {roomAvailability.map(room => (
                <button
                  key={room.id}
                  className={`room-card ${selectedRoom.id === room.id ? 'selected' : ''}`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="room-info">
                    <span className="room-name">{room.name}</span>
                    <span className="room-desc">{room.description}</span>
                    <span className="room-capacity">Capacity: {room.capacity}</span>
                  </div>
                  <span className={`room-availability ${room.available === 0 ? 'full' : ''}`}>
                    {room.available} slots
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="sidebar-section">
            <h3>Legend</h3>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-dot available"></span>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot booked"></span>
                <span>Booked</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot past"></span>
                <span>Past</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Time Grid */}
        <main className="reservation-main">
          <div className="time-grid-header">
            <h2>{selectedRoom.name}</h2>
            <p>{new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>

          <div className="time-grid">
            {TIME_SLOTS.map(slot => {
              const status = getSlotStatus(slot)
              const booking = getBookingInfo(slot)
              
              return (
                <motion.div
                  key={slot.id}
                  className={`time-slot ${status}`}
                  onClick={() => handleSlotClick(slot)}
                  whileHover={status === 'available' ? { scale: 1.02 } : {}}
                  whileTap={status === 'available' ? { scale: 0.98 } : {}}
                >
                  <div className="slot-time">
                    <Clock size={16} />
                    <span>{slot.start} - {slot.end}</span>
                  </div>
                  <div className="slot-status">
                    {status === 'available' && 'Click to book'}
                    {status === 'booked' && booking && (
                      <span className="booked-by">Booked by {booking.name}</span>
                    )}
                    {status === 'past' && 'Past'}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {modalOpen && selectedSlot && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
              
              <h2>Book Time Slot</h2>
              <div className="modal-info">
                <p><strong>Room:</strong> {selectedRoom.name}</p>
                <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedSlot.start} - {selectedSlot.end}</p>
              </div>

              <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                  <label htmlFor="name">
                    <User size={16} /> Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                  {formErrors.name && <span className="form-error">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="studentId">
                    <CreditCard size={16} /> Student ID
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="e.g., ST2024001"
                  />
                  {formErrors.studentId && <span className="form-error">{formErrors.studentId}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={16} /> Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@university.edu"
                  />
                  {formErrors.email && <span className="form-error">{formErrors.email}</span>}
                </div>

                <button type="submit" className="btn btn-primary submit-btn">
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RoomReservation
