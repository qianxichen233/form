import { useState, useEffect, useRef } from "react";
import lodash from 'lodash';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

import classes from './MultipleChoice.module.css';

import Form from "../UI/Cart/Form";
import OptionInput from '../UI/OptionBar/OptionInput';
import OptionDeleteButton from "../UI/OptionBar/OptionDeleteButton";
import QuestionInputBar from '../UI/QuestionBar/QuestionInputBar';
import OptionInputBarDrag from '../UI/OptionBar/OptionInputBarDrag';
import RichTextEditor from "../UI/RichTextEditor/RichTextEditor";
import SlideButton from '../UI/Button/SlideButton';
import { CustomDragLayer } from "../UI/DragBar/CustomDragLayer";

import update from 'immutability-helper';

import { CircleCheckBox, BoxCheckBox  } from '../UI/Icons';

let key = 3;
const getKey = () => {
    return ++key;
}

const MultipleChoice = (props) => {
    const [Focus, setFocus] = useState(false);
    const [isDragging, setIsDargging] = useState(false);
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

    const optionContainerRef = useRef();

    useEffect(() => {
        //props.save();
        dispatch(setQuestionStore({
            id: props.id,
            content: questionRef.current
        }));
    }, [dispatch, props.id]);

    useEffect(() => {
        if(props.subtype === questionRef.current.subtype) return;
        let newQuestion = lodash.cloneDeep(questionRef.current);
        newQuestion.subtype = props.subtype;

        props.save();
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

        props.save();
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

            props.save();
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

        props.save();
        dispatch(setQuestionStore({
            id: props.id,
            content: newQuestion
        }));
        setQuestion(newQuestion);
    }

    const OnStatementChangeHandler = (clearError, content) => {
        if(clearError) props.onErrorClear();
        if(questionRef.current.description?.blocks[0].text === content['blocks'][0].text) return;
        const newQuestion = lodash.cloneDeep(questionRef.current);
        newQuestion.description = lodash.cloneDeep(content);

        props.save();
        dispatch(setQuestionStore({
            id: props.id,
            content: newQuestion
        }));
        setQuestion(newQuestion);
    }

    const OnRequiredChangeHandler = (state) => {
        const newQuestion = lodash.cloneDeep(questionRef.current);
        newQuestion.required = state;

        props.save();
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
            });
            props.save();
            dispatch(setQuestionStore({
                id: props.id,
                content: newQuestion
            }));

            return newQuestion;
        },
        )
    }

    const getContainerInfo = () => {
        return {
            y: optionContainerRef.current.getBoundingClientRect().y,
            height: optionContainerRef.current.getBoundingClientRect().height
        }
    }

    const renderCard = (option, index, preview, isDragging, children) => {
        return (
            <OptionInputBarDrag
                key={option.key}
                index={index}
                id={option.key}
                moveCard={moveCard}
                onClick={DeleteOptionHandler}
                Draggable={true}
                preview={preview}
                otherDragging={isDragging}
                getContainerInfo={getContainerInfo}
            >
                {children}
            </OptionInputBarDrag>
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
                size='big'
                width={'70%'}
                options={['bold', 'italic', 'underline', 'hyperlink', 'clearformat']}
            />
            {props.preview ? null :
            <SlideButton
                checked={question.required}
                onChange={OnRequiredChangeHandler}
                label='Required'
            />}
        </QuestionInputBar>
        <div className={classes.optionContainer} ref={optionContainerRef}>
            {question.options.map((option, index, array) => {
                const showError = props.missingItem?.type === "option" &&
                                props.missingItem?.index === index;
                return renderCard(option,
                                  index,
                                  props.preview,
                                  isDragging,
                                  <>
                    {
                        props.subtype === 'multichoice' ?
                        <CircleCheckBox className={classes.icon} size={20} color="grey"/> :
                        <BoxCheckBox className={classes.icon} size={20} color="grey"/>
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
        </div>
        <CustomDragLayer
            onDragging={setIsDargging}
        />
        {props.preview ? null : <OptionInputBarDrag>
            <OptionInput
                placeholder="Add Option"
                onClick={AddOptionHandler}
                readOnly
                onFocus={() => setFocus(true)}
                tabIndex={-1}
            ></OptionInput>
        </OptionInputBarDrag>}
    </Form>;
}

export default MultipleChoice;