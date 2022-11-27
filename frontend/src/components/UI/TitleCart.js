import classes from './TitleCart.module.css';

const TitleCart = (props) => {
    const className = `${classes.cart} ${props.Focus ? classes.focus : ''}`;
    return <div
        className={className}
        onClick={props.onClick}
        id={props.id}
    >
        {props.children}
    </div>
}

export default TitleCart;