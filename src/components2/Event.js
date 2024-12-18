import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import icons
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, set, get, remove, update } from "firebase/database";
import { db, realtimeDB } from "../config/firebase";
import "./Event.css";

Modal.setAppElement("#root"); // Required for accessibility

const Event = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState("addEvents");
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const fileInputRef = useRef(null); // Ref for file input

  const resetForm = () => {
    setEventTitle("");
    setEventDate("");
    setEventDescription("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!eventTitle || !eventDate || !eventDescription) {
      alert("Please fill all fields!");
      return;
    }

    try {
      // Generate unique ID for the event
      const eventId = Date.now().toString();
      const dbPath = `events/${eventId}`;

      // Save to db
      await setDoc(doc(db, "events", eventId), {
        title: eventTitle,
        date: eventDate,
        description: eventDescription,
        imagePath: dbPath, // Path to the image in db
      });

      // Save to Realtime Database
      await set(ref(realtimeDB, `events/${eventId}`), {
        title: eventTitle,
        date: eventDate,
        description: eventDescription,
        image: image, // Save image as base64 string in RTDB
      });

      // Update local state
      const newEvent = { id: eventId, title: eventTitle, date: eventDate, description: eventDescription, image };
      setUpcomingEvents([...upcomingEvents, newEvent]);
      resetForm();

      alert("Event added successfully!");
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("Failed to add event. Please try again.");
    }
  };

  const fetchEvents = async () => {
    try {
      const dbEvents = [];
      const realtimeEvents = [];

      const currentDate = new Date();

      // Fetch db events
      const querySnapshot = await getDocs(collection(db, "events"));
      querySnapshot.forEach((doc) => {
        const event = { id: doc.id, ...doc.data() };
        if (new Date(event.date) > currentDate) {
          dbEvents.push(event);
        }
      });

      // Fetch Realtime Database events
      const snapshot = await get(ref(realtimeDB, "events"));
      if (snapshot.exists()) {
        Object.entries(snapshot.val()).forEach(([id, event]) => {
          if (new Date(event.date) > currentDate) {
            realtimeEvents.push({ id, ...event });
          }
        });
      }

      // Combine and update the state
      const combinedEvents = [...dbEvents, ...realtimeEvents];
      setUpcomingEvents(combinedEvents);
    } catch (error) {
      console.error("Error fetching events: ", error);
      alert("Failed to fetch events.");
    }
  };

  const handleDelete = async (eventId) => {
    try {
      // Delete from db
      await deleteDoc(doc(db, "events", eventId));

      // Delete from Realtime Database
      await remove(ref(realtimeDB, `events/${eventId}`));

      // Update local state
      setUpcomingEvents(upcomingEvents.filter((event) => event.id !== eventId));
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event: ", error);
      alert("Failed to delete event.");
    }
  };

  const handleUpdate = async (eventId) => {
    if (!eventTitle || !eventDate || !eventDescription) {
      alert("Please fill all fields!");
      return;
    }

    try {
      // Update db
      await updateDoc(doc(db, "events", eventId), {
        title: eventTitle,
        date: eventDate,
        description: eventDescription,
        imagePath: `events/${eventId}`,
      });

      // Update Realtime Database
      await update(ref(realtimeDB, `events/${eventId}`), {
        title: eventTitle,
        date: eventDate,
        description: eventDescription,
        image: image,
      });

      // Update local state
      setUpcomingEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId
            ? { ...event, title: eventTitle, date: eventDate, description: eventDescription, image }
            : event
        )
      );

      alert("Event updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating event: ", error);
      alert("Failed to update event.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = (event, index) => {
    setEditIndex(index);
    setEventTitle(event.title);
    setEventDate(event.date);
    setEventDescription(event.description);
    setImage(event.image);
    setModalIsOpen(true);

    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  const closeModal = () => {
    setModalIsOpen(false);
    resetForm();
  };

  return (
    <div className="e-event-container">
      {/* Tabs */}
      <div className="e-event-header">
        <button
          className={`e-tab ${activeTab === "addEvents" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("addEvents");
            resetForm();
          }}
        >
          ADD EVENTS
        </button>
        <button
          className={`e-tab ${activeTab === "upcomingEvents" ? "active" : ""}`}
          onClick={() => setActiveTab("upcomingEvents")}
        >
          UPCOMING EVENTS
        </button>
      </div>

      {/* Add Events */}
      {activeTab === "addEvents" && (
        <div className="e-event-form">
          <div className="file-upload">
            <label className="file-label" htmlFor="file-input">
              {image ? "Change Image" : "+ Upload Image"}
            </label>
            <input
              id="file-input"
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
            />
            {image && <img src={image} alt="Uploaded Preview" className="preview-image" />}
          </div>
          <input
            type="text"
            placeholder="EVENT TITLE"
            className="e-event-input"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <input
            type="datetime-local"
            className="e-event-input"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}          />
            <textarea
              placeholder="EVENT DESCRIPTION"
              className="e-event-textarea"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            ></textarea>
            <button className="e-save-btn" onClick={handleSave}>
              SAVE
            </button>
          </div>
        )}
  
        {/* Upcoming Events */}
        {activeTab === "upcomingEvents" && (
          <div className="e-upcoming-events">
            {upcomingEvents.map((event, index) => (
              <div className="event-card" key={index}>
                <div className="event-image">
                  <img src={event.image || "/default-circle.png"} alt="Event" className="circle-image" />
                </div>
                <div className="event-details" onClick={() => openModal(event, index)}>
                  <h4>Title: {event.title}</h4>
                  <p>Date: {new Date(event.date).toLocaleString()}</p>
                  <p>Description: {event.description}</p>
                </div>
                <div className="event-icons">
                  <FaEdit className="icon" onClick={() => openModal(event, index)} />
                  <FaTrashAlt className="icon" onClick={() => handleDelete(event.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
  
        {/* Event Modal */}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="e-modal">
          <h2>Edit Event</h2>
          <div className="e-event-form">
            <div className="file-upload">
              <label className="file-label" htmlFor="modal-file-input">
                {image ? "Change Image" : "+ Upload Image"}
              </label>
              <input
                id="modal-file-input"
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
              />
              {image && <img src={image} alt="Uploaded Preview" className="preview-image" />}
            </div>
            <input
              type="text"
              placeholder="EVENT TITLE"
              className="e-event-input"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <input
              type="datetime-local"
              className="e-event-input"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
            <textarea
              placeholder="EVENT DESCRIPTION"
              className="e-event-textarea"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            ></textarea>
            <button
              className="e-save-btn"
              onClick={() => handleUpdate(upcomingEvents[editIndex]?.id)}
            >
              SAVE CHANGES
            </button>
            <button className="e-cancel-btn" onClick={closeModal}>
              CLOSE
            </button>
          </div>
        </Modal>
      </div>
    );
  };
  
  export default Event;
