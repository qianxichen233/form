import { useEffect, useRef, useState } from 'react';

import FormTitle from '../Forms/FormTitle';
import QuestionCart from '../QuestionCart/QuestionCart';

import classes from './Questionnaire.module.css';

const Questionnaire = () => {
    const [questions, setQuestions] = useState([]);

    const questionRef = useRef();
    questionRef.current = questions;

    const onADQuestion = (e) => {
        if(e.target.name === "AddButton")
        {
            let newQuestions = [];
            for(let i = 0; i < questionRef.current.length; ++i)
            {
                const key = Math.random();
                newQuestions.push(questionRef.current[i]);
                if(+questionRef.current[i].props.id === +e.currentTarget.id)
                {
                    newQuestions.push(
                        <QuestionCart key={key} id={key} onEdit={onADQuestion}/>
                    );
                }
            }
            setQuestions(newQuestions);
        }
        else if(e.target.name === "DeleteButton")
        {
            if(questionRef.current.length == 1) return;
            let newQuestions = [];
            for(let i = 0; i < questionRef.current.length; ++i)
                if(+questionRef.current[i].props.id !== +e.currentTarget.id)
                    newQuestions.push(questionRef.current[i]);
            setQuestions(newQuestions);
        }
    }

    useEffect(() => {
        const key = Math.random();
        setQuestions([
            <QuestionCart key={key} id={key} onEdit={onADQuestion}/>
        ]);
    }, []);

    return <div className={classes.questionnaire}>
        <FormTitle/>
        {questions}
    </div>
}

export default Questionnaire;