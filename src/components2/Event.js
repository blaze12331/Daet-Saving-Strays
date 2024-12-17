import React, { useState } from "react";
import Modal from "react-modal";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import icons
import "./Event.css";

Modal.setAppElement("#root"); // Required for accessibility

const Event = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState("addEvents");
  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      title: "Tech Conference 2024",
      date: "2024-08-15T10:00",
      description: "A conference to discuss future technology trends.",
      image: "https://via.placeholder.com/150",
    },
    {
      title: "React Workshop",
      date: "2024-08-22T14:00",
      description: "A hands-on workshop to learn React fundamentals.",
      image: "https://via.placeholder.com/150",
    },
    {
      title: "Networking Event",
      date: "2024-09-10T18:00",
      description: "A meetup for professionals to connect and share ideas.",
      image: "https://via.placeholder.com/150",
    },
  ]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the event being edited

  const handleSave = () => {
    const newEvent = { title: eventTitle, date: eventDate, description: eventDescription, image };
    setUpcomingEvents([...upcomingEvents, newEvent]);
    alert("Event saved successfully!");
    resetForm();
  };

  const resetForm = () => {
    setEventTitle("");
    setEventDate("");
    setEventDescription("");
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const openModal = (event, index) => {
    setCurrentEvent(event);
    setEditIndex(index);
    setEventTitle(event.title);
    setEventDate(event.date);
    setEventDescription(event.description);
    setImage(event.image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    resetForm();
  };

  const handleModalSave = () => {
    const updatedEvent = { title: eventTitle, date: eventDate, description: eventDescription, image };
    const updatedEvents = [...upcomingEvents];
    updatedEvents[editIndex] = updatedEvent;
    setUpcomingEvents(updatedEvents);
    alert("Event updated successfully!");
    closeModal();
  };

  const handleDelete = (index) => {
    const filteredEvents = upcomingEvents.filter((_, i) => i !== index);
    setUpcomingEvents(filteredEvents);
  };

  return (
    <div className="e-event-container">
      {/* Tabs */}
      <div className="e-event-header">
        <button
          className={`e-tab ${activeTab === "addEvents" ? "active" : ""}`}
          onClick={() => setActiveTab("addEvents")}
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
            {!image && <label className="file-label" htmlFor="file-input">+ Upload Image</label>}
            <input id="file-input" type="file" onChange={handleImageChange} accept="image/*" />
            {image && <img src={image} alt="Uploaded Preview" />}
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
          <button className="e-save-btn" onClick={handleSave}>SAVE</button>
        </div>
      )}

      {/* Upcoming Events */}
      {activeTab === "upcomingEvents" && (
        <div className="e-upcoming-events">
          {upcomingEvents.map((event, index) => (
            <div className="event-card" key={index}>
              {/* Event Image */}
              <div className="event-image">
                <img 
                  src={event.image || "/default-circle.png"} 
                  alt="Event" 
                  className="circle-image" 
                />
              </div>

              {/* Event Details */}
              <div className="event-details" onClick={() => openModal(event, index)}>
                <h4>Title: {event.title}</h4>
                <p>Date: {event.date}</p>
                <p>Description: {event.description}</p>
              </div>

              {/* Edit and Delete Icons */}
              <div className="event-icons">
                <FaEdit className="icon" onClick={() => openModal(event, index)} />
                <FaTrashAlt className="icon" onClick={() => handleDelete(index)} />
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
            {!image && <label className="file-label" htmlFor="modal-file-input">+ Upload Image</label>}
            <input id="modal-file-input" type="file" onChange={handleImageChange} accept="image/*" />
            {image && <img src={image} alt="Uploaded Preview" />}
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
          <button className="e-save-btn" onClick={handleModalSave}>SAVE CHANGES</button>
          <button className="e-cancel-btn" onClick={closeModal}>CLOSE</button>
        </div>
      </Modal>
    </div>
  );
};

export default Event;
