import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../pages/profile/Profile.module.css';
import Button from "../../components/button/Button";
import { AuthContext } from "../../context/AuthContext.jsx";
import avatar from "../../assets/avatar.png"; // Default avatar

function Profile() {
    const { user, profilePicture, setProfilePicture } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const apiKey = import.meta.env.VITE_NOVI_BACKEND_API_KEY;

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (file && allowedTypes.includes(file.type)) {
            setSelectedFile(file);
        } else {
            alert("Only JPG, JPEG, and PNG files are allowed.");
            event.target.value = ""; // Reset file input if invalid
        }
    };

    async function handleProfileUpdate() {
        if (!selectedFile) return alert("Please select a valid image file.");

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post(`https://api.datavortex.nl/neemjehenkffmee/users/${user.username}/upload`, formData, {
                headers: {
                    "X-Api-Key": apiKey,
                    Authorization: `Bearer ${token}`,
                }
            });
            alert("Profile picture updated successfully");

            // If the backend returns the new URL, update the context profile picture immediately
            if (response.data && response.data.file) {
                setProfilePicture(response.data.file); // Update in context to reflect across the app
            } else {
                navigate(0); // Reload page if no URL is returned
            }
        } catch (error) {
            console.error('Failed to update profile picture', error);
        }
    }

    return (
        <div className={styles["profile-container"]}>
            <h2>Profile</h2>
            <div className={styles["profile-info"]}>
                <img
                    src={profilePicture || avatar} // Use context profile picture or default avatar
                    alt="Profile Avatar"
                    className={styles["profile-avatar"]}
                />
                <div className={styles["user-details"]}>
                    <h3>{user.username}</h3>
                    <p>{user.email}</p>
                </div>
            </div>
            <div className={styles["update-picture"]}>
                <label htmlFor="profile-picture-upload">Update Profile Picture:</label>
                <input
                    type="file"
                    id="profile-picture-upload"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileChange}
                />
                <Button onClick={handleProfileUpdate}>Update Picture</Button>
            </div>
        </div>
    );
}

export default Profile;