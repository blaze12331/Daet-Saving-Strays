import React from "react";
import "./Events.css"; // Import CSS file for styling
import EventImage from "../assets/puppies.png"; // Replace with actual image path

const Events = () => {
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
        <div className="event-card">
          <h3>Charity Walk</h3>
          <p>
            Join our annual walk to raise funds for stray animal care.
          </p>
        </div>
        <div className="event-card">
          <h3>Adoption Fair</h3>
          <p>
            Meet and adopt your new furry friend at our adoption fair.
          </p>
        </div>
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
