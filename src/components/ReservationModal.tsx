import React, { useState } from 'react'
import { X } from 'lucide-react'

type Service = {
  id: number
  type: 'medical' | 'administrative'
  name: string
  latitude: number
  longitude: number
  availableSlots: string[]
}

type ReservationModalProps = {
  isOpen: boolean
  onClose: () => void
  service: Service
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, service }) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  if (!isOpen) return null

  const handleReservation = () => {
    if (selectedSlot) {
      // Here you would typically make an API call to save the reservation
      console.log(`Reservation made for ${service.name} at ${selectedSlot}`)
      alert(`Reservation confirmed for ${service.name} at ${selectedSlot}`)
      onClose()
    } else {
      alert('Please select a time slot')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{service.name} Reservation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <p className="mb-4">Select an available time slot:</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {service.availableSlots.map((slot) => (
            <button
              key={slot}
              className={`p-2 rounded ${
                selectedSlot === slot ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setSelectedSlot(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleReservation}
        >
          Confirm Reservation
        </button>
      </div>
    </div>
  )
}

export default ReservationModal