import classes from './FormTitle.module.css';

const FormTitle = () => {
    return <form className={classes.form}>
        <div>
            <input type="text" placeholder="Form Title"></input>
        </div>
        <div>
            <input type="text" placeholder="description"></input>
        </div>
    </form>
}

export default FormTitle;