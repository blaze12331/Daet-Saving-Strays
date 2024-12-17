import React, { useEffect, useState } from "react";
import "./PetList.css";
import { db, realtimeDB } from "../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { ref as dbRef, set, push, get, remove } from "firebase/database";

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    breed: "",
    age: "",
    description: "",
    image: null,
  });
  const [editPet, setEditPet] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Fetch pets from Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pets"), async (snapshot) => {
      const petsData = [];
      for (const doc of snapshot.docs) {
        const petData = { id: doc.id, ...doc.data() };

        // Fetch image from Realtime Database
        if (petData.imageRef) {
          const imageSnapshot = await get(dbRef(realtimeDB, `pet-images/${petData.imageRef}`));
          petData.image = imageSnapshot.val()?.imageData || "";
        }
        petsData.push(petData);
      }
      setPets(petsData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddPet = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    setEditPet(null);
  };

  const handleFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (isEdit) {
        setEditPet((prev) => ({ ...prev, image: reader.result }));
      } else {
        setNewPet((prev) => ({ ...prev, image: reader.result }));
      }
    };
  };

  const handleSavePet = async () => {
    try {
      let imageRefKey = null;

      // Save image to Realtime Database
      if (imageFile) {
        const imageDbRef = push(dbRef(realtimeDB, "pet-images"));
        await set(imageDbRef, { imageData: newPet.image });
        imageRefKey = imageDbRef.key;
      }

      // Save pet data to Firestore
      const petData = {
        name: newPet.name,
        breed: newPet.breed,
        age: newPet.age,
        description: newPet.description,
        imageRef: imageRefKey,
      };
      await addDoc(collection(db, "pets"), petData);

      setNewPet({ name: "", breed: "", age: "", description: "", image: null });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding pet: ", error);
    }
  };

  const handleEditClick = (pet) => {
    setEditPet({ ...pet });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      let imageRefKey = editPet.imageRef;

      // Update image in Realtime Database if changed
      if (imageFile) {
        const imageDbRef = push(dbRef(realtimeDB, "pet-images"));
        await set(imageDbRef, { imageData: editPet.image });
        imageRefKey = imageDbRef.key;
      }

      // Update pet data in Firestore
      const petDocRef = doc(db, "pets", editPet.id);
      await updateDoc(petDocRef, {
        name: editPet.name,
        breed: editPet.breed,
        age: editPet.age,
        description: editPet.description,
        imageRef: imageRefKey,
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error updating pet: ", error);
    }
  };

  const handleDeletePet = async (petId, imageRef) => {
    try {
      // Delete pet from Firestore
      await deleteDoc(doc(db, "pets", petId));

      // Remove image from Realtime Database
      if (imageRef) {
        await remove(dbRef(realtimeDB, `pet-images/${imageRef}`));
      }
    } catch (error) {
      console.error("Error deleting pet: ", error);
    }
  };

  return (
    <div className="pet-list-container">

      {/* Pet Count Section */}
      <div className="pet-count">
        <h1 className="pet-count-number">{pets.length}</h1>
        <p className="pet-count-text">Number of Pets Listed for Adoption</p>
      </div>

      {/* Pet Grid */}
      <div className="pet-grid">
        {pets.map((pet) => (
          <div key={pet.id} className="pet-card">
            <img src={pet.image} alt={pet.name} className="pet-image" />
            <p><strong>Name:</strong> {pet.name}</p>
            <p><strong>Breed:</strong> {pet.breed}</p>
            <p><strong>Age:</strong> {pet.age}</p>
            <div className="pet-buttons">
              <button className="edit-btn" onClick={() => handleEditClick(pet)}>Edit</button>
              <button
                className="delete-btn"
                onClick={() => handleDeletePet(pet.id, pet.imageRef)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <div className="add-pet-card" onClick={handleAddPet}>
          <div className="add-icon">+</div>
          <p className="add-text">Add Pet</p>
        </div>
      </div>

      {/* Add Pet Modal */}
      {showModal && (
        <div className="modals-overlay">
          <div className="modals">
            <button className="close-btns" onClick={handleCloseModal}>X</button>
            <h2>Fill Pet Information</h2>
            <div className="modal-content">
              <label>
                Pet Name:
                <input
                  type="text"
                  value={newPet.name}
                  onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                />
              </label>
              <label>
                Age:
                <input
                  type="text"
                  value={newPet.age}
                  onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                />
              </label>
              <label>
                Breed:
                <input
                  type="text"
                  value={newPet.breed}
                  onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                />
              </label>
              <label>
                Add Pet Photos:
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </label>
              {newPet.image && (
                <div className="image-preview-box">
                  <p className="image-size-hint">Preview (Max: 150x150 pixels)</p>
                  <img src={newPet.image} alt="Preview" className="image-preview" />
                </div>
              )}
              <button className="save-btn" onClick={handleSavePet}>Add Pet</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pet Modal */}
      {showEditModal && editPet && (
        <div className="modals-overlay">
          <div className="modals">
            <button className="close-btns" onClick={handleCloseModal}>X</button>
            <h2>Edit Pet Information</h2>
            <div className="modal-content">
              <label>
                Pet Name:
                <input
                  type="text"
                  value={editPet.name}
                  onChange={(e) => setEditPet({ ...editPet, name: e.target.value })}
                />
              </label>
              <label>
                Age:
                <input
                  type="text"
                  value={editPet.age}
                  onChange={(e) => setEditPet({ ...editPet, age: e.target.value })}
                />
              </label>
              <label>
                Breed:
                <input
                  type="text"
                  value={editPet.breed}
                  onChange={(e) => setEditPet({ ...editPet, breed: e.target.value })}
                />
              </label>
              <label>
                Add Pet Photos:
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, true)} />
              </label>
              {editPet.image && (
                <div className="image-preview-box">
                  <p className="image-size-hint">Preview (Max: 150x150 pixels)</p>
                  <img src={editPet.image} alt="Preview" className="image-preview" />
                </div>
              )}
              <button className="save-btn" onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetList;
