import { useEffect, useRef, useState } from 'react';
import classes from './ChoiceBar.module.css';

const ChoiceBar = props => {
    const refs = useRef(Array(props.options.length));
    const [Indicator, setIndicator] = useState(null);
    
    const containerRef = useRef();

    const getLeftValue = (name) => {
        let optionLeft;
        for(let i = 0; i < props.options.length; ++i)
        {
            if(props.options[i] === name)
            {
                optionLeft = refs.current[i]?.getBoundingClientRect().left;
                break;
            }
        }
        if(!optionLeft) return;
        return optionLeft - containerRef.current.getBoundingClientRect().left;
    }

    const getWidthValue = (name) => {
        for(let i = 0; i < props.options.length; ++i)
        {
            if(!refs.current[i]) return;
            if(props.options[i] === name)
                return refs.current[i]?.offsetWidth;
        }
    }

    useEffect(() => {
        const left = getLeftValue(props.active);
        const width = getWidthValue(props.active);
        if(left === null || width === null) return;
        setIndicator(
            <div
                style={{
                    left: left,
                    width: width
                }}
            ></div>
        );
    }, [refs.current, props.active]);

    return <div className={classes.choice} ref={containerRef}>
        {props.options.map((option, index) => {
            return <span
                key={index}
                className={`${props.active === option ? classes.active : ''}`}
                ref={el => refs.current[index] = el}
                onClick={props.onChange.bind(null, option)}
            >
                {option}
            </span>
        })}
        {Indicator}
    </div>
}

export default ChoiceBar;