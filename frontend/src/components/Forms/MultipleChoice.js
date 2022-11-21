import { useState, useEffect, useRef } from "react";
import lodash from 'lodash';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

import classes from './MultipleChoice.module.css';

import Form from "../UI/Form";
import QuestionInput from '../UI/QuestionInput';
import OptionInput from '../UI/OptionInput';
import OptionDeleteButton from "../UI/OptionDeleteButton";

import { RiCheckboxBlankCircleLine } from 'react-icons/ri';

let key = 3;
const getKey = () => {
    return ++key;
}

const MultipleChoice = (props) => {
    const [Focus, setFocus] = useState(false);
    const [question, setQuestion] = useState(props.content || {
        type: 'MultipleChoice',
        description: '',
        options: [
            {
                content: '',
                key: 0
            },
            {
                content: '',
                key: 1
            },
            {
                content: '',
                key: 2
            },
            {
                content: '',
                key: 3
            }
        ],
        required: true
    });

    const dispatch = useDispatch()

    const questionRef = useRef();
    questionRef.current = question;

    useEffect(() => {
        dispatch(setQuestionStore({
            id: props.id,
            content: questionRef.current
        }));
    }, [dispatch, props.id]);

    const OnOptionContentChangeHandler = (e) => {
        let newQuestion = lodash.cloneDeep(questionRef.current);

        for(const option of newQuestion.options)
        {
            if(option.key === +e.currentTarget.id)
                option.content = e.target.value;
        }

        dispatch(setQuestionStore({
            id: props.id,
            content: newQuestion
        }));
        setQuestion(newQuestion);
    }

    const DeleteOptionHandler = (e) => {
        e.preventDefault();

        if(!e.target.attributes['name']) return;

        let newQuestion = lodash.cloneDeep(questionRef.current);

        if(e.target.attributes['name'].value === "DeleteOption")
        {
            if(newQuestion.options.length <= 2) return;
            newQuestion.options = newQuestion.options.filter((option) => {
                return option.key !== +e.currentTarget.id;
            });

            dispatch(setQuestionStore({
                id: props.id,
                content: newQuestion
            }));
            setQuestion(newQuestion);
        }
    }

    const AddOptionHandler = (e) => {
        e.preventDefault();

        let newQuestion = lodash.cloneDeep(questionRef.current);
        const key = getKey();
        newQuestion.options.push(
            {
                content: '',
                key: key
            }
        );

        dispatch(setQuestionStore({
            id: props.id,
            content: newQuestion
        }));
        setQuestion(newQuestion);
    }

    const OnStatementChangeHandler = (e) => {
        const newQuestion = lodash.cloneDeep(questionRef.current);
        newQuestion.description = e.target.value;

        dispatch(setQuestionStore({
            id: props.id,
            content: newQuestion
        }));
        setQuestion(newQuestion);
    }

    const OnRequiredChangeHandler = (e) => {
        const newQuestion = lodash.cloneDeep(questionRef.current);
        newQuestion.required = e.target.checked;

        dispatch(setQuestionStore({
            id: props.id,
            content: newQuestion
        }));
        setQuestion(newQuestion);
    }
    console.log(props.missingItem);
    return <Form>
        <div>
            <QuestionInput
                type="text"
                placeholder="Question Statement"
                value={question.description}
                onChange={OnStatementChangeHandler}
                MissingError={props.missingItem?.type === "description"}
                onClick={props.missingItem?.type === "description" ? props.onErrorClear : null}
            >
            </QuestionInput>
            <input
                type="checkbox"
                name="required"
                checked={question.required}
                onChange={OnRequiredChangeHandler}
            />
            <label htmlFor="required"> Required</label>
        </div>
        {question.options.map((option, index, array) => {
            return <div
                        className={classes.option}
                        onClick={DeleteOptionHandler}
                        key={option.key}
                        id={option.key}
                    >
                        <RiCheckboxBlankCircleLine className={classes.icon} size={20}/>
                        <OptionInput
                            type="text"
                            value={option.content}
                            id={option.key}
                            onChange={OnOptionContentChangeHandler}
                            placeholder={`Option ${index + 1}`}
                            autoFocus={index === array.length - 1 && Focus}
                            onFocus={() => {
                                if(index === array.length - 1 && Focus)
                                    setFocus(false);
                            }}
                            MissingError={
                                props.missingItem?.type === "option" &&
                                props.missingItem?.index === index
                            }
                            onClick={
                                props.missingItem?.type === "option" &&
                                props.missingItem?.index === index ?
                                props.onErrorClear : null
                            }
                        ></OptionInput>
                        <OptionDeleteButton/>
                    </div>
        })}
        <OptionInput
            type="text"
            placeholder="Add Option"
            onClick={AddOptionHandler}
            readOnly
            onFocus={() => setFocus(true)}
        ></OptionInput>
    </Form>;
}

export default MultipleChoice;