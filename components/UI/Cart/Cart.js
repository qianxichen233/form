import React, { useEffect, useRef } from 'react';

import classes from './Cart.module.css';

const Cart = React.forwardRef((props, cartRef) => {
    const className = `${classes.cart} ${props.Error ? classes.error : ''} ${props.className ? props.className : ''}`;
    const borderClass = `${classes.borderLeft} ${props.Focus ? classes.focus : ''}`;

    const ref = useRef(null);

    useEffect(() => {
        if(props.ScrollTo && ref.current)
        {
            ref.current.scrollIntoView();
            props.cancelScroll();
        }
    }, [props.ScrollTo, ref.current]);

    useEffect(() => {
        if(cartRef)
            cartRef.current = ref.current;
    }, [ref.current]);

    return <div
        className={className}
        onClick={props.onClick}
        id={props.id}
        ref={ref}
    >
        <div className={borderClass}></div>
        {props.children}
    </div>
});

export default Cart;