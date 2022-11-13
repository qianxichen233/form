import { useRef, useState, useEffect } from 'react';
import lodash from 'lodash';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

import Form from '../UI/Form';

const ShortAnswer = (props) => {
    const [question, setQuestion] = useState(props.content || {
        type: 'ShortAnswer',
        description: ''
    });

    const dispatch = useDispatch();

    const questionRef = useRef(null);
    questionRef.current = question;

    useEffect(() => {
        dispatch(setQuestionStore({
            id: props.id,
            content: questionRef.current
        }));
    }, []);

    const onQuestionChangeHandler = (e) => {
        let newQuestion = lodash.cloneDeep(questionRef.current);
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
                placeholder='Question Statement'
                value={question.description}
                onChange={onQuestionChangeHandler}
            ></input>
        </div>
        <input type="text" disabled></input>
    </Form>
}

export default ShortAnswer;