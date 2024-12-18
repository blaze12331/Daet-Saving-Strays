import React, { useState, useEffect, useRef } from "react";
import "./History.css";
import { db, realtimeDB } from "../config/firebase";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, get } from "firebase/database";
import emailjs from "@emailjs/browser";

const History = () => {
  const [filter, setFilter] = useState("approved");
  const [petsData, setPetsData] = useState({
    approved: [],
    declined: [],
    adopted: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const isFetched = useRef(false); // Flag to prevent redundant fetches

  // Fetch Data Once
  const fetchAdoptersData = async () => {
    setIsLoading(true);
    try {
      const adoptersSnapshot = await getDocs(collection(db, "adopters"));
      const approved = [];
      const declined = [];
      const adopted = [];

      for (const docSnap of adoptersSnapshot.docs) {
        const data = docSnap.data();

        let petData = { name: "Unknown Pet", breed: "N/A", description: "No description available." };
        let imageUrl = "https://via.placeholder.com/150";

        if (data.petId) {
          const petDoc = await getDoc(doc(db, "pets", data.petId));
          if (petDoc.exists()) {
            petData = petDoc.data();
            if (petData.imageRef) {
              const imageSnapshot = await get(ref(realtimeDB, `pet-images/${petData.imageRef}/imageData`));
              if (imageSnapshot.exists()) imageUrl = imageSnapshot.val();
            }
          }
        }

        const petRecord = {
          id: docSnap.id,
          petId: data.petId || "",
          name: petData.name || "Unknown Pet",
          breed: petData.breed || "N/A",
          description: petData.description || "No description available.",
          applicant: data.fullName || "No Applicant Name",
          email: data.emailAddress || "No Email",
          image: imageUrl,
          status: data.status,
        };

        if (data.status === "approved") approved.push(petRecord);
        else if (data.status === "declined") declined.push(petRecord);
        else if (data.status === "adopted") adopted.push(petRecord);
      }

      setPetsData({ approved, declined, adopted });
      isFetched.current = true; // Mark fetch as completed
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetched.current) fetchAdoptersData(); // Fetch only once
  }, []);

  // Handle Adopt
  const handleAdopt = async (record) => {
    try {
      await updateDoc(doc(db, "adopters", record.id), { status: "adopted" });
      setPetsData((prev) => ({
        ...prev,
        approved: prev.approved.filter((pet) => pet.id !== record.id),
        adopted: [...prev.adopted, { ...record, status: "adopted" }],
      }));
    } catch (error) {
      console.error("Error updating adoption status:", error);
    }
  };

  // Handle Cancel
  const handleCancel = async (record) => {
    try {
      await updateDoc(doc(db, "adopters", record.id), { status: "denied" });
      if (record.petId) await updateDoc(doc(db, "pets", record.petId), { status: "pending" });
      sendCancellationEmail(record.email, record.name, record.applicant);

      setPetsData((prev) => ({
        ...prev,
        approved: prev.approved.filter((pet) => pet.id !== record.id),
        declined: [...prev.declined, { ...record, status: "declined" }],
      }));
    } catch (error) {
      console.error("Error updating cancellation status:", error);
    }
  };

  const sendCancellationEmail = (email, petName, applicantName) => {
    emailjs
      .send(
        "service_px40eri",
        "template_pl63pnp",
        {
          to_email: email,
          to_name: applicantName,
          subject: "Adoption Cancellation",
          message: `Dear ${applicantName},\n\nWe regret to inform you that your adoption request for ${petName} has been cancelled.`,
        },
        "3PMgbSstllEoAtI76"
      )
      .then(() => console.log("Cancellation email sent successfully!"))
      .catch((error) => console.error("Error sending email:", error));
  };

  return (
    <div className="history-container">
      <div className="history-header">Adoption Application History</div>
      <div className="filter-container">
        <label htmlFor="filter">Filter:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
          <option value="adopted">Adopted</option>
        </select>
      </div>

      <div className="content-container">
        {isLoading ? (
          <p className="loading-message">Fetching from Database...</p>
        ) : petsData[filter]?.length > 0 ? (
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
                {filter === "approved" && (
                  <>
                    <button className="adopt-btn" onClick={() => handleAdopt(pet)}>
                      Adopt
                    </button>
                    <button className="cancel-btn" onClick={() => handleCancel(pet)}>
                      Cancel
                    </button>
                  </>
                )}
                {filter !== "approved" && (
                  <button className="view-btn">View Details</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No records found for {filter} pets.</p>
        )}
      </div>
    </div>
  );
};

export default History;
