import classes from './Cart.module.css';

const Cart = (props) => {
    return <div className={classes.cart} onClick={props.onClick} id={props.id}>
        {props.children}
    </div>
}

export default Cart;