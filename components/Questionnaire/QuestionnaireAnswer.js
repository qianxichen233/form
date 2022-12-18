import { useEffect, useRef, useState } from 'react';
import lodash from 'lodash';

import FormTitleCart from '../QuestionCart/FormTitleCart';
import QuestionCartDisplay from '../QuestionCart/QuestionCartDisplay';
import classes from './Questionnaire.module.css';
import Answerclasses from './QuestionnaireAnswer.module.css';

import { useSession } from "next-auth/react";

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
    if(!answer) return true;
    if(typeof(answer) === 'string') return false;
    if(Array.isArray(answer))
        return !answer.reduce((has, answer) => has | answer, false);
    return answer['blocks'][0]['text'] === '';
}

const QuestionnaireAnswer = (props) => {
    const { data: session, status } = useSession();

    const [notPublish, setNotPublish] = useState(true);
    const [questions, setQuestions] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [missing, setMissing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const answersRef = useRef();
    answersRef.current = answers;

    const questionssRef = useRef();
    questionssRef.current = questions;

    useEffect(() => {
        const fetchData = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.id}`)
            .then(data => {
                if(data.status === 403)
                    return null;
                return data.json();
            })
            .then(questionnaire => {
                if(questionnaire)
                {
                    const questions = JSON.parse(questionnaire.content);
                    setNotPublish(false);
                    setQuestions(questions);
                    setAnswers(new Array(questions.length)); 
                }
            })
            .catch(console.log);
        }
        if(props.id)
        {
            fetchData();
            setIsLoading(false);
        }
    }, [props.id]);

    const AnswerChangeHandler = (index, content) => {
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

        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.id}/answer`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: answersRef.current
            })
        });
    };

    if(isLoading)
    {
        return (
            <p>Loading</p>
        )
    }
    if(notPublish)
    {
        return <p>Not Published</p>
    }

    return (
    <div className={classes.questionnaire}>
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
    )
}

export default QuestionnaireAnswer;