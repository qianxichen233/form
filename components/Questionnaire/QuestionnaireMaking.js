import { useEffect, useRef, useState } from "react";
import lodash from "lodash";

import FormTitleCart from "../QuestionCart/FormTitleCart";
import QuestionCart from "../QuestionCart/QuestionCart";
import UndoPopup from "../popups/UndoPopup";
import { useSelector, useDispatch } from "react-redux";
import { deleteQuestionStore } from "../stores/questionSlice";

import classes from "./Questionnaire.module.css";

import html2canvas from "html2canvas";

const TitleKey = 0;

const Questionnaire = (props) => {
    const questions = props.questions;
    const setQuestions = props.questionsChange;

    const [EditQuestion, setEditQuestion] = useState(TitleKey);
    const [ErrorHint, setErrorHint] = useState();
    const [ScrollTo, setScrollTo] = useState({
        trigger: false,
    });
    const [undo, setUndo] = useState(null);
    const [imageGenerator, setImageGenerator] = useState(false);

    const questionContent = useSelector((state) => state.question.questions);

    const dispatch = useDispatch();

    const QuestionnaireRef = useRef();

    const questionRef = useRef();
    questionRef.current = questions;

    const questionContentRef = useRef();
    questionContentRef.current = questionContent;

    const EditQuestionRef = useRef();
    EditQuestionRef.current = EditQuestion;

    useEffect(() => {
        if (!props.error) return;
        setEditQuestion(props.error.id);
        setErrorHint(props.error);
        setScrollTo({
            trigger: true,
            target: props.error.id,
        });
    }, [props.error]);

    const updatePreview = async () => {
        if (!QuestionnaireRef.current) return;
        if (props.hide) return;
        const targetWidth = 400;
        const targetHeight = 400;
        const ratio = targetWidth / QuestionnaireRef.current.offsetWidth;

        const canvas = await html2canvas(QuestionnaireRef.current, {
            scale: ratio,
            height: targetHeight / ratio,
            backgroundColor: "rgb(240, 235, 248)",
        });

        if (canvas.width === 0 || canvas.height === 0) return;

        await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.id}/preview`,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image: canvas.toDataURL(),
                }),
            }
        );
    };

    useEffect(() => {
        if (QuestionnaireRef && !imageGenerator) {
            setTimeout(() => {
                updatePreview();
            }, 1000);
            setInterval(() => {
                updatePreview();
            }, 60 * 1000);
            setImageGenerator(true);
        }
    }, [QuestionnaireRef]);

    const OnEditQuestionChange = (id) => {
        if (id === EditQuestionRef) return;
        setEditQuestion(id);
    };

    const ClearErrorMessage = () => {
        props.clearError();
        setErrorHint(null);
    };

    const UndoDelete = (originalQuestion, key, clearID) => {
        props.save();
        setQuestions(originalQuestion);
        setEditQuestion(key);
        clearTimeout(clearID);
        setUndo(null);
    };

    const onChangeQuestion = (e) => {
        OnEditQuestionChange(e.currentTarget.id);
        if (!e.target.attributes["name"]) return;
        const name = e.target.attributes["name"].value;
        if (name === "AddButton") {
            let AddedType;
            for (const question of questionContentRef.current) {
                if (question.key === e.currentTarget.id)
                    AddedType = {
                        type: question.content.type,
                        subtype: question.content.subtype,
                    };
            }
            if (AddedType.type === "DateTimeInput") AddedType = null;

            let newQuestions = [];
            const key = props.getKey();
            for (let i = 0; i < questionRef.current.length; ++i) {
                newQuestions.push(questionRef.current[i]);
                if (questionRef.current[i].id === e.currentTarget.id) {
                    newQuestions.push({
                        key: key,
                        id: key,
                        initialType: AddedType,
                    });
                }
            }
            setQuestions(newQuestions);
            setEditQuestion(key);
        } else if (name === "DeleteButton") {
            let questionContentCopy;
            for (const question of questionContentRef.current) {
                if (question.key === e.currentTarget.id)
                    questionContentCopy = question.content;
            }

            if (questionRef.current.length === 1) return;

            let newQuestions = [];
            const originalQuestions = lodash.cloneDeep(questionRef.current);
            let originalQuestionsIndex;
            for (let i = 0; i < questionRef.current.length; ++i) {
                if (questionRef.current[i].id !== e.currentTarget.id)
                    newQuestions.push(questionRef.current[i]);
                else originalQuestionsIndex = i;
            }

            setQuestions(newQuestions);
            dispatch(deleteQuestionStore({ id: e.currentTarget.id }));

            if (originalQuestions[originalQuestionsIndex].initialType)
                delete originalQuestions[originalQuestionsIndex].initialType;
            originalQuestions[originalQuestionsIndex].content =
                questionContentCopy;

            const clearUndo = setTimeout(() => {
                setUndo(null);
            }, 10000);

            setUndo((prev) => {
                if (prev) clearTimeout(prev.clearUndo);
                return {
                    question: originalQuestions,
                    key: originalQuestions[originalQuestionsIndex].key,
                    clearUndo: clearUndo,
                };
            });
        } else if (name === "CopyButton") {
            let questionContentCopy;
            for (const question of questionContentRef.current) {
                if (question.key === e.currentTarget.id)
                    questionContentCopy = question.content;
            }

            let newQuestions = [];
            const key = props.getKey();
            for (let i = 0; i < questionRef.current.length; ++i) {
                newQuestions.push(questionRef.current[i]);
                if (questionRef.current[i].id === e.currentTarget.id) {
                    newQuestions.push({
                        key: key,
                        id: key,
                        content: questionContentCopy,
                    });
                }
            }
            setQuestions(newQuestions);
            setEditQuestion(key);
        } else if (name === "MoveUp") {
            let newQuestions = [];
            let index = 0;
            for (let i = 0; i < questionRef.current.length; ++i) {
                if (questionRef.current[i].id === e.currentTarget.id) index = i;
                newQuestions.push(questionRef.current[i]);
            }
            if (index > 0)
                [newQuestions[index], newQuestions[index - 1]] = [
                    newQuestions[index - 1],
                    newQuestions[index],
                ];
            setScrollTo({
                trigger: true,
                target: e.currentTarget.id,
            });
            setQuestions(newQuestions);
        } else if (name === "MoveDown") {
            let newQuestions = [];
            let index = 0;
            for (let i = 0; i < questionRef.current.length; ++i) {
                if (questionRef.current[i].id === e.currentTarget.id) index = i;
                newQuestions.push(questionRef.current[i]);
            }
            if (index < questionRef.current.length - 1)
                [newQuestions[index], newQuestions[index + 1]] = [
                    newQuestions[index + 1],
                    newQuestions[index],
                ];
            setScrollTo({
                trigger: true,
                target: e.currentTarget.id,
            });
            setQuestions(newQuestions);
        }
        props.save();
    };

    const onTitleCartClick = (e) => {
        OnEditQuestionChange(TitleKey);
    };

    return (
        <div
            className={`${classes.questionnaire} ${
                props.hide ? classes.hide : ""
            }`}
        >
            <div className={classes.container} ref={QuestionnaireRef}>
                <FormTitleCart
                    Focus={TitleKey === EditQuestion}
                    missingItem={
                        ErrorHint?.id === TitleKey
                            ? { type: ErrorHint.type }
                            : null
                    }
                    onErrorClear={ClearErrorMessage}
                    onClick={onTitleCartClick}
                    onFocus={onTitleCartClick}
                    content={props.titleContent}
                    ScrollTo={ScrollTo.trigger && TitleKey === ScrollTo.target}
                    cancelScroll={setScrollTo.bind(null, { trigger: false })}
                    save={props.save}
                />
                {questions.map((question) => {
                    const missingItem =
                        ErrorHint?.id === question.key
                            ? {
                                  type: ErrorHint.type,
                                  index: ErrorHint.index,
                              }
                            : null;
                    return (
                        <QuestionCart
                            key={question.key}
                            id={question.key}
                            onEdit={onChangeQuestion}
                            initialType={question.initialType}
                            content={question.content}
                            Focus={question.key === EditQuestion}
                            onFocus={setEditQuestion.bind(null, question.key)}
                            missingItem={missingItem}
                            onErrorClear={ClearErrorMessage}
                            ScrollTo={
                                ScrollTo.trigger &&
                                question.key === ScrollTo.target
                            }
                            cancelScroll={setScrollTo.bind(null, {
                                trigger: false,
                            })}
                            save={props.save}
                            defaultRequired={props.defaultRequired}
                        />
                    );
                })}
            </div>
            <UndoPopup
                undo={
                    undo
                        ? UndoDelete.bind(
                              null,
                              undo.question,
                              undo.key,
                              undo.clearUndo
                          )
                        : null
                }
            />
        </div>
    );
};

export default Questionnaire;
