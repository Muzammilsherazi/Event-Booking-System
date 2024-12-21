import React, { useState } from 'react';
import styles from './EventCard.module.css';
import BookForm from './BookForm';

function EventCard({ id, title, description, location, date, bookedSeats, capacity, onBookSeat }) {
  const [bookFormOpen, setBookFormOpen] = useState(false);

  const openForm = () => {
    setBookFormOpen(true);
  };

  const handleBooking = (bookedSeats, capacity) => {
    onBookSeat(id, bookedSeats, capacity);
    setBookFormOpen(false);
  };
  

  return (
    <>
      <div className={styles.card}> 
        <div className={styles.top}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className={styles.mid}>
          <div className={styles.left}>
            <p>{location}</p>
            <p>{date}</p>
          </div>
          {capacity <= 0 ? (
            <button id={styles.bookedBtn}>Booked</button>
          ) : (
            <button className={styles.bookSeatBtn} onClick={openForm}>Book Seat</button>
          )}
        </div>
        <div className={styles.bottom}>
          {capacity <= 0 ? (
            <p>No Seats available!</p>
          ) : (
            <>
              <p>Booked Seats <span>{bookedSeats}</span></p>
              <p>/</p>
              <p>Capacity <span>{capacity}</span></p>
            </>
          )}
        </div>
      </div>

      {bookFormOpen && (
        <BookForm
          isOpen={bookFormOpen}
          onClose={() => setBookFormOpen(false)}
          bookedSeats={bookedSeats}
          capacity={capacity}
          title={title}
          id={id}   
          onBooking={handleBooking}
        />
      )}
    </>
  );
}

export default EventCard;
