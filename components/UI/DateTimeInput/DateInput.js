import classes from './TimeInput.module.css';

import { DateIcon } from "../Icons";

const DateInput = () => {
    return <div className={classes.container}>
        <span className={classes.text}>Date</span>
        <div className={classes.icon}>
            <DateIcon size={20} color="grey"/>
        </div>
    </div>
}

export default DateInput;