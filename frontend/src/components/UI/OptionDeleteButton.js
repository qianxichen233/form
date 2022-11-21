import { TiDeleteOutline } from 'react-icons/ti';

import classes from './OptionDeleteButton.module.css';

const OptionDeleteButton = (props) => {
    return <div
        name="DeleteOption"
        className={classes.container}
        onClick={e => e.target = e.currentTarget}
    >
        <TiDeleteOutline size={30}/>
    </div>
}

export default OptionDeleteButton;