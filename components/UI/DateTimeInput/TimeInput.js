import classes from './TimeInput.module.css';

import { TimeIcon } from "../Icons";

const TimeInput = () => {
    return <div className={classes.container}>
        <span className={classes.text}>Time</span>
        <div className={classes.icon}>
            <TimeIcon size={20} color="grey"/>
        </div>
    </div>
}

export default TimeInput;