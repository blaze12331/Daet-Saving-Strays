import React, { useState } from "react";
import "./History.css";

const History = () => {
  const [filter, setFilter] = useState("approved");

  const petsData = {
    approved: [
      { id: 1, name: "Bunny", image: "https://via.placeholder.com/150", applicant: "Jackson Name" },
      { id: 2, name: "Fluffy", image: "https://via.placeholder.com/150", applicant: "Sally Name" },
      { id: 3, name: "Whiskers", image: "https://via.placeholder.com/150", applicant: "Dream Approval" },
    ],
    declined: [
      { id: 4, name: "Buddy", image: "https://via.placeholder.com/150", applicant: "Amy Smith" },
      { id: 5, name: "Rusty", image: "https://via.placeholder.com/150", applicant: "Alex Name" },
    ],
    adopted: [
      { id: 6, name: "Snowy", image: "https://via.placeholder.com/150", applicant: "Sarah Approved" },
      { id: 7, name: "Mittens", image: "https://via.placeholder.com/150", applicant: "Dream Approved" },
    ],
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="history-container">
      {/* Top Bar with Title and Filter */}
      <div className="history-header">Pet Status History</div>
      <div className="filter-container">
        <label htmlFor="filter">Filter:</label>
        <select id="filter" value={filter} onChange={handleFilterChange} className="filter-select">
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
          <option value="adopted">Adopted</option>
        </select>
      </div>

      {/* Dynamic Content Based on Filter */}
      <div className="content-container">
        <div className="card-grid">
          {petsData[filter].map((pet) => (
            <div key={pet.id} className="card">
              <img src={pet.image} alt={pet.name} className="pet-image" />
              <p>
                <strong>Pet Name:</strong> {pet.name}
              </p>
              <p>
                <strong>Applicant Name:</strong> {pet.applicant}
              </p>
              {filter === "approved" && <button className="report-btn">Report Approval</button>}
              {filter === "declined" && <button className="view-btn">View Details</button>}
              {filter === "adopted" && <button className="view-btn">View Adoption</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
