import classes from './TimeInput.module.css';

const DateInputAnswer = (props) => {
    return <div className={classes.container}>
        <input
            type='date'
            className={classes.input}
            value={props.value || ''}
            onChange={e => props.onChange(e.target.value)}
            readOnly={props.display}
        >
        </input>
        {props.display || <span className={classes.bar}></span>}
    </div>
}

export default DateInputAnswer;