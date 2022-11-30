import { useEffect, useRef, useState } from 'react';
import lodash from 'lodash';

import FormTitleCart from '../QuestionCart/FormTitleCart';
import QuestionCart from '../QuestionCart/QuestionCart';
import { useSelector, useDispatch } from 'react-redux';
import { deleteQuestionStore } from '../stores/questionSlice';

import classes from './Questionnaire.module.css';

let key = 0;
const getKey = () => {
    return ++key;
}

const TitleKey = 0;

const checkRichTextEmpty = (content) => {
    if(!content) return true;
    if(typeof(content) === 'string') return false;
    return content['blocks'][0]['text'] === '';
}

const checkValidity = (questions) => {
    for(const question of questions)
    {
        if(question.content.type === 'title')
        {
            if(checkRichTextEmpty(question.content.title))
                return {
                    id: question.key,
                    type: 'title'
                }
            if(checkRichTextEmpty(question.content.description))
                return {
                    id: question.key,
                    type: 'description'
                }
            continue;
        }

        if(checkRichTextEmpty(question.content.description))
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
    const [ScrollTo, setScrollTo] = useState({
        trigger: false,
    });
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

    const onChangeQuestion = (e) => {
        OnEditQuestionChange(e.currentTarget.id);
        if(!e.target.attributes['name']) return;
        const name = e.target.attributes['name'].value;
        if(name === "AddButton")
        {
            let questionContentType;
            for(const question of questionContentRef.current)
            {
                if(question.key === +e.currentTarget.id)
                    questionContentType = {type: question.content.type, subtype: question.content.subtype}
            }

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
                            id: key,
                            initialType: questionContentType
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
            const key = getKey();
            for(let i = 0; i < questionRef.current.length; ++i)
            {
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
            setEditQuestion(key);
        }
        else if(name === "MoveUp")
        {
            let newQuestions = [];
            let index = 0;
            for(let i = 0; i < questionRef.current.length; ++i)
            {
                if(+questionRef.current[i].id === +e.currentTarget.id) index = i;
                newQuestions.push(questionRef.current[i]);
            }
            if(index > 0)
                [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
            setScrollTo({
                trigger: true,
                target: +e.currentTarget.id
            });
            setQuestions(newQuestions);
        }
        else if(name === "MoveDown")
        {
            let newQuestions = [];
            let index = 0;
            for(let i = 0; i < questionRef.current.length; ++i)
            {
                if(+questionRef.current[i].id === +e.currentTarget.id) index = i;
                newQuestions.push(questionRef.current[i]);
            }
            if(index < questionRef.current.length - 1)
                [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
            setScrollTo({
                trigger: true,
                target: +e.currentTarget.id
            });
            setQuestions(newQuestions);
        }
    }

    const onTitleCartClick = e => {
        OnEditQuestionChange(TitleKey);
    }

    useEffect(() => {
        const key = getKey();
        setQuestions([
            {
                key: key,
                id: key
            }
        ]);
        setEditQuestion(TitleKey);
    }, []);

    const OnSubmitHandler = async (e) => {
        e.preventDefault();

        let orderArray = questionRef.current.map(elem => elem.id);
        orderArray.unshift(0);

        let storedQuestion = lodash.cloneDeep(questionContent);
        storedQuestion.sort((a, b) => {
            return orderArray.indexOf(a.key) - orderArray.indexOf(b.key);
        });

        const missingPart = checkValidity(storedQuestion);
        if(missingPart)
        {
            setEditQuestion(missingPart.id);
            setErrorHint(missingPart);
            setScrollTo({
                trigger: true,
                target: missingPart.id
            });
            return;
        }
        
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/questionnaire`,{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(storedQuestion)
        });
    }
    
    return <div className={classes.questionnaire}>
        <FormTitleCart
            Focus={TitleKey === EditQuestion}
            missingItem={ErrorHint?.id === TitleKey ? {type: ErrorHint.type} : null}
            onErrorClear={ClearErrorMessage}
            onClick={onTitleCartClick}
            onFocus={onTitleCartClick}
            ScrollTo={ScrollTo.trigger && TitleKey === ScrollTo.target}
            cancelScroll={setScrollTo.bind(null, {trigger: false})}
        />
        {questions.map((question) => {
            const missingItem = ErrorHint?.id === question.key ?
                                {
                                    type: ErrorHint.type,
                                    index: ErrorHint.index
                                } : null;
            return <QuestionCart
                key={question.key}
                id={question.key}
                onEdit={onChangeQuestion}
                initialType={question.initialType}
                content={question.content}
                Focus={question.key === EditQuestion}
                onFocus={setEditQuestion.bind(null, question.key)}
                missingItem={missingItem}
                onErrorClear={ClearErrorMessage}
                ScrollTo={ScrollTo.trigger && question.key === ScrollTo.target}
                cancelScroll={setScrollTo.bind(null, {trigger: false})}
            />
        })}
        <button type="submit" onClick={OnSubmitHandler}>Submit</button>
    </div>
}

export default Questionnaire;