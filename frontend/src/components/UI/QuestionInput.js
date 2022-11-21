import classes from './QuestionInput.module.css';

const QuestionInput = (props) => {
    const {children, MissingError, ...leftProps} = props;
    console.log(MissingError);
    return <div className={`${classes.container}`}>
        <input {...leftProps} className={`${classes.input} ${MissingError ? classes.error : ''}`}>
            {children}
        </input>
        <span className={classes.bar}/>
    </div>
}

export default QuestionInput;