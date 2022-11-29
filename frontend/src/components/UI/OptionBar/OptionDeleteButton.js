import { DeleteButton } from '../Icons';

import classes from './OptionDeleteButton.module.css';

const OptionDeleteButton = (props) => {
    return <div
        name="DeleteOption"
        className={classes.container}
        onClick={e => e.target = e.currentTarget}
    >
        <DeleteButton size={30}/>
    </div>
}

export default OptionDeleteButton;