import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

function App() {
  const [bookedSeats, setBookedSeats] = useState([]);
  const allSeats = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'];

  useEffect(() => {
    // Listen for updates from other students
    socket.on('seatUpdated', (seatId) => {
      setBookedSeats((prev) => [...prev, seatId]);
    });
  }, []);
  const handleBooking = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    
    // Emit event to server
    socket.emit('bookSeat', { 
      movieId: 'movie123', 
      seatId: seatId, 
      userEmail: 'student@example.com' 
    });
  };

  return (
    <>
      <div style={{ textAlign: 'center' }}>
      <h1>Real-Time Cinema Seats</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 50px)', gap: '10px', justifyContent: 'center' }}>
        {allSeats.map(seat => (
          <button 
            key={seat}
            onClick={() => handleBooking(seat)}
            style={{ 
              backgroundColor: bookedSeats.includes(seat) ? 'red' : 'green',
              color: 'white', padding: '10px'
            }}
          >
            {seat}
          </button>
        ))}
      </div>
      <p>Red = Booked by someone | Green = Available</p>
    </div>
    </>
  )
}

export default App
