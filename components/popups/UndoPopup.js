import classes from './UndoPopup.module.css';

const UndoPopup = props => {
    return <div className={`${classes.container} ${props.undo ? classes.active : ''}`}>
        <span className={classes.text}>Question Deleted</span>
        <span className={classes.undo} onClick={props.undo}>UNDO</span>
    </div>
}

export default UndoPopup;