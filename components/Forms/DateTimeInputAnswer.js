import { useRef, useState, useEffect } from "react";
import lodash from "lodash";

import { useDispatch } from "react-redux";
import { setQuestionStore } from "../stores/questionSlice";

import Form from "../UI/Cart/Form";
import QuestionInputBar from "../UI/QuestionBar/QuestionInputBar";
import RichTextEditorDisplay from "../UI/RichTextEditor/RichTextEditorDisplay";

import DateInputAnswer from "../UI/DateTimeInput/DateInputAnswer";
import TimeInputAnswer from "../UI/DateTimeInput/TimeInputAnswer";

const DateTimeInput = (props) => {
    return (
        <Form>
            <QuestionInputBar>
                <RichTextEditorDisplay
                    value={props.description}
                    width={"100%"}
                    size="big"
                    placeholder="Question Statement"
                    requiredHint={props.required}
                />
            </QuestionInputBar>
            {props.subtype === "date" ? (
                <DateInputAnswer
                    value={props.value}
                    onChange={props.onChange}
                    display={props.display}
                />
            ) : null}
            {props.subtype === "time" ? (
                <TimeInputAnswer
                    value={props.value}
                    onChange={props.onChange}
                    display={props.display}
                />
            ) : null}
        </Form>
    );
};

export default DateTimeInput;
