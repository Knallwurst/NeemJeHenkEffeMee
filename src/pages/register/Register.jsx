import styles from "./Register.module.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../../components/input/Input.jsx";
import Button from "../../components/button/Button.jsx";
import { useState } from "react";

function Register() {
  const {
    handleSubmit,
    formState: { errors, isDirty, isValid },
    register,
    watch,
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate();
  const VALID_USERNAME_PATTERN = /^[a-zA-Z]*[a-zA-Z0-9-_]{3,23}$/;
  const VALID_EMAIL_PATTERN = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const VALID_PASSWORD_PATTERN =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9';<>&|/\\]).{8,24}$/;

  const [registerError, setRegisterError] = useState("");

  async function handleFormSubmit(data) {
    setRegisterError(""); // Clear any previous errors

    const isUsernameValid = VALID_USERNAME_PATTERN.test(data.username);
    const isPasswordValid = VALID_PASSWORD_PATTERN.test(data.password);
    const isEmailValid = VALID_EMAIL_PATTERN.test(data.email);

    const controller = new AbortController();
    const apiKey = import.meta.env.VITE_NOVI_BACKEND_API_KEY;
    console.log(isUsernameValid,isPasswordValid,data.password,data["matching-password"])

    try {
      if (!isUsernameValid) {
        setRegisterError("Gebruikersnaam is niet mogelijk");
        return;
      }
      if (!isPasswordValid) {
        setRegisterError("Wachtwoord is niet sterk genoeg");
        return;
      }
      if (!isEmailValid) {
        setRegisterError("Email is niet mogelijk");
        return;
      }
      if (data.password !== data["matching-password"]) {
        setRegisterError("Wachtwoorden komen niet overeen");
        return;
      }

      const controller = new AbortController();
    
      await axios.post(
        "https://api.datavortex.nl/neemjehenkffmee/users",
        {
          username: data.username,
          email: data.email,
          password: data.password,
          info: data.email,
          authorities: [
            {
              authority: "USER",
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apiKey,
          },
          signal: controller.signal,
        }
      );

      console.log("Registration successful");
      navigate("/login");
    } catch (error) {
      if (controller.signal.aborted) {
        console.error("Request cancelled:", error.message);
      } else {        
        console.error(error);
        setRegisterError("Invalid username or email, or not sufficiently strong password. Please try again.");
      }
    } finally {
      controller.abort();
    }
  }

  return (
    <div className={styles["register-container"]}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={styles["register-form"]}
      >
          <h2 className={styles["register-title"]}>Registreren</h2>
          {registerError && (
            <div className={styles["error-message"]}>{registerError}</div>
          )}

          <label htmlFor="username-field" className={styles["label"]}>
          Username:
        </label>
        <Input
          id="username-field"
          name="username"
          type="text"
          register={register}
          errors={errors}
          customValidateParams={{
            minLength: (v) => v.length >= 3 || "Invalid username",
            maxLength: (v) =>
              v.length <= 23 || "Max. number of characters is 23",
            matchPattern: (v) =>
              VALID_USERNAME_PATTERN.test(v) || "Only text, numbers and - or _ are allowed",
          }}
        />
        <label htmlFor="email-field" className={styles["label"]}>
          Email:
        </label>
        <Input
          id="email-field"
          name="email"
          type="text"
          register={register}
          errors={errors}
          customValidateParams={{
            matchPattern: (v) => VALID_EMAIL_PATTERN.test(v) || "Invalid email",
          }}
        />
        <label htmlFor="password-field" className={styles["label"]}>
          Password:
        </label>
        <Input
          id="password-field"
          name="password"
          type="password"
          register={register}
          errors={errors}
          validationParams={{
            required: {
              value: true,
              message: "This field is required",
            },
            validate: {
              matchPattern: (v) =>
                VALID_PASSWORD_PATTERN.test(v) ||
                "Password should be at least 8 characters long,\n" +
                  "and have at least one uppercase letter,\n" +
                  "one lowercase letter,\n" +
                  "one digit,\n" +
                  "and one special character,\n" +
                  "' ; < > & | / \\ are not allowed",
            },
          }}
        />
        <label htmlFor="matching-password-field" className={styles["label"]}>
          Confirm password:
        </label>
        <Input
          id="matching-password-field"
          name="matching-password"
          type="password"
          register={register}
          errors={errors}
          validationParams={{
            required: {
              value: true,
              message: "This field is required",
            },
            validate: {
              matchPattern: (v) =>
                VALID_PASSWORD_PATTERN.test(v) || "Password does not meet the requirements",
              match: (v) => v === watch("password") || "Passwords do not match",
            },
          }}
        />
        <Button
          className={styles["register-button"]}
          type="submit"
          id="register-button"
          disabled={!isDirty || !isValid}

        >
          Registreren
        </Button>
      </form>
      <p className={styles["register-link"]}>
        <Link to="/login" className={styles["register-link"]}>
          Heb je al een account aangemaakt? Klik dan hier om in te loggen
        </Link>
      </p>
    </div>
  );
}

export default Register;
