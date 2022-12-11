import { useEffect, useRef } from 'react';

import classes from './Cart.module.css';

const Cart = (props) => {
    const className = `${classes.cart} ${props.Focus ? classes.focus : ''} ${props.Error ? classes.error : ''}`;

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

export default Cart;