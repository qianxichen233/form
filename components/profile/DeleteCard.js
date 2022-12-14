import classes from './DeleteCard.module.css';

const DeleteCard = props => {
    return <div className={classes.form}>
        <h2>Delete Questionnaire</h2>
        <p>{`Are you sure you want to permanently delete the questionnaire "${props.title}"?`}</p>
        <div className={classes.buttons}>
            <button type="button" onClick={props.onCancel}>Cancel</button>
            <button type="button" onClick={props.onDelete}>Delete</button>
        </div>
    </div>
}

export default DeleteCard;