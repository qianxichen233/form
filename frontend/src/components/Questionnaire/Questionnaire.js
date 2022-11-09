import { useEffect, useState } from 'react';

import FormTitle from '../Forms/FormTitle';
import QuestionCart from '../QuestionCart/QuestionCart';

import classes from './Questionnaire.module.css';

const Questionnaire = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const key = Math.random();
        setQuestions([
            <QuestionCart key={key} id={key}/>
        ]);
    }, []);

    return <div className={classes.questionnaire}>
        <FormTitle/>
        {questions}
    </div>
}

export default Questionnaire;