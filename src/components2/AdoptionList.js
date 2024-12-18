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
import emailjs from "@emailjs/browser";

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
            applicantName: adopter.fullName || "Unknown Applicant", // Use fullName from the database
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

  // Function to send approval email
  const sendEmailApprove = async (adopterEmail, to_name, petName) => {
    console.debug("sendEmailApprove called with parameters:", {
      type: "approved",
      adopterEmail,
      to_name,
      petName,
    });

    try {
      console.log("Preparing to send approval email...");
      await emailjs.send(
        "service_px40eri",
        "template_pl63pnp",
        {
          email: adopterEmail, 
          to_name: to_name,       
          subject: "Approved",
          message: `Congratulations ${to_name}! Your adoption request for ${petName} has been approved. You may now pick ${petName}`,
        },
        "3PMgbSstllEoAtI76"
      );
      console.log(`Approval email successfully sent to ${adopterEmail} for pet ${petName}`);
    } catch (error) {
      console.error("Error sending approval email:", { error });
    }
  };

  // Function to send decline email
  const sendEmailDeny = async (adopterEmail, to_name, petName) => {
    console.debug("sendEmailDeny called with parameters:", {
      type: "declined",
      adopterEmail,
      to_name,
      petName,
    });

    try {
      console.log("Preparing to send decline email...");
      await emailjs.send(
        "service_u7x9bn9",
        "template_7y342qw",
        {
          email: adopterEmail,
          to_name: to_name,       
          subject: "Denied",
          message: `Dear ${to_name}, unfortunately, your adoption request for ${petName} has been declined. Thank you for your understanding.`,
        },
        "oi35JCfPg7qO5VrE8"
      );
      console.log(`Decline email successfully sent to ${adopterEmail} for pet ${petName}`);
    } catch (error) {
      console.error("Error sending decline email:", { error });
    }
  };

  // Handle approval
  const handleApprove = async (adopterId, petId, adopterEmail, adopterName, petName) => {
    console.log("Starting approval process for adopter:", {
      adopterId,
      petId,
      adopterEmail,
      adopterName,
      petName,
    });

    const confirmApprove = window.confirm("Are you sure you want to approve this application?");
    if (confirmApprove) {
      try {
        console.log("Updating adopter's status to 'approved'...");
        const adopterRef = doc(db, "adopters", adopterId);
        await updateDoc(adopterRef, { status: "approved" });

        console.log("Updating pet's status to 'adopted'...");
        const petRef = doc(db, "pets", petId);
        await updateDoc(petRef, { status: "adopted" });

        console.log("Sending approval email...");
        await sendEmailApprove(adopterEmail, adopterName, petName);

        alert("Adoption request approved.");
        fetchApplications();
      } catch (error) {
        console.error("Error during approval process:", error);
      }
    }
  };

  // Handle decline
  const handleDecline = async (adopterId, adopterEmail, adopterName, petName) => {
    console.log("Starting decline process for adopter:", {
      adopterId,
      adopterEmail,
      adopterName,
      petName,
    });

    const confirmDecline = window.confirm("Are you sure you want to decline this adoption request?");
    if (confirmDecline) {
      try {
        console.log("Updating adopter's status to 'declined'...");
        const adopterRef = doc(db, "adopters", adopterId);
        await updateDoc(adopterRef, { status: "declined" });

        console.log("Sending decline email...");
        await sendEmailDeny(adopterEmail, adopterName, petName);

        alert("Adoption request has been declined.");
        fetchApplications();
      } catch (error) {
        console.error("Error during decline process:", error);
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
                    handleApprove(app.id, app.petId, app.email, app.applicantName, app.petName)
                  }
                >
                  Approve
                </button>
                <button
                  className="al-decline-btn"
                  onClick={() =>
                    handleDecline(app.id, app.email, app.applicantName, app.petName)
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
