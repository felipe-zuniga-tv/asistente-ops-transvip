interface BookingDetails {
  id: string
  driver_id: string
  start_time: string
  end_time: string
  location: string
}

interface ValidationResult {
  isValid: boolean
  error?: string
}

// Mock booking data
const mockBookings: BookingDetails[] = [
  {
    id: '10040250',
    driver_id: 'mock-id',
    start_time: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    end_time: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
    location: 'SCL Airport'
  }
]

export async function getBookingDetails(bookingId: string): Promise<BookingDetails | null> {
  // TODO: Replace with actual API call
  return mockBookings.find(booking => booking.id === bookingId) || null
}

export async function validateBookingForDriver(
  bookingId: string,
  driverId: string
): Promise<ValidationResult> {
  const booking = await getBookingDetails(bookingId)

  if (!booking) {
    return {
      isValid: false,
      error: 'Booking not found'
    }
  }

  if (booking.driver_id !== driverId) {
    return {
      isValid: false,
      error: 'This booking does not belong to you'
    }
  }

  return { isValid: true }
}

export async function validateTicketTiming(
  exitTimestamp: string,
  bookingId: string
): Promise<ValidationResult> {
  const booking = await getBookingDetails(bookingId)

  if (!booking) {
    return {
      isValid: false,
      error: 'Booking not found'
    }
  }

  const exitTime = new Date(exitTimestamp).getTime()
  const bookingStart = new Date(booking.start_time).getTime()
  const timeDifference = Math.abs(exitTime - bookingStart)
  const twoHoursInMs = 2 * 60 * 60 * 1000

  if (timeDifference > twoHoursInMs) {
    return {
      isValid: false,
      error: 'Ticket exit time must be within 2 hours of booking start time'
    }
  }

  return { isValid: true }
} 