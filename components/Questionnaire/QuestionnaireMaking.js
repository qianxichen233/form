import { useEffect, useRef, useState } from 'react';
import lodash from 'lodash';

import FormTitleCart from '../QuestionCart/FormTitleCart';
import QuestionCart from '../QuestionCart/QuestionCart';
import UndoPopup from '../popups/UndoPopup';
import { useSelector, useDispatch } from 'react-redux';
import { deleteQuestionStore } from '../stores/questionSlice';

import { useSession } from "next-auth/react";

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

const Questionnaire = (props) => {
    const { data: session, status } = useSession();

    const [questions, setQuestions] = useState([]);
    const [EditQuestion, setEditQuestion] = useState(0);
    const [ErrorHint, setErrorHint] = useState();
    const [ScrollTo, setScrollTo] = useState({
        trigger: false,
    });
    const [undo, setUndo] = useState(null);

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

    const UndoDelete = (originalQuestion, key, clearID) => {
        setQuestions(originalQuestion);
        setEditQuestion(key);
        clearTimeout(clearID);
        setUndo(null);
    }

    const onChangeQuestion = (e) => {
        OnEditQuestionChange(e.currentTarget.id);
        if(!e.target.attributes['name']) return;
        const name = e.target.attributes['name'].value;
        if(name === "AddButton")
        {
            let AddedType;
            for(const question of questionContentRef.current)
            {
                if(question.key === +e.currentTarget.id)
                    AddedType = {type: question.content.type, subtype: question.content.subtype}
            }
            if(AddedType.type === 'DateTimeInput')
                AddedType = null;

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
                            initialType: AddedType
                        }
                    );
                }
            }
            setQuestions(newQuestions);
            setEditQuestion(+key);
        }
        else if(name === "DeleteButton")
        {
            let questionContentCopy;
            for(const question of questionContentRef.current)
            {
                if(question.key === +e.currentTarget.id)
                    questionContentCopy = question.content;
            }

            if(questionRef.current.length === 1) return;

            let newQuestions = [];
            const originalQuestions = lodash.cloneDeep(questionRef.current);
            let originalQuestionsIndex;
            for(let i = 0; i < questionRef.current.length; ++i)
            {
                if(+questionRef.current[i].id !== +e.currentTarget.id)
                    newQuestions.push(questionRef.current[i]);
                else 
                    originalQuestionsIndex = i;
            }

            setQuestions(newQuestions);
            dispatch(deleteQuestionStore({id: +e.currentTarget.id}));

            if(originalQuestions[originalQuestionsIndex].initialType)
                delete originalQuestions[originalQuestionsIndex].initialType;
            originalQuestions[originalQuestionsIndex].content = questionContentCopy;

            const clearUndo = setTimeout(() => {
                setUndo(null);
            }, 10000);

            setUndo((prev) => {
                if(prev) clearTimeout(prev.clearUndo);
                return {
                    question: originalQuestions,
                    key: originalQuestions[originalQuestionsIndex].key,
                    clearUndo: clearUndo
                }
            });

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

    const getQuestionContent = () => {
        let orderArray = questionRef.current.map(elem => elem.id);
        orderArray.unshift(TitleKey);

        let CloneQuestion = lodash.cloneDeep(questionContent);
        CloneQuestion.sort((a, b) => {
            return orderArray.indexOf(a.key) - orderArray.indexOf(b.key);
        });

        CloneQuestion = CloneQuestion.map((question, index) => {
            question.order = index;
            return question;
        });

        return CloneQuestion;
    }

    const OnSubmitHandler = async (email, e) => {
        e.preventDefault();

        let storedQuestion = getQuestionContent();

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

        storedQuestion = storedQuestion.map(question => {
            delete question.key;
            return question;
        });
        
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/modify`,{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                creator: email,
                content: storedQuestion,
                id: props.id,
                publish: true
            })
        });
    }

    const OnSaveHandler = async (email, e) => {
        e.preventDefault();

        let storedQuestion = getQuestionContent();

        storedQuestion = storedQuestion.map(question => {
            delete question.key;
            return question;
        });
        
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/modify`,{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                creator: email,
                content: storedQuestion,
                id: props.id,
                publish: false
            })
        });
    }

    const OnPreviewHandler = e => {
        e.preventDefault();
    }

    if(status === 'loading')
        return <p>Loading</p>
    if(status === 'unauthenticated')
        return <p>Prohibited!</p>
    
    return <div className={classes.questionnaire}>
        <div className={classes.placeholder}></div>
        <div className={classes.container}>
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
            <div className={classes.actionButton}>
                <button type="button" onClick={OnPreviewHandler}>Preview</button>
                <button type="button" onClick={OnSaveHandler.bind(null, session.user.email)}>Save</button>
                <button type="submit" onClick={OnSubmitHandler.bind(null, session.user.email)}>Publish</button>
            </div>
            <UndoPopup
                undo={
                    undo ? UndoDelete.bind(null, undo.question, undo.key, undo.clearUndo) : null
                }
            />
        </div>
    </div>
}

export default Questionnaire;