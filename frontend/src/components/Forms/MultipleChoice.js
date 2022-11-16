import { useState, useEffect, useRef } from "react";
import lodash from 'lodash';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

import Form from "../UI/Form";

let key = 3;
const getKey = () => {
    return ++key;
}

const MultipleChoice = (props) => {
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

        let newQuestion = lodash.cloneDeep(questionRef.current);

        if(e.target.type === "button")
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

    return <Form>
        <div>
            <input
                type="text"
                placeholder="Question Statement"
                value={question.description}
                onChange={OnStatementChangeHandler}
            >
            </input>
            <input
                type="checkbox"
                name="required"
                checked={question.required}
                onChange={OnRequiredChangeHandler}
            />
            <label for="required"> Required</label>
        </div>
        {question.options.map(option => {
            return <div
                        onClick={DeleteOptionHandler}
                        key={option.key}
                        id={option.key}
                    >
                        <input
                            type="text"
                            value={option.content}
                            id={option.key}
                            onChange={OnOptionContentChangeHandler}
                        ></input>
                        <button type="button">X</button>
                    </div>
        })}
        <input type="text" placeholder="Add Option" onClick={AddOptionHandler} readOnly></input>
    </Form>;
}

export default MultipleChoice;