import { useRef, useState, useEffect } from 'react';
import lodash from 'lodash';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

import Form from '../UI/Form';
import TextInput from '../UI/TextInput';
import QuestionInputBar from '../UI/QuestionInputBar';
import TextInputBar from '../UI/TextInputBar';
import RichTextEditor from '../UI/RichTextEditor';

const ShortAnswer = (props) => {
    const [question, setQuestion] = useState(props.content || {
        type: 'ShortAnswer',
        description: null,
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

    const onQuestionChangeHandler = (clearError, content) => {
        if(clearError) props.onErrorClear();
        let newQuestion = lodash.cloneDeep(questionRef.current);
        newQuestion.description = content;

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
            <RichTextEditor
                placeholder="Question Statement"
                passValue={onQuestionChangeHandler.bind(null, props.missingItem?.type === 'description')}
                MissingError={props.missingItem?.type === "description"}
                onClick={props.missingItem?.type === "description" ? props.onErrorClear : null}
                preview={props.preview}
                onFocus={props.onFocus}
                width={'85%'}
            />
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
        <TextInputBar>
            <TextInput
                disabled={true}
                placeholder='Short Answer Text'
                preview={props.preview}
            ></TextInput>
        </TextInputBar>
    </Form>
}

export default ShortAnswer;