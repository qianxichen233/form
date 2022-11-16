import { useRef, useState, useEffect } from 'react';
import lodash from 'lodash';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

import Form from '../UI/Form';

const ShortAnswer = (props) => {
    const [question, setQuestion] = useState(props.content || {
        type: 'ShortAnswer',
        description: '',
        required: true
    });

    const dispatch = useDispatch();

    const questionRef = useRef(null);
    questionRef.current = question;

    useEffect(() => {
        dispatch(setQuestionStore({
            id: props.id,
            content: questionRef.current
        }));
    }, [dispatch, props.id]);

    const onQuestionChangeHandler = (e) => {
        let newQuestion = lodash.cloneDeep(questionRef.current);
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
                placeholder='Question Statement'
                value={question.description}
                onChange={onQuestionChangeHandler}
            ></input>
            <input
                type="checkbox"
                name="required"
                checked={question.required}
                onChange={OnRequiredChangeHandler}
            />
            <label for="required"> Required</label>
        </div>
        <input type="text" disabled></input>
    </Form>
}

export default ShortAnswer;