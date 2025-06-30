import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';
import { AuthContext } from "../../context/AuthContext";
import avatar from "../../assets/avatar.png"; // Default avatar
import Button from '../button/Button';
import LogoutButton from "../button/LogoutButton.jsx";

function Navigation() {
    const { isAuth, user, profilePicture, logOut } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // Function to toggle the dropdown visibility
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Function to close the dropdown
    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    return (
        <nav className={styles["nav-container"]}>
            <ul className={styles["nav-items"]}>
                <li className={styles["navLeft"]}>
                    {isAuth ? (
                        <Button onClick={() => navigate("/")}>
                            Home
                        </Button>
                        ) : (
                        <Button onClick={() => navigate("/about")}>
                            Over ons
                        </Button>
                    )}
                </li>
                <li className={styles["navRight"]}>
                    {isAuth ? (
                        <div className={styles["user-dropdown-container"]}>
                            <img
                                src={profilePicture || avatar} // Gebruik context profiel foto of een default avatar
                                alt="User Avatar"
                                className={styles["avatar"]}
                                onClick={toggleDropdown}
                            />
                            {dropdownOpen && (
                                <div className={styles["dropdown-menu"]}>
                                    <div className={styles["user-info"]}>
                                        <h5 className={styles["username"]}>{user.username}</h5>
                                        <NavLink
                                            to="/profile"
                                            className={({ isActive }) =>
                                                isActive ? styles["active-navlink"] : styles["navlink"]
                                            }
                                            onClick={closeDropdown} // Sluit dropdown bij profile click
                                        >
                                            Profile
                                        </NavLink>
                                        <LogoutButton onClick={() => { logOut(); closeDropdown(); }} className={styles["nav-button-logout"]}>
                                            Uitloggen
                                        </LogoutButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Button onClick={() => navigate("/login")}>
                                Aanmelden
                            </Button>
                            <Button onClick={() => navigate("/register")}>
                                Registreren
                            </Button>
                        </>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;