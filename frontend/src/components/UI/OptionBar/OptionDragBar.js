import { forwardRef } from 'react';
import { DragButton } from '../Icons';

import classes from './OptionDragBar.module.css';

const OptionDragBar = forwardRef((props, ref) => {
    return <>
        {props.preview ? null : <span className={classes.space}></span>}
        <div
            className={classes.dragBar}
            ref={ref}
            style={{
                opacity: props.preview ? 0 : 1,
                'zIndex': props.isDragging ? '100' : '0'
            }}
            onMouseDown={e => {
                if(props.preview) e.preventDefault();
            }}>
            <DragButton />
        </div>
    </>
})

export default OptionDragBar;