import { useState } from 'react';
import classes from './SlideButton.module.css';

const SlideButton = (props) => {
    const [state, setState] = useState(props.checked ? props.checked : false);

    return(
    <div className={classes.container}>
        {props.labelPos === 'left' && <label>{props.label}</label>}
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
        {props.labelPos !== 'left' && <label>{props.label}</label>}
    </div>)
}

export default SlideButton;