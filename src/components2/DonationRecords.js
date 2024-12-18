import React, { useState, useEffect } from "react";
import "./DonationRecords.css"; // For CSS styling
import { FaTrash } from "react-icons/fa"; // Importing the Trash icon from react-icons

const DonationRecords = () => {
  const [donation, setDonation] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    modeOfTransfer: "",
  });

  const [records, setRecords] = useState([]);

  // Dummy data for initial load
  const dummyData = [
    {
      firstName: "John",
      lastName: "Doe",
      contactNumber: "123-456-7890",
      modeOfTransfer: "Bank Transfer",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      contactNumber: "987-654-3210",
      modeOfTransfer: "Cash",
    },
    {
      firstName: "Michael",
      lastName: "Johnson",
      contactNumber: "555-123-4567",
      modeOfTransfer: "Online Payment",
    },
    {
      firstName: "Emily",
      lastName: "Davis",
      contactNumber: "444-555-6666",
      modeOfTransfer: "Bank Transfer",
    },
  ];

  // Load dummy data on component mount
  useEffect(() => {
    setRecords(dummyData);
  }, []);

  const handleDelete = (index) => {
    const newRecords = records.filter((_, i) => i !== index);
    setRecords(newRecords);
  };

  return (
    <div className="record-table">
      {records.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Contact Number</th>
              <th>Mode of Transfer</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{record.firstName}</td>
                <td>{record.lastName}</td>
                <td>{record.contactNumber}</td>
                <td>{record.modeOfTransfer}</td>
                <td>
                  <button
                    onClick={() => handleDelete(index)}
                    className="delete-btn"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No records added yet.</p>
      )}
    </div>
  );
};

export default DonationRecords;
