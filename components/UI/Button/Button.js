import classes from "./Button.module.css";

const Button = (props) => {
    return (
        <button
            type="button"
            className={classes.button}
            onClick={props.onClick}
            style={{
                "--bg": props.bgcolor,
                "--text": props.textcolor,
                "--hoverbg": props.hoverbg || props.bgcolor,
                "--hovertext": props.hovertext || props.textcolor,
                "--border": props.bordercolor || "rgba(128, 128, 128, 0.3)",
                "--hoverborder":
                    props.hoverborder || "rgba(128, 128, 128, 0.3)",
            }}
        >
            {props.name}
        </button>
    );
};

export default Button;
