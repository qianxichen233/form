import classes from './HintBar.module.css';

const HintBar = props => {
    return <div className={`${classes.container} ${props.active ? classes.active : ''}`}>
        <span className={classes.text}>{props.text}</span>
    </div>
}

export default HintBar;