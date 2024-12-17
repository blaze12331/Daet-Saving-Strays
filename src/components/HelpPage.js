import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HelpPage.css";

const HelpPage = () => {
  const navigate = useNavigate();

  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    event: "",
  });

  const closeVolunteerModal = () => setIsVolunteerModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstName" || name === "lastName") {
      // Allow only alphabetic characters
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === "contactNumber") {
      // Allow only numeric values
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleConfirm = () => {
    if (
      formData.firstName.trim() === "" ||
      formData.lastName.trim() === "" ||
      formData.contactNumber.trim() === "" ||
      formData.event.trim() === ""
    ) {
      window.alert("All fields must be filled before proceeding.");
    } else {
      window.alert("Volunteer form submitted successfully!");
      closeVolunteerModal();
    }
  };

  const handleDonateClick = () => {
    navigate("/donate"); // Navigate to the donate page
  };

  return (
    <div className="help-page-container">
      <h1 className="help-title">
        Join Us to Save <span className="highlight">Lives</span>
      </h1>
      <p className="help-description">
        Your support can make a huge difference in the lives of stray animals.
        By donating or volunteering, you help provide essential care and a
        loving home for those in need.
      </p>
      <div className="help-buttons">
        <button className="donate-button" onClick={handleDonateClick}>
          Donate Now
        </button>
      </div>

      {/* Volunteer Modal */}
      {isVolunteerModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content volunteer-modal">
            <h2>Volunteer Modal</h2>
            <label>
              First name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
              />
            </label>
            <label>
              Last name:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
              />
            </label>
            <label>
              Contact Number:
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="Enter your contact number"
              />
            </label>
            <label>
              Event:
              <select
                name="event"
                value={formData.event}
                onChange={handleInputChange}
              >
                <option value="">Select an event</option>
                <option value="animal-care">Animal Care</option>
                <option value="fundraising">Fundraising</option>
                <option value="adoption-drive">Adoption Drive</option>
              </select>
            </label>
            <button className="close-btn" onClick={closeVolunteerModal}>
              Close
            </button>
            <button className="confirm-btn" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPage;
