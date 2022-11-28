import { forwardRef } from 'react';
import { MdOutlineDragIndicator } from 'react-icons/md';

import classes from './OptionDragBar.module.css';

const OptionDragBar = forwardRef((props, ref) => {
    return <div className={classes.dragBar} ref={ref}>
        <MdOutlineDragIndicator />
    </div>
})

export default OptionDragBar;