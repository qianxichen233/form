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
        description: '',
        options: [
            {
                content: '',
                key: 0,
                focus: false
            },
            {
                content: '',
                key: 1,
                focus: false
            },
            {
                content: '',
                key: 2,
                focus: false
            },
            {
                content: '',
                key: 3,
                focus: false
            }
        ]
    });

    const dispatch = useDispatch()

    const questionRef = useRef();
    questionRef.current = question;

    useEffect(() => {
        dispatch(setQuestionStore({
            id: props.id,
            content: questionRef.current
        }));
    }, []);

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

        if(e.target.type == "button")
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
        newQuestion.options = newQuestion.options.map(option => {
            return {
                ...option,
                focus: false
            }
        });
        const key = getKey();
        newQuestion.options.push(
            {
                content: '',
                key: key,
                focus: true
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

    return <Form>
        <div>
            <input
                type="text"
                placeholder="Question Statement"
                value={question.description}
                onChange={OnStatementChangeHandler}
                >
            </input>
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
                            autoFocus={option.focus}
                        ></input>
                        <button type="button">X</button>
                    </div>
        })}
        <input type="text" placeholder="Add Option" onClick={AddOptionHandler} readOnly></input>
    </Form>;
}

export default MultipleChoice;