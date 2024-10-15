import styles from './Navigation.module.css';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext.jsx";
import avatar from "../../assets/avatar.png";
import Button from '../button/Button.jsx';
import LogoutButton from "../button/LogoutButton.jsx";

function Navigation() {
    const { isAuth, user, logOut } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // Function to toggle the dropdown visibility
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
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
                        <Button onClick={() => navigate("/add-user")}>
                            Add Henk
                        </Button>
                        <div className={styles["user-dropdown-container"]}>
                            <img
                                src={avatar}
                                alt="User Avatar"
                                className={styles["avatar"]}
                                onClick={toggleDropdown}
                            />
                            {dropdownOpen && (
                                <div className={styles["dropdown-menu"]}>
                                    <div className={styles["user"]}>
                                        <h5 className={styles["username"]}>{user.username}</h5>
                                        <LogoutButton onClick={logOut} className={styles["nav-button-logout"]}>
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