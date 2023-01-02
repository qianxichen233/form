import { useState } from "react";
import classes from "./SimpleInput.module.css";

const SimpleInput = (props) => {
    const [focus, setFocus] = useState(false);

    return (
        <div className={classes.container}>
            <form className={classes.form} autoComplete="false">
                <input
                    type="text"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    onFocus={(e) => {
                        if (props.errorHint) props.cancelError();
                        setFocus(true);
                    }}
                    onBlur={setFocus.bind(null, false)}
                />
                <span
                    className={`${classes.placeholder} ${
                        props.value || focus ? classes.active : ""
                    }`}
                >
                    {props.placeholder}
                </span>
                <div
                    className={`${classes.bar} ${focus ? classes.active : ""} ${
                        props.errorHint ? classes.error : ""
                    }`}
                ></div>
            </form>
            {props.errorHint && <span>{props.errorHint}</span>}
        </div>
    );
};

export default SimpleInput;
