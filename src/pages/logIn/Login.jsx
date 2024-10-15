import styles from "./Login.module.css"
import axios from "axios";
import {useNavigate, Link} from 'react-router-dom';
import {useForm} from "react-hook-form";
import Input from "../../components/input/Input.jsx";
import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import Button from "../../components/button/Button.jsx";

function Login() {
    const { login } = useContext(AuthContext);
    const {handleSubmit, formState: {errors, isDirty, isValid}, register} = useForm({mode: 'onChange'});
    const navigate = useNavigate();
    const apiKey = import.meta.env.VITE_NOVI_BACKEND_API_KEY;

    async function signInHandler(data) {
        const controller = new AbortController();

        try {
            const response = await axios.post(
                'https://api.datavortex.nl/neemjehenkffmee/users/authenticate', {
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
            navigate('/');
        } catch (error) {
            if (controller.signal.aborted) {
                console.error('Request cancelled:', error.response.status);
            } else {
                console.error(error.response.status);
            }
        }
        controller.abort();

        // Delay the page refresh by 2 seconds (2000 milliseconds)
        setTimeout(() => {
            window.location.reload(); // Refresh the page after the delay
        }, 2000);

    }

    return (
        <>
            <form onSubmit={handleSubmit(signInHandler)} className={styles["login-form"]}>
                <h2>Login</h2>

                <label htmlFor="username-field" className={styles["label"]}>Username:</label>
                <Input
                    id="username-field"
                    name="username"
                    register={register}
                    errors={errors}
                    customValidateParams={{
                        matchPattern: (v) => /^[a-zA-Z]*[a-zA-Z0-9-_]{2,23}$/.test(v) || "Only text, numbers and - or _ are allowed",
                        minLength: (v) => v.length >= 2 || "Invalid name",
                        maxLength: (v) => v.length <= 50 || "Max. number of characters is 50",
                    }}
                />
                <label htmlFor="password-field" className={styles["label"]}>Password:</label>
                <Input
                    id="password-field"
                    name="password"
                    type="password"
                    register={register}
                    errors={errors}
                    customValidateParams={{
                        matchPattern: (v) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9';<>&|/\\]).{8,24}$/.test(v) || "Invalid password"
                    }}
                />

                <Button className={styles["login-button"]}
                        type="submit"
                        id="login-button"
                        disabled={!isDirty || !isValid}
                >
                    Login
                </Button>
            </form>
            <p><Link to="/register" className={styles["login-link"]}>Need an account? Sign up here</Link></p>
        </>
    );
}

export default Login;