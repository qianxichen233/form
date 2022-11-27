import { useState } from 'react';
import classes from './RequiredInput.module.css';

const RequiredInput = (props) => {
    const [state, setState] = useState(props.checked ? props.checked : false);

    return(
    <div className={classes.container}>
        <div
            className={classes.inputContainer}
            onClick={() => {
                if(props.onChange) props.onChange(!state);
                setState(!state);
            }}
        >
            <div className={`${classes.circleContainer} ${state ? classes.circleContainerActive : ''}`}>
                <span className={`${classes.circle} ${state ? classes.circleActive : ''}`}></span>
            </div>
            <div className={`${classes.bar} ${state ? classes.barActive : ''}`}></div>
        </div>
        <label>{props.label}</label>
    </div>)
}

export default RequiredInput;