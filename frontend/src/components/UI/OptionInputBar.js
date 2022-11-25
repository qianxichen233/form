import classes from './OptionInputBar.module.css';

const OptionInputBar = props => {
    const {children, ...leftProps} = props;
    return <div className={classes.option} {...leftProps}>
        {children}
    </div>
}

export default OptionInputBar;