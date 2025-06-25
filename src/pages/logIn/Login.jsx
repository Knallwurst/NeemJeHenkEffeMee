import styles from "./Login.module.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../../components/input/Input.jsx";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import Button from "../../components/button/Button.jsx";

function Login() {
  const { login } = useContext(AuthContext);
  const {
    handleSubmit,
    formState: { errors, isDirty, isValid },
    register,
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_NOVI_BACKEND_API_KEY;
  const [loginError, setLoginError] = useState("");

  async function signInHandler(data) {
    const controller = new AbortController();
    setLoginError(""); // Clear any previous errors

    try {
      const response = await axios.post(
        "https://api.datavortex.nl/neemjehenkffmee/users/authenticate",
        {
          username: data.username,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apiKey,
          },
          signal: controller.signal,
        }
      );

      login(response.data["jwt"]);
      navigate("/");
    } catch (error) {
      if (controller.signal.aborted) {
        console.error("Request cancelled:", error.response.status);
      } else {
        console.error(error.response.status);
        setLoginError("Invalid username or password. Please try again.");
      }
    }
    controller.abort();

    // Delay the page refresh by 2 seconds (2000 milliseconds)
  

  }

  return (
    <div className={styles["login-container"]}>
      <form
        onSubmit={handleSubmit(signInHandler)}
        className={styles["login-form"]}
      >
        <h2 className={styles["login-title"]}>Login</h2>

        {loginError && (
          <div className={styles["error-message"]}>{loginError}</div>
        )}

        <div className={styles["form-group"]}>
          <label htmlFor="username-field" className={styles["label"]}>
            Username:
          </label>
          <Input
            id="username-field"
            name="username"
            register={register}
            errors={errors}
            customValidateParams={{
              matchPattern: (v) =>
                /^[a-zA-Z]*[a-zA-Z0-9-_]{2,23}$/.test(v) ||
                "Only text, numbers and - or _ are allowed",
              minLength: (v) => v.length >= 2 || "Invalid name",
              maxLength: (v) =>
                v.length <= 50 || "Max. number of characters is 50",
            }}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="password-field" className={styles["label"]}>
            Password:
          </label>
          <Input
            id="password-field"
            name="password"
            type="password"
            register={register}
            errors={errors}
            customValidateParams={{
              matchPattern: (v) =>
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9';<>&|/\\]).{8,24}$/.test(
                  v
                ) || "Invalid password",
            }}
          />
        </div>

        <Button
          className={styles["login-button"]}
          type="submit"
          id="login-button"
          disabled={!isDirty || !isValid}
        >
          Login
        </Button>
      </form>
      <p className={styles["register-link"]}>
        <Link to="/register" className={styles["login-link"]}>
          Nog geen account? Klik hier om je te registreren
        </Link>
      </p>
    </div>
  );
}

export default Login;
