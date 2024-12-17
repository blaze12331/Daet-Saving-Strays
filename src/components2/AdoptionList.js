import React, { useEffect, useState } from "react";
import "./AdoptionList.css";
import { db, realtimeDB } from "../config/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { ref, get } from "firebase/database";

const AdoptionList = () => {
  const [applications, setApplications] = useState([]);

  // Function to fetch applications
  const fetchApplications = async () => {
    try {
      const adoptersSnapshot = await getDocs(collection(db, "adopters"));
      const applicationsData = [];

      for (const adopterDoc of adoptersSnapshot.docs) {
        const adopter = adopterDoc.data();

        if (adopter.status && adopter.status.toLowerCase() === "pending") {
          const petId = adopter.petId;

          let petData = {
            name: "Unknown Pet",
            age: "N/A",
            breed: "N/A",
            description: "No description available.",
            imageRef: null,
          };
          let imageUrl = "https://via.placeholder.com/150";

          if (petId) {
            const petDocRef = doc(db, "pets", petId);
            const petDoc = await getDoc(petDocRef);
            if (petDoc.exists()) petData = petDoc.data();
          }

          if (petData.imageRef) {
            const imageRef = ref(realtimeDB, `pet-images/${petData.imageRef}/imageData`);
            const imageSnapshot = await get(imageRef);
            if (imageSnapshot.exists()) imageUrl = imageSnapshot.val();
          }

          applicationsData.push({
            id: adopterDoc.id,
            petId,
            petName: petData.name,
            age: petData.age,
            breed: petData.breed,
            description: petData.description,
            applicantName: `${adopter.firstName} ${adopter.lastName}`,
            email: adopter.emailAddress,
            reason: adopter.reason || "No reason provided.",
            imageUrl,
          });
        }
      }
      setApplications(applicationsData);
    } catch (error) {
      console.error("Error fetching adoption applications:", error);
    }
  };

  // Function to send email via external SMTP server
  const sendEmail = async (adopterEmail, petName, emailType) => {
    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adopterEmail,
          petName,
          emailType,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log("Email sent successfully:", result.message);
      } else {
        console.error("Failed to send email:", result.message);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Function to handle approval
  const handleApprove = async (adopterId, petId, adopterEmail, petName) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this application?");
    if (confirmApprove) {
      try {
        // 1. Update approved adopter's status
        const adopterRef = doc(db, "adopters", adopterId);
        await updateDoc(adopterRef, { status: "approved" });

        // 2. Update pet status to adopted
        const petRef = doc(db, "pets", petId);
        await updateDoc(petRef, { status: "adopted" });

        // 3. Decline all other pending adopters for this pet
        const adoptersQuery = query(collection(db, "adopters"), where("petId", "==", petId));
        const adoptersSnapshot = await getDocs(adoptersQuery);
        adoptersSnapshot.docs.forEach(async (docSnap) => {
          if (docSnap.id !== adopterId) {
            await updateDoc(doc(db, "adopters", docSnap.id), { status: "declined" });
            const otherAdopter = docSnap.data();
            await sendEmail(otherAdopter.emailAddress, petName, "declined");
          }
        });

        // 4. Send approval email
        await sendEmail(adopterEmail, petName, "approved");

        alert("Adoption request approved. Emails sent to all adopters.");
        fetchApplications();
      } catch (error) {
        console.error("Error approving adoption request:", error);
      }
    }
  };

  // Function to handle decline
  const handleDecline = async (adopterId, adopterEmail, petName) => {
    const confirmDecline = window.confirm("Are you sure you want to decline this adoption request?");
    if (confirmDecline) {
      try {
        const adopterRef = doc(db, "adopters", adopterId);
        await updateDoc(adopterRef, { status: "declined" });

        // Send decline email
        await sendEmail(adopterEmail, petName, "declined");

        alert("Adoption request has been declined.");
        fetchApplications();
      } catch (error) {
        console.error("Error declining adoption request:", error);
      }
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="al-adoption-list-container">

      <h1 className="al-title">Adoption Applicant List</h1>

      <div className="al-summary-card">
        <div className="al-adoption-count">{applications.length}</div>
        <p className="al-adoption-text">Number of Adoption Requests</p>
      </div>

      <div className="al-applications-grid">
        {applications.map((app) => (
          <div key={app.id} className="al-application-card">
            <div className="al-card-left">
              <img src={app.imageUrl} alt={`Pet ${app.petName}`} className="al-pet-image" />
            </div>
            <div className="al-card-right">
              <h2>{app.petName}</h2>
              <p>Age: {app.age} | Breed: {app.breed}</p>
              <p>Description: {app.description}</p>
              <p>Applicant: {app.applicantName}</p>
              <p>Email: {app.email}</p>

              <div className="al-action-buttons">
                <button
                  className="al-approve-btn"
                  onClick={() =>
                    handleApprove(app.id, app.petId, app.email, app.petName)
                  }
                >
                  Approve
                </button>
                <button
                  className="al-decline-btn"
                  onClick={() =>
                    handleDecline(app.id, app.email, app.petName)
                  }
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdoptionList;
