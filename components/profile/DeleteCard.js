import Button from '../UI/Button/Button';

import classes from './DeleteCard.module.css';

const DeleteCard = props => {
    return <div className={classes.form}>
        <h2>Delete Form</h2>
        <p>{`Are you sure you want to permanently delete the Form "${props.title}"?`}</p>
        <div className={classes.buttons}>
            <Button
                name="Cancel"
                onClick={props.onCancel}
                bgcolor="white"
                textcolor="purple"
                hoverbg="rgba(211,211,211,0.3)"
                hovertext="black"
                hoverborder="#4d90fe"
            />
            <Button
                name="Delete"
                onClick={props.onDelete}
                bgcolor="#4d90fe"
                textcolor="white"
                hoverbg="#407bda"
            />
        </div>
    </div>
}

export default DeleteCard;