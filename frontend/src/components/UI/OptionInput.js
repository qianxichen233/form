import classes from './OptionInput.module.css';

const OptionInput = props => {
    const {children, ...leftProps} = props;

    return <div className={classes.container}>
        <div className={classes.inputContainer}>
            <input {...leftProps} className={classes.input}>
                {children}
            </input>
            <span className={classes.bar}/>
        </div>
    </div>
}

export default OptionInput;