import { useRef, useState, useEffect } from 'react';
import lodash from 'lodash';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

import Form from '../UI/Form';
import QuestionInput from '../UI/QuestionInput';
import OptionInput from '../UI/OptionInput';
import QuestionInputBar from '../UI/QuestionInputBar';
import OptionInputBar from '../UI/OptionInputBar';

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

    const onQuestionChangeHandler = (clearError, e) => {
        if(clearError) props.onErrorClear();
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
        <QuestionInputBar>
            <QuestionInput
                type="text"
                placeholder='Question Statement'
                value={question.description}
                onChange={onQuestionChangeHandler.bind(null, props.missingItem?.type === "description")}
                MissingError={props.missingItem?.type === "description"}
                onClick={props.missingItem?.type === "description" ? props.onErrorClear : null}
                preview={props.preview}
            ></QuestionInput>
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
        <OptionInputBar>
            <OptionInput
                type="text"
                disabled
                preview={props.preview}
            ></OptionInput>
        </OptionInputBar>
    </Form>
}

export default ShortAnswer;