import { useState, useEffect, useRef } from "react";
import lodash from 'lodash';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

import classes from './MultipleChoice.module.css';

import Form from "../UI/Form";
import OptionInput from '../UI/OptionInput';
import OptionDeleteButton from "../UI/OptionDeleteButton";
import QuestionInputBar from '../UI/QuestionInputBar';
import OptionInputBar from '../UI/OptionInputBar';
import RichTextEditor from "../UI/RichTextEditor";
import RequiredInput from "../UI/RequiredInput";

import update from 'immutability-helper';

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
        description: null,
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

    const OnStatementChangeHandler = (clearError, content) => {
        if(clearError) props.onErrorClear();
        const newQuestion = lodash.cloneDeep(questionRef.current);
        newQuestion.description = lodash.cloneDeep(content);

        dispatch(setQuestionStore({
            id: props.id,
            content: newQuestion
        }));
        setQuestion(newQuestion);
    }

    const OnRequiredChangeHandler = (state) => {
        const newQuestion = lodash.cloneDeep(questionRef.current);
        newQuestion.required = state;

        dispatch(setQuestionStore({
            id: props.id,
            content: newQuestion
        }));
        setQuestion(newQuestion);
    }

    const moveCard = (dragIndex, hoverIndex) => {
        setQuestion((prevQuestions) => {
            let newQuestion = lodash.cloneDeep(questionRef.current);
            newQuestion.options = update(prevQuestions.options, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevQuestions.options[dragIndex]],
                ],
            })
            return newQuestion;
        },
        )
      }
      const renderCard = (option, index, children) => {
        return (
            <OptionInputBar
                key={option.key}
                index={index}
                id={option.key}
                moveCard={moveCard}
                onClick={DeleteOptionHandler}
                Dragable={true}
            >
                {children}
            </OptionInputBar>
        )
      }

    return <Form>
        <QuestionInputBar>
            <RichTextEditor
                placeholder="Question Statement"
                value={question.description}
                passValue={OnStatementChangeHandler.bind(null, props.missingItem?.type === 'description')}
                MissingError={props.missingItem?.type === "description"}
                onClick={props.missingItem?.type === "description" ? props.onErrorClear : null}
                preview={props.preview}
                onFocus={props.onFocus}
                width={'85%'}
            />
            {props.preview ? null :
            <RequiredInput
                checked={question.required}
                onChange={OnRequiredChangeHandler}
                label='Required'
            />}
        </QuestionInputBar>
        {question.options.map((option, index, array) => {
            const showError = props.missingItem?.type === "option" &&
                              props.missingItem?.index === index;
            return renderCard(option, index, <>
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
            </>);
        })}
        {props.preview ? null : <OptionInputBar>
            <OptionInput
                placeholder="Add Option"
                onClick={AddOptionHandler}
                readOnly
                onFocus={() => setFocus(true)}
                tabIndex={-1}
            ></OptionInput>
        </OptionInputBar>}
    </Form>;
}

export default MultipleChoice;