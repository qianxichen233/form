import classes from "./EnableBar.module.css";
import SlideButton from "../../UI/Button/SlideButton";

const EnableBar = (props) => {
    return (
        <div className={classes.container}>
            <div>
                <h4>{props.text}</h4>
                {props.description && <p>{props.description}</p>}
            </div>
            <div>
                <SlideButton
                    checked={props.enable}
                    onChange={props.onChange}
                    noMargin={true}
                />
            </div>
        </div>
    );
};

export default EnableBar;
