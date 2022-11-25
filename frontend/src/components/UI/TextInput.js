import { useEffect, useRef } from 'react';
import classes from './TextInput.module.css';

const height = {
    big: '50px',
    normal: '30px',
    small: '20px'
}

const fontsize = {
    big: '24pt',
    normal: '12pt',
    small: '8pt'
}

const TextInput = (props) => {
    const {children, MissingError, preview, size, ...leftProps} = props;

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
            style={{'--height': height[size],
                    '--fontsize': fontsize[size]}}
            ref={inputRef}
        >
            {children}
        </input>
        <span className={classes.bar}/>
    </div>
}

export default TextInput;