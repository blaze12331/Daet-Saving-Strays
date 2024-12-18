import React, { useState } from "react";
import "./DonatePage.css";
import { db } from "../config/firebase"; // Firebase Firestore configuration
import { collection, addDoc } from "firebase/firestore";
import SavingStraysLogo from "../assets/SavingStrays.png";
import QRCodeImage from "../assets/QRCode.jpg"; // Import your QR code image

const DonatePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    modeOfTransfer: "gcash",
  });

  const [error, setError] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openQRCodeModal = () => setIsQRCodeModalOpen(true);
  const closeQRCodeModal = () => setIsQRCodeModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstName" || name === "lastName") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === "contactNumber") {
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const saveDonationToDatabase = async () => {
    try {
      const donationRef = collection(db, "donations"); // Firestore collection name: donations
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        modeOfTransfer: formData.modeOfTransfer,
        date: new Date().toISOString(), // Timestamp
      };

      await addDoc(donationRef, data); // Save to Firestore
      console.log("Donation info saved:", data);
    } catch (error) {
      console.error("Error saving donation info:", error);
      setError("Failed to save donation information. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (
      formData.firstName.trim() === "" ||
      formData.lastName.trim() === "" ||
      formData.contactNumber.trim() === "" ||
      formData.modeOfTransfer === ""
    ) {
      setError("All fields must be filled before proceeding.");
      return;
    }
  
    try {
      // Save the data to Firestore
      await saveDonationToDatabase();
      setError(""); 
      closeModal();
      openQRCodeModal();
    } catch (error) {
      console.error("Submission error:", error);
      setError("Failed to process donation. Please try again.");
    }
  };
  
  return (
    <div className="donate-page">
      {/* Header Section */}
      <div className="headers">
        <h1>
          Donate to <span className="highlight">Save</span> Lives
        </h1>
        <p>
          We simply could not save lives without pet-lovers like you. Your
          generous donation funds food, shelter, medical care, and training for
          rescue pups. Every dollar counts for dogs in need. Join us in making a
          difference today!
        </p>
      </div>

      {/* Trusted Partners Section */}
      <div className="trusted-partners">
        <h2>Trusted Partners</h2>
        <div className="partner-card">
          <div className="partner-logo">
            <img src={SavingStraysLogo} alt="Saving Strays Logo" />
          </div>
          <div className="partner-details">
            <p>
              📧{" "}
              <a href="mailto:dsavingstrays.com">dsavingstrays@gmail.com</a>
            </p>
            <p>📍 Daet, Camarines Norte, 4600</p>
            <p>
              💳 Mode of transfer: <span className="g-cash">GCash</span>
            </p>
          </div>
          <button className="donate-btn" onClick={openModal}>
            Donate Here
          </button>
        </div>
      </div>

      {/* Donation Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Donation Form</h2>
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
              Mode of transfer:
              <select
                name="modeOfTransfer"
                value={formData.modeOfTransfer}
                onChange={handleInputChange}
              >
                <option value="gcash">GCash</option>
              </select>
            </label>
            {error && <p className="error-message">{error}</p>}
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
            <button className="confirm-btn" onClick={handleSubmit}>
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {isQRCodeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content qr-modal">
            <h2>Scan QR Code</h2>
            <img
              src={QRCodeImage}
              alt="QR Code"
              style={{ width: "300px", height: "300px", margin: "20px auto" }}
            />
            <button className="close-btn" onClick={closeQRCodeModal}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonatePage;
