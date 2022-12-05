import { useRef, useState, useEffect } from 'react';
import lodash from 'lodash';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

import Form from '../UI/Cart/Form';
import QuestionInputBar from '../UI/QuestionBar/QuestionInputBar';
import RichTextEditorDisplay from '../UI/RichTextEditor/RichTextEditorDisplay';
import RequiredInput from '../UI/RequiredInput/RequiredInput';

import DateInput from '../UI/DateTimeInput/DateInput';
import TimeInput from '../UI/DateTimeInput/TimeInput';

const DateTimeInput = (props) => {
    return (
    <Form>
        <QuestionInputBar>
            <RichTextEditorDisplay
                value={props.description}
                width={'100%'}
                size='big'
            />
        </QuestionInputBar>
        {props.subtype === "date" ? <DateInput /> : null}
        {props.subtype === "time" ? <TimeInput /> : null}
    </Form>
    );
}

export default DateTimeInput;