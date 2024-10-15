import styles from './LogoutButton.module.css';

function LogoutButton({ onClick }) {
    return (
        <button className={styles['nav-button-logout']} onClick={onClick}>
            Logout
        </button>
    );
}

export default LogoutButton;