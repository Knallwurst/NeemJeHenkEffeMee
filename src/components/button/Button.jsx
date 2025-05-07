import styles from "./Button.module.css";

function Button({ onClick, children, type, disabled = false }) {
  return (
    <button
      className={styles["nav-button"]}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
