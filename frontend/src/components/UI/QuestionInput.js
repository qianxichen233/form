import classes from './QuestionInput.module.css';

const QuestionInput = (props) => {
    const {children, ...leftProps} = props;

    return <div className={classes.container}>
        <input {...leftProps} className={classes.input}>
            {children}
        </input>
        <span className={classes.bar}/>
    </div>
}

export default QuestionInput;