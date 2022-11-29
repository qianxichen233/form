import { useEffect, useRef } from 'react';

import classes from './TitleCart.module.css';

const TitleCart = (props) => {
    const className = `${classes.cart} ${props.Focus ? classes.focus : ''}`;

    const ref = useRef(null);

    useEffect(() => {
        if(props.ScrollTo && ref.current)
        {
            ref.current.scrollIntoView();
            props.cancelScroll();
        }
    }, [props.ScrollTo, ref.current]);

    return <div
        className={className}
        onClick={props.onClick}
        id={props.id}
        ref={ref}
    >
        {props.children}
    </div>
}

export default TitleCart;