import { useEffect, useRef } from 'react';

import classes from './TitleCart.module.css';

const TitleCart = (props) => {
    const className = `${classes.borderLeft} ${props.Focus ? classes.focus : ''}`;

    const ref = useRef(null);

    useEffect(() => {
        if(props.ScrollTo && ref.current)
        {
            ref.current.scrollIntoView();
            props.cancelScroll();
        }
    }, [props.ScrollTo, ref.current]);

    return <div
        className={classes.cart}
        onClick={props.onClick}
        id={props.id}
        ref={ref}
    >
        <div className={classes.borderTop}></div>
        <div className={className}></div>
        {props.children}
    </div>
}

export default TitleCart;