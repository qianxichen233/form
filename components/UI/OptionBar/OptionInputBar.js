import { DragButton } from '../Icons';

import classes from './OptionInputBar.module.css';

const OptionInputBar = ({children, isDragging, opacity, ...leftProps}) => {
    return <div
        {...leftProps}
        className={classes.option}
        style={{opacity: opacity ? opacity : '1'}}
    >
        {isDragging ? 
            <>
                <span className={classes.placeholder}></span>
                <div className={classes.icon}>
                    <DragButton color="grey"/>
                </div>
            </> : null}
        {children}
    </div>
}

export default OptionInputBar;