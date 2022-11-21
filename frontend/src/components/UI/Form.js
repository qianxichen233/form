import classes from './Form.module.css';

const Form = (props) => {
    return <form className={classes.form} autoComplete="off">
        {props.children}
    </form>
}

export default Form;