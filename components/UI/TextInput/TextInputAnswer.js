import { useEffect, useRef } from 'react';
import classes from './TextInput.module.css';

const height = {
    big: '50px',
    normal: '30px',
    small: '20px'
};

const fontsize = {
    big: '24pt',
    normal: '12pt',
    small: '8pt'
};

const TextInput = (props) => {
    const {value, width, onChange, size, placeholder} = props;

    return <div className={`${classes.container}`} style={{width}}>
        <input
            placeholder={placeholder}
            type="text"
            className={`${classes.input}`}
            style={{'--height': height[size],
                    '--fontsize': fontsize[size]}}
            value={value ? value : ''}
            onChange={(e) => onChange(e.target.value)}
        >
        </input>
        <span className={classes.bar}/>
    </div>
}

export default TextInput;