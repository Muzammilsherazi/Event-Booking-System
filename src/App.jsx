import React, { useEffect, useState } from 'react';
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from './firebase';
import EventCard from "./components/EventCard";
import styles from './App.module.css';

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const query = await getDocs(collection(db, "Events"));
        const getData = query.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(getData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);

  const updateEventSeats = async (id, bookedSeats, capacity) => {
    try {
      const ref = doc(db, "Events", id);
      await updateDoc(ref, {
        bookedSeats: bookedSeats + 1,
        capacity: capacity - 1,
      });
  
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id
            ? { ...event, bookedSeats: bookedSeats + 1, capacity: capacity - 1 }
            : event
        )
      );
    } catch (error) {
      console.log("Error updating seats:", error);
    }
  };
  

  return (
    <>
      <div className={styles.mainSection}>
        <h1>Upcoming Events</h1>
        <div className={styles.eventsContainer}>
          {events && events.length > 0 ? (
            events.map(event => (
              <EventCard
                key={event.id}
                {...event}
                onBookSeat={updateEventSeats}
              />
            ))
          ) : (
            <h2>Data Not Found!</h2>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
