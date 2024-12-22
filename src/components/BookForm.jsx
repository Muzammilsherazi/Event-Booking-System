import React, { useState } from "react";
import emailjs from "emailjs-com"; // Make sure EmailJS is installed
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "./bookForm.css";
import { toast, Slide } from 'react-toastify';

function BookForm({ isOpen, title, id, onClose, onBooking, bookedSeats, capacity }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [loading, setLoading] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  if (!isOpen) {
    return null;
  }


  const checkEmailAlreadyBooked = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email), where("eventId", "==", id));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  };


  const errorRemove = () => {
    setNameError("");
    setEmailError("");
    setPhoneError("");
    return;
  }


  const handleBooking = async (e) => {
    e.preventDefault();

    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (name === "") {
      setNameError("Name is Required!")
      return;
    }
    else if (email === "") {
      setEmailError("Email is Required!")
      return;
    }

    else if (!emailReg.test(email)) {
      setEmailError("Invalid email address!")
      return;
    }

    else if (phone === "") {
      setPhoneError("Phone is Required!")
      return;
    }
    else if (phone.length < 11) {
      setPhoneError("number allowed atleast 11!")
      return;
    }

    try {
      setLoading(true);
      const isEmailBooked = await checkEmailAlreadyBooked();
      if (isEmailBooked) {
        setLoading(false);
        setEmailError("this email is already registered for this event!")
        return;
      }

      // Update Firebase collecttion
      await addDoc(collection(db, "users"), {
        name,
        email,
        phone,
        eventId: id,
        eventTitle: title,
      });

      // Update local state as well
      onBooking(bookedSeats, capacity);

      // Clear form and close the form
      setName("");
      setEmail("");
      setPhone("");
      setLoading(false)
      onClose();

      toast.success("Congratulations! Your Seat Has Been Booked, Check Your Email", {
        position: "top-right",
        autoClose: 6500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });

      // Send email
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
            console.log("Email sent successfully:", result.text)
          },
          (error) => {
            console.error("Error in sending email:", error.text);
            alert();

            toast.warning("Unfornunately something went wrong! try later.", {
              position: "top-right",
              autoClose: 8000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Slide,
            });
          }
        );
    } catch (error) {
      setLoading(false)
      console.error("Error adding document: ", error);
    }
  };


  return (
    <>
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
              pattern=""
              value={name}
              onChange={(e) => {
                if (/^[a-zA-Z ]*$/.test(e?.target?.value)) setName(e.target.value)
                errorRemove()
              }}
            />
            <p className={`error ${nameError ? "visible" : "hidden"}`}>
              {nameError}
            </p>
          </div>

          <div id="email" className="sameInput">
            <label htmlFor="u_email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              id="u_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              onInput={errorRemove}
            />
            <p className={`error ${emailError ? "visible" : "hidden"}`}>
              {emailError}
            </p>
          </div>

          <div id="phone" className="sameInput">
            <label htmlFor="u_phone">Phone</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              name="phone"
              id="u_phone"
              value={phone}
              onChange={(e) => {
                if (/^[0-9]*$/.test(e?.target?.value)) setPhone(e.target.value)
                errorRemove()
              }}
              maxLength="11"
            />
            <p
              className={`error ${phoneError ? "visible" : "hidden"}`}
            >
              {phoneError}
            </p>

          </div>

          <div id="btns">
            <button
              type="submit"
              onClick={handleBooking}
              disabled={loading}
            >
              {loading ? (
                <span className="loader"></span>
              ) : (
                "Book Now"
              )}
            </button>
            <button onClick={onClose} id="cancel_btn" disabled={buttonsDisabled}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default BookForm;
