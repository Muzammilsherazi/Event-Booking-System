# Event Booking System

This is an **Event Booking System** built using **React (Vite)** and **Firebase Firestore**. The system allows users to browse available events, book seats, and view booking updates in real-time. Firebase Firestore is used as the database for storing and updating event details and bookings.

---

## **Features**

1. **Real-Time Data Fetching:**
   - Event details are fetched from Firebase Firestore in real-time.
   - Booked seats are dynamically updated for all users.

2. **Booking Management:**
   - Users can book seats for events.
   - Booking details are saved in Firestore, and `bookedSeats` is updated accordingly.

3. **Responsive UI:**
   - Designed to work seamlessly on desktop and mobile devices.

4. **Data Storage with Firestore:**
   - Event data is stored and updated securely in Firebase Firestore.

---

## **Tech Stack**

- **Frontend:** React (Vite)
- **Database:** Firebase Firestore
- **Styling:** CSS.

---
## **Firebase Firestore Function**


1 **initializeApp**
   - For Connect the App with Firebase.
   - const firebaseConfig = {
    apiKey: "MY_API_KEY",
    authDomain: "MY_AUTH_DOMAIN",
    projectId: "MY_PROJECT_ID",
    storageBucket: "MY_STORAGE_BUCKET",
    messagingSenderId: "MY_MESSAGING_SENDER_ID",
    appId: "MY_APP_ID"
   };
   - const app = intializeApp(firebaseConfig)
     
2 **getFirestore**
   - For use firebase firestore databse.
   - const db = getFirestore(app)

here my app connect my firestore database

3 **getDocs**
   - For get firestore collection docs, collection also a function.
   - getDocs(collection(db, "Events"));

4 **doc**
   - for get one document

5 **updateDoc**
   - For update data in specific doc.
   - const ref = doc(db, "Events", id); // this id ic doc id
      updateDoc(ref, {
     bookedSeats: bookedSeats + 1,
     capacity: capacity - 1,
     });

6 **addDoc**
   - For use addDoc in Collection of firestore.
   - In my Project i'll use for if any user bookedSeat then user data store in users collection.

7 **query, where**
   - query and where are used for conditionally fetching data, adding data, or filtering data from any collection or document.
   - Example in my project: I'll use these to check if a user has already booked a seat by verifying whether their email is already registered in users collection because in this we store user data with event title, id, or user data. If user again booked seat again same event with same email, then this is not allowed.

## **Setup Instructions**

Follow these steps to set up and run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/event-booking-system.git
cd event-booking-system

Then open your code in vsCode. In terminal run this command,make sure you have install Nodejs
```bash
npm install
npm run dev
