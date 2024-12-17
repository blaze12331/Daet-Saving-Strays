import React from 'react';
import './AboutUs.css';
import teamImage from '../assets/team.png';
import rescueImage from '../assets/rescue.png';

const AboutUs = () => {



  return (
    <div>
        <div className="au-about-us-container">
          <div className="au-image-section">
            <img
              src={teamImage}
              alt="Team with rescued animals"
              className="au-team-image"
            />
          </div>
          <div className="au-content-section">
            <h2>Meet Our Dedicated Team</h2>
            <p>
              At Daet Saving Strays, our mission is to provide compassionate care and safe shelters for stray animals. Our team is committed to advocating for animal welfare and ensuring every stray has a chance at a better life.
            </p>
            <div className="au-stats-container">
              <div className="au-stat-item">
                <h3>100 animals rescued</h3>
                <p>We have successfully rescued over 100 animals since our founding in 2020, thanks to the support of our community.</p>
              </div>
              <div className="au-stat-item">
                <h3>50 volunteers</h3>
                <p>Our dedicated volunteers play a crucial role in our mission, contributing their time and effort to help stray animals in need.</p>
              </div>
              <div className="au-stat-item">
                <h3>10 years</h3>
                <p>With over 10 years of combined experience in animal rescue, our team is equipped to handle various challenges in animal welfare.</p>
              </div>
              <div className="au-stat-item">
                <h3>Community</h3>
                <p>We actively engage with our community, educating over 200 members about responsible pet ownership and the importance of adoption.</p>
              </div>
            </div>
          </div>

          {/* Rescue Section */}
          <div className="au-rescue-section">
            <div className="au-rescue-text-container">
              <div className="au-rescue-text">
                <h2>Rescue, Rehabilitate, Rehome</h2>
                <p>
                  At Daet Saving Strays, we are dedicated to rescuing stray animals in need. Our team provides compassionate care and medical attention to ensure each animal is healthy and ready for a new home. Through our rehabilitation programs, we prepare these animals for adoption, giving them a second chance at life.
                </p>
                <p>
                  Our rehoming process is thorough and ensures that each animal finds a loving and safe environment. We work closely with potential adopters to match them with the perfect pet, ensuring a happy and lasting relationship.
                </p>
              </div>
            </div>
            <div className="au-rescue-images">
              <img src={rescueImage} alt="Rescue operations" />
            </div>
          </div>

          {/* Rehome Section */}
          <div className="au-rehome-section">
            <div className="au-rehome-content">
              <h1>
                Join Us in Making a <span className="au-highlight">Difference</span> for Strays
              </h1>
              <p>
                Your support can transform the lives of stray animals. Whether through donations or volunteering, every effort counts. Help us provide medical care, shelter, and love to those in need.
              </p>
              <div className="au-rehome-options">
                <div className="au-rehome-option">
                  <h2>Donate</h2>
                  <p>Contribute funds to support medical care and shelter.</p>
                </div>
                <div className="au-rehome-option">
                  <h2>Volunteer</h2>
                  <p>Join our team to help care for and rehabilitate animals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    </div>
  );
};

export default AboutUs;
