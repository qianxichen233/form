import { useEffect, useState } from 'react';

const DisplayQuestionnaire = props => {
    const [questionnaires, setQuestionnaires] = useState([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/getall`)
            .then(data => {
                if(!data.ok) return Promise.reject('No questionnaire');
                return data.json();
            })
            .then(questionnaires => setQuestionnaires(questionnaires))
            .catch(console.log)
    }, [props.email]);

    if(!questionnaires) return null;

    return (
        <div>
            {questionnaires.map(questionnaire => {
                return <p key={questionnaire.id}>{questionnaire.id}</p>
            })}
        </div>
    )
}

export default DisplayQuestionnaire;