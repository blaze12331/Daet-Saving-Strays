import React, { useState, useRef } from "react";
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
  ]);

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
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!eventTitle || !eventDate || !eventDescription) {
      alert("Please fill all fields!");
      return;
    }
    const newEvent = { title: eventTitle, date: eventDate, description: eventDescription, image };
    setUpcomingEvents([...upcomingEvents, newEvent]);
    resetForm();
    alert("Event added successfully!");
  };

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

  const handleModalSave = () => {
    if (!eventTitle || !eventDate || !eventDescription) {
      alert("Please fill all fields!");
      return;
    }
    const updatedEvent = { title: eventTitle, date: eventDate, description: eventDescription, image };
    const updatedEvents = [...upcomingEvents];
    updatedEvents[editIndex] = updatedEvent;
    setUpcomingEvents(updatedEvents);
    closeModal();
    alert("Event updated successfully!");
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
            onChange={(e) => setEventDate(e.target.value)}
          />
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
          <button className="e-save-btn" onClick={handleModalSave}>
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
