import React from "react";
import "./Stories.css"; // Import CSS file for styling
import Story from "../assets/stories.png";
import Story2 from "../assets/Stories2.png";

// Simulated data for future fetching
const storyData = [
  {
    id: 1,
    title: "Journey of a Rescued Stray: From the Streets to a Loving Home",
    description:
      "Discover the inspiring journey of a stray animal rescued by Daet Saving Strays.",
    image: Story, // Replace with the actual image path or URL
  },
  {
    id: 2,
    title: "Journey of a Rescued Stray: From the Streets to a Loving Home",
    description:
      "Discover the inspiring journey of a stray animal rescued by Daet Saving Strays.",
    image: Story2, // Replace with the actual image path or URL
  },
  {
    id: 3,
    title: "Journey of a Rescued Stray: From the Streets to a Loving Home",
    description:
      "Discover the inspiring journey of a stray animal rescued by Daet Saving Strays.",
    image: Story, // Replace with the actual image path or URL
  },
  {
    id: 4,
    title: "Journey of a Rescued Stray: From the Streets to a Loving Home",
    description:
      "Discover the inspiring journey of a stray animal rescued by Daet Saving Strays.",
    image: Story2, // Replace with the actual image path or URL
  },
];

const Stories = () => {
  return (
    <div className="stories-container">
      <h2 className="stories-heading">Heartwarming Rescues</h2>
      <p className="stories-text">
        Discover the incredible transformations of stray animals who found loving
        homes through our dedicated efforts. Each story is a testament to the power of
        compassion and community support.
      </p>
      
      <h2 className="stories-headings">Inspiring Success Stories</h2>
      <p className="stories-texts">
        Explore heartwarming tales of rescued animals.
      </p>

      {/* Stories Grid */}
      <div className="stories-grid">
        {storyData.map((story) => (
          <div className="story-card" key={story.id} id={`story-${story.id}`}>
            <img
              src={story.image}
              alt={`Story ${story.id}`}
              className="story-image"
            />
            <div className="story-content">
              <h3>{story.title}</h3>
              <p>{story.description}</p>
              <a href={`#story-${story.id}`} className="read-more">
                Read more &gt;&gt;&gt;
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Donation Section */}
      <div className="donation-section">
        <h2>Make a Difference Today!</h2>
        <p className="donation-text">
          Your support is crucial in helping us rescue and rehabilitate stray animals.
          Join us in our mission to provide them with the care they deserve. Together,
          we can create a brighter future for these animals in need.
        </p>
        <div className="donation-buttons">
          <button className="donate-now">Donate Now</button>
          <button className="learn-more">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Stories;
