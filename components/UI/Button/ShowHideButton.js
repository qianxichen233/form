import classes from './ShowHideButton.module.css';
import { ArrowUp, ArrowDown } from '../Icons';

const ShowHideButton = props => {
    return <div className={classes.container} onClick={props.onChange.bind(null, !props.triggered)}>
        <span>{props.text}</span>
        <div>
            {props.triggered ? <ArrowUp color='blue'/> : <ArrowDown color='blue'/>}
        </div>
    </div>
}

export default ShowHideButton;