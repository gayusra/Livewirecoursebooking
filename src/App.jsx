import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Your live Render backend URL
const socket = io("https://backend-livewirebooking-1.onrender.com");

function App() {
  const [bookedSeats, setBookedSeats] = useState([]);
  const allSeats = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'];

  useEffect(() => {
    // 1. Listen for initial data (Persistence)
    // This event should be sent by your server when a user first connects
    socket.on('initialSeats', (seats) => {
      setBookedSeats(seats);
    });

    // 2. Listen for real-time updates from other students
    socket.on('seatUpdated', (seatId) => {
      // Use a Set to ensure we don't get duplicate seat IDs in our array
      setBookedSeats((prev) => [...new Set([...prev, seatId])]);
    });

    // 3. Cleanup: Stop listening when the component unmounts
    return () => {
      socket.off('initialSeats');
      socket.off('seatUpdated');
    };
  }, []);

  const handleBooking = (seatId) => {
    // Prevent re-booking a seat that is already red
    if (bookedSeats.includes(seatId)) return;
    
    // Optimistic UI Update: Make it red immediately for the user who clicked
    setBookedSeats((prev) => [...prev, seatId]);

    // Send the booking to the server
    socket.emit('bookSeat', { 
      movieId: 'movie123', 
      seatId: seatId, 
      userEmail: 'student@example.com' 
    });
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', display: 'inline-block', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#333' }}>🎬 Real-Time Movie Booking</h1>
        <p>Student Demo: MERN + Socket.io</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 60px)', 
          gap: '15px', 
          justifyContent: 'center',
          margin: '30px 0'
        }}>
          {allSeats.map(seat => (
            <button 
              key={seat}
              onClick={() => handleBooking(seat)}
              disabled={bookedSeats.includes(seat)}
              style={{ 
                backgroundColor: bookedSeats.includes(seat) ? '#ff4d4d' : '#2ecc71',
                color: 'white', 
                padding: '15px 5px',
                border: 'none',
                borderRadius: '8px',
                cursor: bookedSeats.includes(seat) ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => !bookedSeats.includes(seat) && (e.target.style.transform = 'scale(1.1)')}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              {seat}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
          <div><span style={{ color: '#2ecc71' }}>●</span> Available</div>
          <div><span style={{ color: '#ff4d4d' }}>●</span> Booked</div>
        </div>
      </div>
    </div>
  );
}

export default App;