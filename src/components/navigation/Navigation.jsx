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
                    <Button onClick={() => navigate("/about")}>
                        Over ons
                    </Button>
                    <Button onClick={() => navigate("/")}>
                        Home
                    </Button>
                </li>

                {isAuth ? (
                    <li className={styles["navRight"]}>
                        {/* <Button onClick={() => navigate("/add-user")}>
                            Add Henk
                        </Button> */}
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
                    </li>
                ) : (
                    <li className={styles["navRight"]}>
                        <Button onClick={() => navigate("/login")}>
                            Login
                        </Button>
                        <Button onClick={() => navigate("/register")}>
                            Aanmelden
                        </Button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;