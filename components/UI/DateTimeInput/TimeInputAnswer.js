import classes from './TimeInput.module.css';

const TimeInput = (props) => {
    return <div className={classes.container}>
    <input
        type='time'
        className={classes.input}
        value={props.value || ''}
        onChange={e => props.onChange(e.target.value)}
        readOnly={props.display}
    >
    </input>
    {props.display || <span className={classes.bar}></span>}
    </div>
}

export default TimeInput;