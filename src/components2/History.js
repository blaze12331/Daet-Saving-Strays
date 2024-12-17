import React, { useState } from "react";
import "./History.css";

const History = () => {
  const [approvedPets, setApprovedPets] = useState([
    { id: 1, name: "Bunny", image: "https://via.placeholder.com/150", applicant: "Jackson Name" },
    { id: 2, name: "Fluffy", image: "https://via.placeholder.com/150", applicant: "Sally Name" },
    { id: 3, name: "Whiskers", image: "https://via.placeholder.com/150", applicant: "Dream Approval" },
    { id: 4, name: "Snowy", image: "https://via.placeholder.com/150", applicant: "Sarah Approved" },
    { id: 5, name: "Mittens", image: "https://via.placeholder.com/150", applicant: "Dream Approved" },
  ]);

  const [declinedPets, setDeclinedPets] = useState([
    { id: 6, name: "Buddy", image: "https://via.placeholder.com/150", applicant: "Amy Smith" },
    { id: 7, name: "Rusty", image: "https://via.placeholder.com/150", applicant: "Alex Name" },
  ]);

  return (
    <div className="history-container">
      {/* Center Header */}

      <div className="content-container">
        {/* Approved Pets */}
        <div className="approved-section">
          <h2 className="section-title approved-title">Approved</h2>
          <div className="card-grid">
            {approvedPets.map((pet) => (
              <div key={pet.id} className="card">
                <img src={pet.image} alt={pet.name} className="pet-image" />
                <p>
                  <strong>Pet Name:</strong> {pet.name}
                </p>
                <p>
                  <strong>Applicant Name:</strong> {pet.applicant}
                </p>
                <button className="report-btn">Report Approval</button>
              </div>
            ))}
          </div>
        </div>

        {/* Declined Pets */}
        <div className="declined-section">
          <h2 className="section-title declined-title">Declined</h2>
          <div className="card-grid">
            {declinedPets.map((pet) => (
              <div key={pet.id} className="card">
                <img src={pet.image} alt={pet.name} className="pet-image" />
                <p>
                  <strong>Pet Name:</strong> {pet.name}
                </p>
                <p>
                  <strong>Applicant Name:</strong> {pet.applicant}
                </p>
                <button className="view-btn">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;