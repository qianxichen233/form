import { useEffect, useState } from 'react';

import FormCard from '../profile/FormCard';

const DisplayQuestionnaire = props => {
    const [questionnaires, setQuestionnaires] = useState([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/`)
            .then(data => {
                if(!data.ok) return Promise.reject('No questionnaire');
                return data.json();
            })
            .then(questionnaires => {
                questionnaires.sort((a, b) => {
                    return new Date(b.creatat) - new Date(a.creatat);
                })
                setQuestionnaires(questionnaires);
            })
            .catch(console.log)
    }, [props.email]);

    if(!questionnaires) return null;

    return (
        <>
            {questionnaires.map(questionnaire => {
                return <FormCard
                    key={questionnaire.id}
                    formID={questionnaire.id}
                    title={questionnaire.title}
                    date={new Date(questionnaire.creatat).toLocaleDateString()}
                    time={new Date(questionnaire.creatat).toLocaleTimeString().substring(0,5)}
                    publish={questionnaire.published}
                />
            })}
        </>
    )
}

export default DisplayQuestionnaire;