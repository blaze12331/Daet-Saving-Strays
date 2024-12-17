import React, { useEffect, useState } from 'react';
import './AdoptionCards.css';
import adoptbg from '../assets/adoptbg.png';
import { db, realtimeDB } from '../config/firebase'; // Import Firestore and Realtime Database
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, get } from 'firebase/database';

const AdoptionCards = () => {
  const [pets, setPets] = useState([]); // State for pets
  const [selectedId, setSelectedId] = useState(null); // Selected pet ID
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [formData, setFormData] = useState({
    fullName: '',
    ic: '',
    occupation: '',
    address: '',
    yearsResided: '',
    bestTimeToCall: '',
    contactNumber: '',
    emailAddress: '',
    housingType: '',
    householdDescription: '',
    landlordName: '',
    landlordContact: '',
    allergyToDogs: '',
    familyAgreement: '',
    canProvideAttention: '',
  });
  
  const [errors, setErrors] = useState({});

  // Fetch pets and images
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pets'));
        const petsList = [];

        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          const imageRef = data.imageRef; // Image reference for RTDB

          let imageData = 'https://via.placeholder.com/150'; // Default fallback image

          // Fetch imageData from Realtime Database if imageRef exists
          if (imageRef) {
            const imageSnapshot = await get(ref(realtimeDB, `pet-images/${imageRef}/imageData`));
            if (imageSnapshot.exists()) {
              imageData = imageSnapshot.val(); // Base64 image data
            }
          }

          petsList.push({
            id: doc.id,
            name: data.name || 'Unknown',
            description: data.description || 'No description available.',
            story: data.story || '',
            image: imageData, // Store Base64 image
          });
        }

        setPets(petsList);
      } catch (error) {
        console.error('Error fetching pets or images:', error);
      }
    };

    fetchPets();
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.ic.trim()) newErrors.ic = 'IC is required.';
    if (!formData.emailAddress.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.emailAddress = 'Invalid email address.';
    if (!formData.contactNumber.match(/^\d{10,12}$/)) newErrors.contactNumber = 'Invalid contact number.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.housingType.trim()) newErrors.housingType = 'Housing type is required.';
    if (!formData.householdDescription.trim()) newErrors.householdDescription = 'Household description is required.';
    if (!formData.familyAgreement.match(/^(Yes|No)$/i)) newErrors.familyAgreement = 'Please answer Yes or No for family agreement.';
    if (!formData.canProvideAttention.match(/^(Yes|No)$/i)) newErrors.canProvideAttention = 'Please answer Yes or No for attention.';
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      alert(Object.values(newErrors).join('\n'));
      return false;
    }
    return true;
  };
  

  // Form submission
  const handleConfirm = async () => {
    if (validateForm()) {
      try {
        const adopterData = {
          petId: selectedId,
          fullName: formData.fullName,
          ic: formData.ic,
          occupation: formData.occupation,
          address: formData.address,
          yearsResided: formData.yearsResided,
          bestTimeToCall: formData.bestTimeToCall,
          contactNumber: formData.contactNumber,
          emailAddress: formData.emailAddress,
          housingType: formData.housingType,
          householdDescription: formData.householdDescription,
          landlordName: formData.landlordName,
          landlordContact: formData.landlordContact,
          allergyToDogs: formData.allergyToDogs,
          familyAgreement: formData.familyAgreement,
          canProvideAttention: formData.canProvideAttention,
          status: 'pending',
        };
  
        // Upload to Firestore
        await addDoc(collection(db, 'adopters'), adopterData);
        alert('Adoption form submitted successfully!');
        setIsModalOpen(false);
  
        // Reset Form
        setFormData({
          fullName: '',
          ic: '',
          occupation: '',
          address: '',
          yearsResided: '',
          bestTimeToCall: '',
          contactNumber: '',
          emailAddress: '',
          housingType: '',
          householdDescription: '',
          landlordName: '',
          landlordContact: '',
          allergyToDogs: '',
          familyAgreement: '',
          canProvideAttention: '',
        });
      } catch (error) {
        console.error('Error saving adoption data:', error);
        alert('Failed to save adoption details. Please try again.');
      }
    }
  };
  
  

  // Open modal
  const handleAdoptClick = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="adoption-header" style={{ backgroundImage: `url(${adoptbg})` }}>
        <h1>Adopt a Friend</h1>
        <p>Discover the joy of adopting a pet and give them a loving home.</p>
      </div>

      {/* Cards */}
      <div className="cards-container">
        {pets.map((pet) => (
          <div key={pet.id} className="card">
            <img
              src={pet.image}
              alt={pet.name}
              className="card-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150'; // Fallback image
              }}
            />
            <h3 className="card-name">{pet.name}</h3>
            <p className="card-description">{pet.description}</p>
            <p className="card-story">{pet.story}</p>
            <button onClick={() => handleAdoptClick(pet.id)} className="adopt-button">
              Adopt Me
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2 className="modal-title">Dog Adoption Application Form</h2>
      
      {/* Contact Information */}
      <h3 className="section-title">Contact Information</h3>
      <div className="form-group">
        <label>Full Name:</label>
        <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Identification ID (IC):</label>
        <input type="text" value={formData.ic} onChange={(e) => setFormData({ ...formData, ic: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Occupation:</label>
        <input type="text" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Address:</label>
        <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Number of Years Resided:</label>
        <input type="number" value={formData.yearsResided} onChange={(e) => setFormData({ ...formData, yearsResided: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Best Time to Call:</label>
        <input type="text" value={formData.bestTimeToCall} onChange={(e) => setFormData({ ...formData, bestTimeToCall: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Contact Number:</label>
        <input type="tel" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Email Address:</label>
        <input type="email" value={formData.emailAddress} onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })} />
      </div>

      {/* Family & Housing */}
      <h3 className="section-title">Family & Housing</h3>
      <div className="form-group">
        <label>What type of home do you live in?</label>
        <input type="text" value={formData.housingType} onChange={(e) => setFormData({ ...formData, housingType: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Describe your household:</label>
        <input type="text" placeholder="Active, Quiet, Noisy, Average" value={formData.householdDescription} onChange={(e) => setFormData({ ...formData, householdDescription: e.target.value })} />
      </div>
      <div className="form-group">
        <label>If you rent, landlord's name and contact number:</label>
        <input type="text" placeholder="Landlord's Name" value={formData.landlordName} onChange={(e) => setFormData({ ...formData, landlordName: e.target.value })} />
        <input type="tel" placeholder="Landlord's Contact Number" value={formData.landlordContact} onChange={(e) => setFormData({ ...formData, landlordContact: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Does anyone in the family have a known allergy to dogs?</label>
        <input type="text" placeholder="Yes / No" value={formData.allergyToDogs} onChange={(e) => setFormData({ ...formData, allergyToDogs: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Is everyone in agreement with the decision to adopt a dog?</label>
        <input type="text" placeholder="Yes / No" value={formData.familyAgreement} onChange={(e) => setFormData({ ...formData, familyAgreement: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Do you have time to provide adequate love and attention?</label>
        <input type="text" placeholder="Yes / No" value={formData.canProvideAttention} onChange={(e) => setFormData({ ...formData, canProvideAttention: e.target.value })} />
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button className="confirm-btn" onClick={handleConfirm}>Submit</button>
        <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default AdoptionCards;



