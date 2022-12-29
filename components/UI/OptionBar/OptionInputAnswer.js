import { useEffect, useRef } from 'react';
import classes from './OptionInput.module.css';

const OptionInputAnswer = props => {
    return <div className={classes.container}>
        <div className={classes.inputContainer}>
            <div
                className={`${classes.input} ${classes.readOnly}`}
            >
                {props.value || props.placeholder}
            </div>
        </div>
    </div>
}

export default OptionInputAnswer;