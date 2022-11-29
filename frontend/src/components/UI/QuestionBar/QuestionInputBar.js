import classes from './QuestionInputBar.module.css';

const QuestionInputBar = props => {
    return <div className={classes.container}>
        {props.children}
    </div>
}

export default QuestionInputBar;