import { useEffect, useRef } from 'react';
import classes from './OptionInput.module.css';

const OptionInput = props => {
    const {children, MissingError, preview, ...leftProps} = props;

    const inputRef = useRef(null);
    useEffect(() => {
        if(MissingError)
            inputRef.current.focus();
    }, [MissingError]);

    return <div className={classes.container}>
        <div className={classes.inputContainer}>
            <input
                {...leftProps}
                className={`${classes.input} 
                            ${MissingError ? classes.error : ''} 
                            ${preview ? classes.preview : ''}`}
                ref={inputRef}
            >
                {children}
            </input>
            <span className={classes.bar}/>
        </div>
    </div>
}

export default OptionInput;