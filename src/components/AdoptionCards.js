import React, { useEffect, useState } from 'react';
import './AdoptionCards.css';
import adoptbg from '../assets/adoptbg.png';
import { db, realtimeDB } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, get } from 'firebase/database';

const AdoptionCards = () => {
  const [pets, setPets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
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

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pets'));
        const petsList = [];
  
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          const imageRef = data.imageRef;
  
          let imageData = 'https://via.placeholder.com/150';
  
          if (imageRef) {
            const imageSnapshot = await get(ref(realtimeDB, `pet-images/${imageRef}/imageData`));
            if (imageSnapshot.exists()) {
              imageData = imageSnapshot.val();
            }
          }
  
          if (data.status === 'pending') {
            petsList.push({
              id: doc.id,
              name: data.name || 'Unknown',
              description: data.description || 'No description available.',
              story: data.story || '',
              image: imageData,
            });
          }
        }
  
        setPets(petsList);
      } catch (error) {
        console.error('Error fetching pets or images:', error);
      }
    };
  
    fetchPets();
  }, []);
  

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.emailAddress.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.emailAddress = 'Invalid email address.';
    if (!formData.contactNumber.match(/^\d{10,12}$/)) newErrors.contactNumber = 'Invalid contact number.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.housingType.trim()) newErrors.housingType = 'Housing type is required.';
    if (!formData.householdDescription.trim()) newErrors.householdDescription = 'Household description is required.';
    if (!formData.familyAgreement) newErrors.familyAgreement = 'Please select Yes or No.';
    if (!formData.canProvideAttention) newErrors.canProvideAttention = 'Please select Yes or No.';
    if (!formData.allergyToDogs) newErrors.allergyToDogs = 'Please select Yes or No.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert(Object.values(newErrors).join('\n'));
      return false;
    }
    return true;
  };

  const handleConfirm = async () => {
    if (validateForm()) {
      try {
        const adopterData = {
          ...formData,
          petId: selectedId,
          status: 'pending',
        };

        await addDoc(collection(db, 'adopters'), adopterData);
        alert('Adoption form submitted successfully!');
        setIsModalOpen(false);
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

      {/* Pet Cards */}
      <div className="cards-container">
        {pets.map((pet) => (
          <div key={pet.id} className="card">
            <img
              src={pet.image}
              alt={pet.name}
              className="card-image"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
            />
            <h3 className="card-name">{pet.name}</h3>
            <button onClick={() => handleAdoptClick(pet.id)} className="adopt-button">
              Adopt Me
            </button>
          </div>
        ))}
      </div>

      {/* Adoption Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Pet Adoption Application Form</h2>

            {/* Contact Information */}
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Occupation:</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Years Resided:</label>
              <input
                type="number"
                value={formData.yearsResided}
                onChange={(e) => setFormData({ ...formData, yearsResided: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Best Time to Call:</label>
              <input
                type="text"
                value={formData.bestTimeToCall}
                onChange={(e) => setFormData({ ...formData, bestTimeToCall: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Contact Number:</label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email Address:</label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
              />
            </div>

            {/* Housing and Landlord Information */}
            <div className="form-group">
              <label>What type of home do you live in?</label>
              <select
                value={formData.housingType}
                onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="House">House</option>
                <option value="Dormitory">Dormitory</option>
                <option value="Cabin">Cabin</option>
                <option value="Hut">Hut</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            {['Apartment', 'Condo', 'Dormitory'].includes(formData.housingType) && (
              <div className="form-group">
                <label>Landlord's Name:</label>
                <input
                  type="text"
                  value={formData.landlordName}
                  onChange={(e) => setFormData({ ...formData, landlordName: e.target.value })}
                />
                <label>Landlord's Contact:</label>
                <input
                  type="text"
                  value={formData.landlordContact}
                  onChange={(e) => setFormData({ ...formData, landlordContact: e.target.value })}
                />
              </div>
            )}
            <div className="form-group">
            <label>Describe your household:</label>
              <select
                value={formData.householdDescription}
                onChange={(e) => setFormData({ ...formData, householdDescription: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Active">Active</option>
                <option value="Quiet">Quiet</option>
                <option value="Noisy">Noisy</option>
                <option value="Average">Average</option>
              </select>
            </div>



            <div className="form-group">
  <label>Does anyone in the family have a known allergy to dogs?</label>
  <div className="radio-group">
    <label>
      No
      <input
        type="radio"
        name="allergyToDogs"
        value="No"
        checked={formData.allergyToDogs === 'No'}
        onChange={(e) => setFormData({ ...formData, allergyToDogs: e.target.value })}
      />
    </label>
    <label>
      Yes
      <input
        type="radio"
        name="allergyToDogs"
        value="Yes"
        checked={formData.allergyToDogs === 'Yes'}
        onChange={(e) => setFormData({ ...formData, allergyToDogs: e.target.value })}
      />
    </label>
  </div>
</div>

<div className="form-group">
  <label>Is everyone in agreement with the decision to adopt a dog?</label>
  <div className="radio-group">
    <label>
      No
      <input
        type="radio"
        name="familyAgreement"
        value="No"
        checked={formData.familyAgreement === 'No'}
        onChange={(e) => setFormData({ ...formData, familyAgreement: e.target.value })}
      />
    </label>
    <label>
      Yes
      <input
        type="radio"
        name="familyAgreement"
        value="Yes"
        checked={formData.familyAgreement === 'Yes'}
        onChange={(e) => setFormData({ ...formData, familyAgreement: e.target.value })}
      />
    </label>
  </div>
</div>

<div className="form-group">
  <label>Do you have time to provide adequate love and attention?</label>
  <div className="radio-group">
    <label>
      No
      <input
        type="radio"
        name="canProvideAttention"
        value="No"
        checked={formData.canProvideAttention === 'No'}
        onChange={(e) => setFormData({ ...formData, canProvideAttention: e.target.value })}
      />
    </label>
    <label>
      Yes
      <input
        type="radio"
        name="canProvideAttention"
        value="Yes"
        checked={formData.canProvideAttention === 'Yes'}
        onChange={(e) => setFormData({ ...formData, canProvideAttention: e.target.value })}
      />
    </label>
  </div>
</div>





            {/* Buttons */}
            <div className="button-group">
              <button className="confirm-btn" onClick={handleConfirm}>
                Submit
              </button>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptionCards;
