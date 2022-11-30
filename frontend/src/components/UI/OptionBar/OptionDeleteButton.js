import { DeleteOptionButton } from '../Icons';

import classes from './OptionDeleteButton.module.css';

const OptionDeleteButton = (props) => {
    return <div
        name="DeleteOption"
        className={classes.container}
        onClick={e => e.target = e.currentTarget}
    >
        <DeleteOptionButton size={30} color="grey"/>
    </div>
}

export default OptionDeleteButton;