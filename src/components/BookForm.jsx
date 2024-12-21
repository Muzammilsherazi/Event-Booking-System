import React, { useState } from "react";
import emailjs from "emailjs-com"; // Make sure EmailJS is installed
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs} from "firebase/firestore";
import "./bookForm.css";

function BookForm({ isOpen, title, id, onClose, onBooking, bookedSeats, capacity }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [emailError, setEmailError] = useState("");

  if (!isOpen) {
    return null;
  }

  const validateName = (value) => {
    if (value.trim() === "") {
      return "Name is required!";
    }
    return "";
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.trim() === "") {
      return "Email is required!";
    }
    if (!emailRegex.test(value)) {
      return "Invalid email format!";
    }
    return "";
  };

  const validatePhone = (value) => {
    if (value.trim() === "") {
      return "Phone number is required!";
    }
    if (value.length < 10) {
      return "Phone number must be at least 10 digits!";
    }
    return "";
  };

  const checkEmailAlreadyBooked = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email), where("eventId", "==", id));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
  
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
  
    if (nameError || emailError || phoneError) {
      setErrors({ name: nameError, email: emailError, phone: phoneError });
      return;
    }
  
    const isEmailBooked = await checkEmailAlreadyBooked();
    if (isEmailBooked) {
      setEmailError("This email has already booked a seat for this event.");
      return;
    }
  
    try {
      // Update Firebase collecttion
      await addDoc(collection(db, "users"), {
        name,
        email,
        phone,
        eventId: id,
        eventTitle: title,
      });
  
      // Update local state as well
      onBooking(bookedSeats, capacity );
  
      // Clear form and close the form
      setName("");
      setEmail("");
      setPhone("");
      onClose();
  
      // Send confirmation email
      const emailParams = { name, email };
      emailjs
        .send(
          "service_krx2nlo",
          "template_p7bf8lo",
          emailParams,
          "fyZZMAUGFXIBpVU9Q"
        )
        .then(
          (result) => {
            console.log("Email sent successfully:", result.text);
            alert("Congratulations Your Seat Has Been Booked! Check Your Email Now.");
          },
          (error) => {
            console.error("Error in sending email:", error.text);
            alert("Unfornunately something went wrong! try later.");
          }
        );
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  

  const handleChange = (e, field) => {
    const value = e.target.value;

    switch (field) {
      case "name":
        setName(value);
        setErrors((prev) => ({ ...prev, name: validateName(value) }));
        break;

      case "email":
        setEmail(value);
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
        break;

      case "phone":
        setPhone(value);
        setErrors((prev) => ({ ...prev, phone: validatePhone(value) }));
        break;

      default:
        break;
    }
  };

  return (
    <div id="bookForm">
      <form onSubmit={handleBooking}>
        <h3>Book Seat for {title}</h3>

        <div id="name" className="sameInput">
          <label htmlFor="u_name">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            name="name"
            id="u_name"
            value={name}
            onChange={(e) => handleChange(e, "name")}
            autoComplete="off"
          />
          <p className={`error ${errors.name ? "visible" : "hidden"}`}>{errors.name}</p>
        </div>

        <div id="email" className="sameInput">
          <label htmlFor="u_email">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            id="u_email"
            value={email}
            onChange={(e) => handleChange(e, "email")}
            autoComplete="off"
          />
          <p className={`error ${errors.email ? "visible" : "hidden"}`}>{errors.email}</p>
          <p className={`error ${emailError ? "visible" : "hidden"}`}>{emailError}</p>
        </div>

        <div id="phone" className="sameInput">
          <label htmlFor="u_phone">Phone</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            name="phone"
            id="u_phone"
            value={phone}
            onChange={(e) => handleChange(e, "phone")}
            autoComplete="off"
          />
          <p className={`error ${errors.phone ? "visible" : "hidden"}`}>{errors.phone}</p>
        </div>

        <div id="btns">
          <button type="submit" onClick={handleBooking}>Book Now</button>
          <button onClick={onClose} id="cancel_btn">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default BookForm;
