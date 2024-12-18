import React, { useState, useEffect } from "react";
import "./DonationRecords.css"; // For CSS styling
import { db } from "../config/firebase"; // Import Firestore configuration
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FaTrash } from "react-icons/fa"; // Importing the Trash icon from react-icons

const DonationRecords = () => {
  const [records, setRecords] = useState([]);

  // Fetch donation records from Firestore
  const fetchRecords = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "donations")); // Fetch from 'donations' collection
      const donations = [];
      querySnapshot.forEach((doc) => {
        donations.push({ id: doc.id, ...doc.data() }); // Add record with Firestore document ID
      });
      setRecords(donations);
      console.log("Fetched records:", donations);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // Delete a record from Firestore
  const handleDelete = async (recordId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteDoc(doc(db, "donations", recordId)); // Delete document by ID
        setRecords(records.filter((record) => record.id !== recordId)); // Update state to remove the record
        console.log(`Deleted record with ID: ${recordId}`);
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  // Fetch records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="record-table">
      <h2>Donation Records</h2>
      {records.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Contact Number</th>
              <th>Mode of Transfer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={record.id}>
                <td>{index + 1}</td>
                <td>{record.firstName}</td>
                <td>{record.lastName}</td>
                <td>{record.contactNumber}</td>
                <td>{record.modeOfTransfer}</td>
                <td>
                  <button
                    onClick={() => handleDelete(record.id)}
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
        <p>No donation records available.</p>
      )}
    </div>
  );
};

export default DonationRecords;
