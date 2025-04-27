import styles from "./Register.module.css";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Input from "../../components/input/Input.jsx";
import Button from "../../components/button/Button.jsx";

function Register() {
    const { handleSubmit, formState: { errors, isDirty, isValid }, register, watch } = useForm({ mode: 'onChange' });
    const navigate = useNavigate();
    const USERNAME = /^[a-zA-Z]*[a-zA-Z0-9-_]{3,23}$/;
    const EMAIL = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9';<>&|/\\]).{8,24}$/;


    async function handleFormSubmit(data) {
        const v1 = USERNAME.test(data.username);
        const v2 = PASSWORD.test(data.password);
        const controller = new AbortController();
        const apiKey = import.meta.env.VITE_NOVI_BACKEND_API_KEY;

        try {
            // JS hack protection
            if (v1 && v2 && data.password === data["matching-password"]) {
                const controller = new AbortController();
                await axios.post(
                    'https://api.datavortex.nl/neemjehenkffmee/users',
                    {
                        username: data.username,
                        email: data.email,
                        password: data.password,
                        info: data.email,
                        authorities: [
                            {
                                authority: "USER"
                            }
                        ]
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
                navigate('/login');
            }
        } catch (error) {
            if (controller.signal.aborted) {
                console.error('Request cancelled:', error.message);
            } else {
                console.error(error);
            }
        } finally {
            controller.abort();
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleFormSubmit)} className={styles["register-form"]}>
                <h2>Register</h2>
                <label htmlFor="username-field" className={styles["label"]}>Username:</label>
                <Input
                    id="username-field"
                    name="username"
                    type="text"
                    register={register}
                    errors={errors}
                    customValidateParams={{
                        minLength: (v) => v.length >= 3 || "Invalid username",
                        maxLength: (v) => v.length <= 23 || "Max. number of characters is 23",
                        matchPattern: (v) => USERNAME.test(v) || "Only text, numbers and - or _ are allowed",
                    }}
                />
                <label htmlFor="email-field" className={styles["label"]}>Email:</label>
                <Input
                    id="email-field"
                    name="email"
                    type="text"
                    register={register}
                    errors={errors}
                    customValidateParams={{
                        matchPattern: (v) => EMAIL.test(v) || "Invalid email",
                    }}
                />
                <label htmlFor="password-field" className={styles["label"]}>Password:</label>
                <Input
                    id="password-field"
                    name="password"
                    type="password"
                    register={register}
                    errors={errors}
                    validationParams={{
                        required: {
                            value: true,
                            message: 'This field is required',
                        },
                        validate: {
                            matchPattern: (v) => PASSWORD.test(v) || "Password should be at least 8 characters long,\n" +
                                "and have at least one uppercase letter,\n" +
                                "one lowercase letter,\n" +
                                "one digit,\n" +
                                "and one special character,\n" +
                                "' ; < > & | / \\ are not allowed"
                        }
                    }}
                />
                <label htmlFor="matching-password-field" className={styles["label"]}>Confirm password:</label>
                <Input
                    id="matching-password-field"
                    name="matching-password"
                    type="password"
                    register={register}
                    errors={errors}
                    validationParams={{
                        required: {
                            value: true,
                            message: 'This field is required',
                        },
                        validate: {
                            matchPattern: (v) => PASSWORD.test(v) || "Password does not meet the requirements",
                            "match": (v) => v === watch("password") || 'Passwords do not match'
                        }
                    }}
                />
                <Button className={styles["register-button"]}
                        type="submit"
                        id="register-button"
                        disabled={!isDirty || !isValid}
                >
                    Sign Up
                </Button>
            </form>
            <p><Link to="/signin" className={styles["register-link"]}>Already registered? Sign in here</Link></p>
        </>
    );
}

export default Register;