import { useEffect, useRef, useState } from 'react';

import FormTitle from '../Forms/FormTitle';
import QuestionCart from '../QuestionCart/QuestionCart';
import { useSelector, useDispatch } from 'react-redux';
import { deleteQuestionStore } from '../stores/questionSlice';

import classes from './Questionnaire.module.css';

let key = 0;
const getKey = () => {
    return ++key;
}

const checkValidity = (questions) => {
    for(const question of questions)
    {
        if(!question.content.description)
            return {
                id: question.key,
                type: 'description'
            };
        
        if(question.content.options)
        {
            for(let i = 0; i < question.content.options.length; ++i)
                if(!question.content.options[i].content)
                    return {
                        id: question.key,
                        type: 'option',
                        index: i
                    }
        }
    }
    return null;
}

const Questionnaire = () => {
    const [questions, setQuestions] = useState([]);
    const [EditQuestion, setEditQuestion] = useState(0);
    const [ErrorHint, setErrorHint] = useState();
    const questionContent = useSelector((state) => state.question.questions);

    const dispatch = useDispatch()

    const questionRef = useRef();
    questionRef.current = questions;

    const questionContentRef = useRef();
    questionContentRef.current = questionContent;

    const EditQuestionRef = useRef();
    EditQuestionRef.current = EditQuestion;

    const OnEditQuestionChange = (id) => {
        if(id === EditQuestionRef) return;
        setEditQuestion(+id);
    }

    const ClearErrorMessage = () => {
        setErrorHint(null);
    }

    const onAddQuestion = (e) => {
        OnEditQuestionChange(e.currentTarget.id);
        if(!e.target.attributes['name']) return;
        const name = e.target.attributes['name'].value;
        if(name === "AddButton")
        {
            let newQuestions = [];
            const key = getKey();
            for(let i = 0; i < questionRef.current.length; ++i)
            {
                newQuestions.push(questionRef.current[i]);
                if(+questionRef.current[i].id === +e.currentTarget.id)
                {
                    newQuestions.push(
                        {
                            key: key,
                            id: key
                        }
                    );
                }
            }
            setQuestions(newQuestions);
            setEditQuestion(+key);
        }
        else if(name === "DeleteButton")
        {
            if(questionRef.current.length === 1) return;
            let newQuestions = [];
            for(let i = 0; i < questionRef.current.length; ++i)
                if(+questionRef.current[i].id !== +e.currentTarget.id)
                    newQuestions.push(questionRef.current[i]);
            
            dispatch(deleteQuestionStore({id: +e.currentTarget.id}))
            setQuestions(newQuestions);
        }
        else if(name === "CopyButton")
        {
            let questionContentCopy;
            for(const question of questionContentRef.current)
            {
                if(question.key === +e.currentTarget.id)
                    questionContentCopy = question.content;
            }

            let newQuestions = [];
            for(let i = 0; i < questionRef.current.length; ++i)
            {
                const key = getKey();
                newQuestions.push(questionRef.current[i]);
                if(+questionRef.current[i].id === +e.currentTarget.id)
                {
                    newQuestions.push(
                        {
                            key: key,
                            id: key,
                            content: questionContentCopy
                        }
                    );
                }
            }
            setQuestions(newQuestions);
        }
    }

    useEffect(() => {
        const key = getKey();
        setQuestions([
            {
                key: key,
                id: key
            }
        ]);
        setEditQuestion(+key);
    }, []);

    const OnSubmitHandler = async (e) => {
        e.preventDefault();

        const missingPart = checkValidity(questionContent);
        if(missingPart)
        {
            setErrorHint(missingPart);
            return;
        }
        
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/questionnaire`,{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionContent)
        });
    }

    return <div className={classes.questionnaire}>
        <FormTitle/>
        {questions.map(question => {
            return <QuestionCart
                key={question.key}
                id={question.key}
                onEdit={onAddQuestion}
                content={question.content}
                Focus={question.key === EditQuestion}
                missingItem={
                    ErrorHint?.id === question.key ?
                        {
                            type: ErrorHint.type,
                            index: ErrorHint.index
                        } : null
                }
                onErrorClear={ClearErrorMessage}
            />
        })}
        <button type="submit" onClick={OnSubmitHandler}>Submit</button>
    </div>
}

export default Questionnaire;