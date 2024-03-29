import { useRef, useState, useEffect } from "react";
import lodash from "lodash";

import { useDispatch } from "react-redux";
import { setQuestionStore } from "../stores/questionSlice";

import Form from "../UI/Cart/Form";
import TextInput from "../UI/TextInput/TextInput";
import QuestionInputBar from "../UI/QuestionBar/QuestionInputBar";
import TextInputBar from "../UI/TextInput/TextInputBar";
import RichTextEditor from "../UI/RichTextEditor/RichTextEditor";
import SlideButton from "../UI/Button/SlideButton";

const placeholder = {
    shortanswer: "Short Answer Text",
    paragraph: "Long Answer Text",
};

const TextBoxWidth = {
    shortanswer: "50%",
    paragraph: "70%",
};

const ShortAnswer = (props) => {
    const [question, setQuestion] = useState(
        props.content
            ? props.content
            : {
                  type: "TextAnswer",
                  subtype: props.subtype,
                  description: null,
                  required: props.defaultRequired,
              }
    );

    const dispatch = useDispatch();

    const questionRef = useRef(null);
    questionRef.current = question;

    useEffect(() => {
        //props.save();
        dispatch(
            setQuestionStore({
                id: props.id,
                content: questionRef.current,
            })
        );
    }, [dispatch, props.id, questionRef.current]);

    useEffect(() => {
        if (props.subtype === questionRef.current.subtype) return;
        let newQuestion = lodash.cloneDeep(questionRef.current);
        newQuestion.subtype = props.subtype;

        props.save();
        dispatch(
            setQuestionStore({
                id: props.id,
                content: newQuestion,
            })
        );
        setQuestion(newQuestion);
    }, [props.subtype, props.id, dispatch]);

    const onQuestionChangeHandler = (clearError, content) => {
        if (clearError) props.onErrorClear();
        if (
            questionRef.current.description?.blocks[0].text ===
            content["blocks"][0].text
        )
            return;
        let newQuestion = lodash.cloneDeep(questionRef.current);
        newQuestion.description = content;

        props.save();
        dispatch(
            setQuestionStore({
                id: props.id,
                content: newQuestion,
            })
        );
        setQuestion(newQuestion);
    };

    const OnRequiredChangeHandler = (state) => {
        const newQuestion = lodash.cloneDeep(questionRef.current);
        newQuestion.required = state;

        props.save();
        dispatch(
            setQuestionStore({
                id: props.id,
                content: newQuestion,
            })
        );
        setQuestion(newQuestion);
    };

    return (
        <Form>
            <QuestionInputBar>
                <RichTextEditor
                    placeholder="Question Statement"
                    value={question.description}
                    passValue={onQuestionChangeHandler.bind(
                        null,
                        props.missingItem?.type === "description"
                    )}
                    MissingError={props.missingItem?.type === "description"}
                    onClick={
                        props.missingItem?.type === "description"
                            ? props.onErrorClear
                            : null
                    }
                    preview={props.preview}
                    onFocus={props.onFocus}
                    width={"70%"}
                    size="big"
                    options={[
                        "bold",
                        "italic",
                        "underline",
                        "hyperlink",
                        "clearformat",
                    ]}
                />
                {props.preview ? null : (
                    <SlideButton
                        checked={question.required}
                        onChange={OnRequiredChangeHandler}
                        label="Required"
                    />
                )}
            </QuestionInputBar>
            <TextInputBar>
                <TextInput
                    disabled={true}
                    placeholder={placeholder[props.subtype]}
                    preview={props.preview}
                    width={TextBoxWidth[props.subtype]}
                ></TextInput>
            </TextInputBar>
        </Form>
    );
};

export default ShortAnswer;
