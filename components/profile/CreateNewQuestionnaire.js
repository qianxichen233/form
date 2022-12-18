import { useRouter } from 'next/router';
import Cardclasses from './FormCard.module.css';
import classes from './NewForm.module.css';

import { FormAdd } from '../UI/Icons';

const CreateNewQuestionnaire = props => {
    const router = useRouter();
    const createNewQuestionnaire = async (id) => {
        await fetch(`api/questionnaire/${id}`,{
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'Untitled Form',
                    content: {},
                    publish: false
                })
            });
    }

    const onClickHandler = async () => {
        await fetch('/api/questionnaire/newID')
            .then(res => res.json())
            .then(msg => {
                createNewQuestionnaire(msg.id);
                router.push(`/questionnaire/${msg.id}/edit`);
            })
            .catch(console.log);
    }
    return <div
        className={Cardclasses.card}
        onClick={onClickHandler}
    >
        <div className={classes.icon}>
            <FormAdd size={50}/>
        </div>
    </div>
}

export default CreateNewQuestionnaire;