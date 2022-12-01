import classes from './TextOptionButton.module.css';

const TextOptionButton = (props) => {
    const {children, active, ...leftProps} = props;

    return <button
            {...leftProps}
            type='button'
            tabIndex={-1}
            className={`${classes.button} ${active ? classes.active : ''}`}
    >
        {children}
    </button>
}

export default TextOptionButton;