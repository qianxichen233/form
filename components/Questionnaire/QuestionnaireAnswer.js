import { useEffect, useRef, useState } from 'react';
import lodash from 'lodash';

import FormTitleCart from '../QuestionCart/FormTitleCart';
import QuestionCartDisplay from '../QuestionCart/QuestionCartDisplay';
import classes from './Questionnaire.module.css';
import Answerclasses from './QuestionnaireAnswer.module.css';

const AnswerableQuestions = questions => {
    const isAnswerable = (question) => {
        if(question.content.type === 'title') return 0;
        if(question.content.type === 'DateTimeInput') return 1;
        if(question.content.type === 'MultipleChoice') return 1;
        if(question.content.type === 'TextAnswer') return 1;
        return 0;
    }

    return questions.reduce((acc, question) => {
        return acc + isAnswerable(question);
    }, 0);
}

const isEmpty = (answer) => {
    console.log(answer);
    if(!answer) return true;
    if(typeof(answer) === 'string') return false;
    if(Array.isArray(answer))
        return !answer.reduce((has, answer) => has | answer, false);
    return answer['blocks'][0]['text'] === '';
}

const QuestionnaireAnswer = () => {
    const [questions, setQuestions] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [missing, setMissing] = useState(null);

    const answersRef = useRef();
    answersRef.current = answers;

    const questionssRef = useRef();
    questionssRef.current = questions;

    useEffect(() => {
        const fetchData = async () => {
            await fetch('/api/fetch')
            .then(data => data.json())
            .then(questions => {
                setQuestions(questions);
                setAnswers(new Array(questions.length)); 
            })
            .catch(console.log);
        }
        fetchData();
    }, []);

    const AnswerChangeHandler = (index, content) => {
        console.log(content)
        setAnswers((prev) => {
            let newAnswers = lodash.cloneDeep(prev);
            newAnswers[index] = content;
            if(missing === index) setMissing(null);
            return newAnswers;
        });
    };
    
    const OnSubmitHandler = async (e) => {
        e.preventDefault();
        const missingIndex = answersRef.current.findIndex((answer, index) => {
            return questionssRef.current[index].content.required && isEmpty(answer);
        });

        if(missingIndex !== -1)
        {
            setMissing(missingIndex);
            return;
        }

        await fetch('/api/answer', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: 'Anonymous',
                content: answersRef.current
            })
        });
    };

    console.log(answers);

    return <div className={classes.questionnaire}>
        <div className={classes.container}>
            {questions && questions.map((question, index) => {
                if(question.content.type === 'title')
                {
                    return <FormTitleCart
                        key={question.order}
                        display={true}
                        title={question.content.title}
                        description={question.content.description}
                    />
                }
                else
                {
                    return <QuestionCartDisplay
                        key={question.order}
                        value={answers[index]}
                        onChange={AnswerChangeHandler.bind(null, index)}
                        missingMessage={missing === index}
                        clearMissingMessage={setMissing.bind(null, null)}
                        {...question.content}
                    />
                }
            })}
            <div className={classes.actionButton}>
                <button type="submit" onClick={OnSubmitHandler}>Submit</button>
            </div>
        </div>
    </div>
}

export default QuestionnaireAnswer;