import { useRouter } from 'next/router';
import classes from './FormCard.module.css';

const FormCard = props => {
    const router = useRouter();

    return <div
        className={classes.card}
        onClick={() => router.push(`/questionnaire/${props.formID}/edit`)}
    >
        <div className={classes.preview}>

        </div>
        <div className={classes.textContainer}>
            <p className={classes.formtitle}>{props.title}</p>
            <p>Edited At {props.time}</p>
        </div>
    </div>
}

export default FormCard;