import { useEffect, useRef } from 'react';
import classes from './QuestionInput.module.css';

const QuestionInput = (props) => {
    const {children, MissingError, preview, ...leftProps} = props;

    const inputRef = useRef(null);
    useEffect(() => {
        if(MissingError)
            inputRef.current.focus();
    }, [MissingError]);

    return <div className={`${classes.container}`}>
        <input
            {...leftProps}
            type="text"
            className={`${classes.input} 
                        ${MissingError ? classes.error : ''} 
                        ${preview ? classes.preview : ''}`}
            ref={inputRef}
        >
            {children}
        </input>
        <span className={classes.bar}/>
    </div>
}

export default QuestionInput;