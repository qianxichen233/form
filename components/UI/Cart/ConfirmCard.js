import Button from '../Button/Button';

import classes from './ConfirmCard.module.css';

const ConfirmCard = props => {
    return <div className={classes.form}>
        <h2>{props.title}</h2>
        <p>{props.description}</p>
        <div className={classes.buttons}>
            <Button
                name={props.CancelName || "Cancel"}
                onClick={props.onCancel}
                {...props.CancelButton}
            />
            <Button
                name={props.ConfirmName || "Confirm"}
                onClick={props.onConfirm}
                {...props.ConfirmButton}
            />
        </div>
    </div>
}

export default ConfirmCard;