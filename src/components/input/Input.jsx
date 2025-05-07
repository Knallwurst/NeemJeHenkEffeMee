import {useEffect} from "react";
import styles from "./Input.module.css";

function Input({id, type, name, register, errors, customValidateParams, placeholder}) { // Add 'placeholder' as a prop
    useEffect(() => {
        register(name);
    }, [name, register, type, errors]);

    const validationParams = {
        required: {
            value: true,
            message: 'Dit veld is verplicht',
        },
        validate: {}
    };

    if (customValidateParams) {
        validationParams.validate = customValidateParams;
    }

    const inputProps = {
        id: id,
        type: type,
        placeholder: placeholder || "",  // If placeholder is provided, use it, otherwise default to an empty string
        ...register(name, validationParams)
    };

    return (
        <div className={styles["input-wrapper"]}>
            <input
                {...inputProps}
                className={styles["input__password"]}
            />
            {errors[name] && <small className={styles["errors"]}>{errors[name].message}</small>}
        </div>
    );
}

export default Input;