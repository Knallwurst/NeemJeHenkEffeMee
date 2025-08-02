import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../pages/profile/Profile.module.css';
import { AuthContext } from "../../context/AuthContext.jsx";
import avatar from "../../assets/avatar.png"; // Default avatar

function Profile() {
    const { user, profilePicture, setProfilePicture } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    const [, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const apiKey = import.meta.env.VITE_NOVI_BACKEND_API_KEY;

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (file && allowedTypes.includes(file.type)) {
            setSelectedFile(file);

            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await axios.post(`https://api.datavortex.nl/neemjehenkffmee/users/${user.username}/upload`, formData, {
                    headers: {
                        "X-Api-Key": apiKey,
                        Authorization: `Bearer ${token}`,
                    }
                });

                alert("Profile picture updated successfully");

                if (response.data && response.data.file) {
                    setProfilePicture(response.data.file);
                } else {
                    navigate(0);
                }
            } catch (error) {
                console.error('Failed to update profile picture', error);
            }
        } else {
            alert("Only JPG, JPEG, and PNG files are allowed.");
            event.target.value = ""; // Reset file input
        }
    };
    return (
        <div className={styles["profile-container"]}>
            <div className={styles["avatar-wrapper"]}>
                <img
                    src={profilePicture || avatar}
                    alt="Profile Avatar"
                    className={styles["profile-avatar"]}
                />
                <input
                    type="file"
                    id="profile-picture-upload"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileChange}
                    style={{display: 'none'}}
                />
                <button
                    className={styles["edit-button"]}
                    onClick={() => document.getElementById("profile-picture-upload").click()}
                >
                    ✏️
                </button>
            </div>
            <h2>Profile</h2>
            <div className={styles["profile-info-div"]}>
                <div className={styles["user-details"]}>
                    <h3>{user.username}</h3>
                    <p>{user.email}</p>
                </div>
            </div>
            <div className={styles["section-header"]}>
                <hr className={styles["line"]}/>
                <h3 className={styles["dashboard-title"]}>Dashboard</h3>
                <hr className={styles["line"]}/>
            </div>
        </div>
    );
}

export default Profile;