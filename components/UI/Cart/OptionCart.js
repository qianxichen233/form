import classes from './OptionCart.module.css';

const OptionCart = props => {
    return <ul
        className={classes.container}
        style={{
            width: props.width,
            zIndex: props.zIndex
        }}
    >
        {props.options.map((option, index) => {
            return <li key={index} onClick={option.onClick}>
                <div className={classes.icon}>
                    {option.Icon && <option.Icon size={20}/>}
                </div>
                <span>{option.text}</span>
            </li>
        })}
    </ul>
}

export default OptionCart;