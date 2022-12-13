import { useRouter } from 'next/router';
import classes from './FormCard.module.css';

const FormCard = props => {
    const router = useRouter();

    return <div
        className={classes.card}
        onClick={() => router.push(`/questionnaire/${props.formID}/edit`)}
    >
        <div className={classes.preview}>
            <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.formID}/preview`}
                width='200px'
            />
        </div>
        <div className={classes.textContainer}>
            <p className={classes.formtitle}>{props.title}</p>
            <p className={classes.formtime}>Edited At {props.date} {props.time}</p>
        </div>
    </div>
}

export default FormCard;