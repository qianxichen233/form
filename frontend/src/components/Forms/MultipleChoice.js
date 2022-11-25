import { useState, useEffect, useRef } from "react";
import lodash from 'lodash';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

import classes from './MultipleChoice.module.css';

import Form from "../UI/Form";
import QuestionInput from '../UI/QuestionInput';
import OptionInput from '../UI/OptionInput';
import OptionDeleteButton from "../UI/OptionDeleteButton";
import QuestionInputBar from '../UI/QuestionInputBar';
import OptionInputBar from '../UI/OptionInputBar';

import { RiCheckboxBlankCircleLine } from 'react-icons/ri';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';

let key = 3;
const getKey = () => {
    return ++key;
}

const MultipleChoice = (props) => {
    const [Focus, setFocus] = useState(false);
    const [question, setQuestion] = useState(props.content || {
        type: 'MultipleChoice',
        subtype: props.subtype ? props.subtype : 'multichoice',
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

    const dispatch = useDispatch();

    const questionRef = useRef();
    questionRef.current = question;

    useEffect(() => {
        dispatch(setQuestionStore({
            id: props.id,
            content: questionRef.current
        }));
    }, [dispatch, props.id]);


    useEffect(() => {
        let newQuestion = lodash.cloneDeep(questionRef.current);
        newQuestion.subtype = props.subtype;

        dispatch(setQuestionStore({
            id: props.id,
            content: newQuestion
        }));
        setQuestion(newQuestion);
    }, [props.subtype, props.id, dispatch]);

    const OnOptionContentChangeHandler = (clearError, e) => {
        if(clearError) props.onErrorClear();
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

    const OnStatementChangeHandler = (clearError, e) => {
        if(clearError) props.onErrorClear();
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

    return <Form>
        <QuestionInputBar>
            <QuestionInput
                placeholder="Question Statement"
                value={question.description}
                onChange={OnStatementChangeHandler.bind(null, props.missingItem?.type === 'description')}
                MissingError={props.missingItem?.type === "description"}
                onClick={props.missingItem?.type === "description" ? props.onErrorClear : null}
                preview={props.preview}
                onFocus={props.onFocus}
            >
            </QuestionInput>
            {props.preview ? null :
            <>
                <input
                    type="checkbox"
                    name="required"
                    checked={question.required}
                    onChange={OnRequiredChangeHandler}
                />
                <label htmlFor="required"> Required</label>
            </>}
        </QuestionInputBar>
        {question.options.map((option, index, array) => {
            const showError = props.missingItem?.type === "option" &&
                              props.missingItem?.index === index;
            return <OptionInputBar
                        onClick={DeleteOptionHandler}
                        key={option.key}
                        id={option.key}
                    >
                        {
                            props.subtype === 'multichoice' ?
                            <RiCheckboxBlankCircleLine className={classes.icon} size={20}/> :
                            <MdCheckBoxOutlineBlank className={classes.icon} size={20}/>
                        }
                        <OptionInput
                            value={option.content}
                            id={option.key}
                            onChange={OnOptionContentChangeHandler.bind(null, showError)}
                            placeholder={`Option ${index + 1}`}
                            autoFocus={(index === array.length - 1 && Focus)}
                            onFocus={() => {
                                if(index === array.length - 1 && Focus)
                                    setFocus(false);
                            }}
                            MissingError={showError}
                            onClick={
                                showError ?
                                props.onErrorClear : null
                            }
                            preview={props.preview}
                        ></OptionInput>
                        {props.preview ? null : <OptionDeleteButton/>}
                    </OptionInputBar>
        })}
        {props.preview ? null : <OptionInputBar>
            <OptionInput
                placeholder="Add Option"
                onClick={AddOptionHandler}
                readOnly
                onFocus={() => setFocus(true)}
            ></OptionInput>
        </OptionInputBar>}
    </Form>;
}

export default MultipleChoice;