import classes from './CartDragBar.module.css';
import { MdDragHandle } from 'react-icons/md';

const DragBar = (props) => {
    return <div className={classes.dragBar} onClick={props.onClick}>
        <MdDragHandle size={20}/>
    </div>
}

export default DragBar;