import React, { useEffect, useState } from "react";
import "./Events.css"; // Import your CSS file for styling
import { db, realtimeDB } from "../config/firebase"; // Firestore and RTDB configuration
import { collection, getDocs, query } from "firebase/firestore";
import { ref, get } from "firebase/database";
import EventImage from "../assets/puppies.png"; // Default image if no image is available

const Events = () => {
  const [events, setEvents] = useState([]);

  // Function to fetch upcoming events from Firestore and RTDB
  const fetchEvents = async () => {
    console.log("Fetching upcoming events...");
    try {
      const firestoreEvents = [];
      const realtimeEvents = [];
      const currentDate = new Date();

      // Fetch events from Firestore
      const eventsRef = collection(db, "events");
      const querySnapshot = await getDocs(query(eventsRef));
      for (const docSnap of querySnapshot.docs) {
        const event = docSnap.data();
        const eventId = docSnap.id;

        let imageUrl = EventImage; // Default image path

        // Fetch image from RTDB if imagePath exists
        if (event.imagePath) {
          const imageRef = ref(realtimeDB, event.imagePath);
          const imageSnapshot = await get(imageRef);
          if (imageSnapshot.exists()) {
            imageUrl = imageSnapshot.val(); // Use fetched image URL
          }
        }

        // Add event if it is upcoming
        if (new Date(event.date) > currentDate) {
          firestoreEvents.push({
            id: eventId,
            title: event.title || "Untitled Event",
            description: event.description || "No description available.",
            date: event.date || "TBD",
            image: imageUrl,
          });
        }
      }

      // Fetch events from Realtime Database
      const snapshot = await get(ref(realtimeDB, "events"));
      if (snapshot.exists()) {
        const eventsFromRTDB = snapshot.val();
        Object.entries(eventsFromRTDB).forEach(([id, event]) => {
          if (new Date(event.date) > currentDate) {
            realtimeEvents.push({
              id,
              title: event.title || "Untitled Event",
              description: event.description || "No description available.",
              date: event.date || "TBD",
              image: event.image || EventImage, // Use default image if missing
            });
          }
        });
      }

      // Combine Firestore and RTDB events, and remove duplicates
      const combinedEvents = [...firestoreEvents, ...realtimeEvents];
      const uniqueEvents = Array.from(
        new Map(combinedEvents.map((event) => [event.id, event])).values()
      );

      setEvents(uniqueEvents);
      console.log("Fetched events:", uniqueEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="events-container">
      {/* Image and Text Section */}
      <div className="events-image-text-section">
        <img src={EventImage} alt="Upcoming Events" className="events-image" />
        <div className="events-text">
          <h2>Upcoming Events</h2>
          <p>
            Join us for exciting events that support stray animal welfare.
            Participate in our charity walks, adoption fairs, and more to make
            a difference in the lives of animals in need.
          </p>
        </div>
      </div>

      {/* Title Section */}
      <div className="events-title-section">
        <h2>Upcoming Events to Support Stray Animals</h2>
        <p>
          From charity walks to adoption fairs, each event is an opportunity to
          support our mission. Participate and help us spread awareness and
          raise funds for animal welfare.
        </p>
      </div>

      {/* Cards Section */}
      <div className="events-cards-section">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <img
                src={event.image}
                alt={event.title}
                className="event-card-image"
              />
              <div className="event-card-content">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No upcoming events available at the moment.</p>
        )}
      </div>

      {/* Footer Section */}
      <div className="events-footer">
        <p>
          Your involvement can transform the lives of stray animals. Participate
          in our events, volunteer your time, or make a donation to help us
          provide care and shelter for those in need. Together, we can create a
          brighter future for these animals.
        </p>
      </div>
    </div>
  );
};

export default Events;
