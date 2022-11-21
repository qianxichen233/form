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

const Questionnaire = () => {
    const [questions, setQuestions] = useState([]);
    const [EditQuestion, setEditQuestion] = useState(0);
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
        setEditQuestion(id);
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
                if(+questionRef.current[i].props.id === +e.currentTarget.id)
                {
                    newQuestions.push(
                        <QuestionCart
                            key={key}
                            id={key}
                            onEdit={onAddQuestion}
                            onFocus={OnEditQuestionChange}
                        />
                    );
                }
            }
            setQuestions(newQuestions);
            setEditQuestion(key);
        }
        else if(name === "DeleteButton")
        {
            if(questionRef.current.length === 1) return;
            let newQuestions = [];
            for(let i = 0; i < questionRef.current.length; ++i)
                if(+questionRef.current[i].props.id !== +e.currentTarget.id)
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
                if(+questionRef.current[i].props.id === +e.currentTarget.id)
                {
                    newQuestions.push(
                        <QuestionCart
                            key={key}
                            id={key}
                            onEdit={onAddQuestion}
                            content={questionContentCopy}
                            onFocus={OnEditQuestionChange}
                        />
                    );
                }
            }
            setQuestions(newQuestions);
        }
    }

    useEffect(() => {
        const key = getKey();
        setQuestions([
            <QuestionCart
                key={key}
                id={key}
                onEdit={onAddQuestion}
                onFocus={OnEditQuestionChange}
            />
        ]);
        setEditQuestion(key);
    }, []);

    const OnSubmitHandler = async (e) => {
        e.preventDefault();
        
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
        {questions}
        <button type="submit" onClick={OnSubmitHandler}>Submit</button>
    </div>
}

export default Questionnaire;