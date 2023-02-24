import { Fragment, useEffect, useRef, useState } from "react";
import lodash from "lodash";

import FormTitleCart from "../QuestionCart/FormTitleCart";
import QuestionCartDisplay from "../QuestionCart/QuestionCartDisplay";
import AccountCart from "../Forms/AccountCart";
import classes from "./Questionnaire.module.css";
import Answerclasses from "./QuestionnaireAnswer.module.css";
import Button from "../UI/Button/Button";
import Head from "next/head";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const AnswerableQuestions = (questions) => {
    const isAnswerable = (question) => {
        if (question.content.type === "title") return 0;
        if (question.content.type === "DateTimeInput") return 1;
        if (question.content.type === "MultipleChoice") return 1;
        if (question.content.type === "TextAnswer") return 1;
        return 0;
    };

    return questions.reduce((acc, question) => {
        return acc + isAnswerable(question);
    }, 0);
};

const shuffle = (array) => {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 1) {
        randomIndex = Math.floor(Math.random() * (currentIndex - 1)) + 1;
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
};

const isEmpty = (answer) => {
    if (!answer) return true;
    if (typeof answer === "string") return false;
    if (Array.isArray(answer))
        return !answer.reduce((has, answer) => has | answer, false);
    return answer["blocks"][0]["text"] === "";
};

const defaultOptions = {
    quiz: false,
    collectEmail: false,
    limitResponse: false,
    shuffleOrder: false,
    linkToNewResponse: true,
    defaultRequired: false,
    confirmMessage: "Your response has been recorded",
};

const submitButton = {
    enable: {
        bgcolor: "rgb(103, 58, 183)",
        textcolor: "white",
        hoverbg: "rgb(122 79 199)",
    },
    disable: {
        bgcolor: "lightgrey",
        textcolor: "grey",
    },
};

const QuestionnaireAnswer = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [notPublish, setNotPublish] = useState(true);
    const [questions, setQuestions] = useState(null);
    const [options, setOptions] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [missing, setMissing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [submited, setSubmited] = useState(false);
    const [responded, setResponded] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [hasRequiredQuestion, setHasRequiredQuestion] = useState(false);

    const answersRef = useRef();
    answersRef.current = answers;

    const questionsRef = useRef();
    questionsRef.current = questions;

    const submitNotValid = options?.limitResponse && (!session || responded);

    useEffect(() => {
        const fetchData = async () => {
            await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.id}`
            )
                .then((data) => {
                    if (data.status === 403) return null;
                    return data.json();
                })
                .then((questionnaire) => {
                    if (questionnaire) {
                        const questions = JSON.parse(questionnaire.content);
                        let options = JSON.parse(questionnaire.options);
                        if (Object.keys(options).length === 0)
                            options = defaultOptions;
                        if (options.shuffleOrder) shuffle(questions);
                        setNotPublish(false);
                        setQuestions(questions);
                        setAnswers(new Array(questions.length));
                        setOptions(options);
                        setResponded(questionnaire.responded);
                        setPreviewMode(!questionnaire.published);
                        setHasRequiredQuestion(
                            questions.reduce((acc, question) => {
                                return acc || question.content.required;
                            }, false)
                        );
                    }
                })
                .catch(console.log);
        };
        if (props.id) {
            fetchData();
            setIsLoading(false);
        }
    }, [props.id]);

    const AnswerChangeHandler = (index, content) => {
        setAnswers((prev) => {
            let newAnswers = lodash.cloneDeep(prev);
            newAnswers[index] = content;
            if (missing === index) setMissing(null);
            return newAnswers;
        });
    };

    const OnSubmitHandler = async () => {
        if (submitNotValid || previewMode) return;
        const missingIndex = answersRef.current.findIndex((answer, index) => {
            return (
                questionsRef.current[index].content.required && isEmpty(answer)
            );
        });

        if (missingIndex !== -1) {
            setMissing(missingIndex);
            return;
        }

        let submitedAnswers = lodash.cloneDeep(answersRef.current);

        for (let i = 0; i < questionsRef.current.length; ++i) {
            let content = submitedAnswers[i];
            if (
                content &&
                questionsRef.current[i].content.type === "MultipleChoice"
            ) {
                let newContent = [];
                for (
                    let j = 0;
                    j < questionsRef.current[i].content.options.length;
                    ++j
                )
                    if (content[j])
                        newContent.push(
                            questionsRef.current[i].content.options[j].content
                        );

                content = newContent;
            }
            submitedAnswers[i] = {
                key: questionsRef.current[i].key,
                content,
            };
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.id}/answer`,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: submitedAnswers,
                }),
            }
        );
        if (response.ok) {
            setSubmited(true);
            return;
        }
        const error = await response.json();
        console.log(error);
    };

    const getFormTitle = (questions) => {
        return questions.find((question) => {
            return question.content.type === "title";
        }).content.title;
    };

    if (isLoading || status === "loading") {
        return <p>Loading</p>;
    }
    if (notPublish) {
        return <p>Not Published</p>;
    }

    return (
        <div className={classes.questionnaire}>
            <Head>{`${props.id} - Nextjs Form`}</Head>
            {!submited && (
                <div className={classes.container}>
                    {questions &&
                        questions.map((question, index) => {
                            if (question.content.type === "title") {
                                return (
                                    <Fragment key={question.order}>
                                        <FormTitleCart
                                            display={true}
                                            title={question.content.title}
                                            description={
                                                question.content.description
                                            }
                                        />
                                        <AccountCart
                                            email={session?.user.email}
                                            record={options.collectEmail}
                                            required={options.limitResponse}
                                            responded={responded}
                                            preview={previewMode}
                                            requiredHint={hasRequiredQuestion}
                                        />
                                    </Fragment>
                                );
                            } else {
                                return (
                                    <QuestionCartDisplay
                                        key={question.order}
                                        value={answers[index]}
                                        onChange={AnswerChangeHandler.bind(
                                            null,
                                            index
                                        )}
                                        missingMessage={missing === index}
                                        clearMissingMessage={setMissing.bind(
                                            null,
                                            null
                                        )}
                                        {...question.content}
                                    />
                                );
                            }
                        })}
                    <div className={classes.actionButton}>
                        <Button
                            onClick={OnSubmitHandler}
                            name="Submit"
                            {...submitButton[
                                submitNotValid || previewMode
                                    ? "disable"
                                    : "enable"
                            ]}
                        />
                        <Button
                            onClick={setAnswers.bind(
                                null,
                                new Array(questions.length)
                            )}
                            name="Clear Form"
                            bgcolor="transparent"
                            textcolor="rgb(103, 58, 183)"
                            bordercolor="transparent"
                            hoverborder="transparent"
                            hoverbg="rgba(211, 211, 211, 0.3)"
                        />
                    </div>
                </div>
            )}
            {submited && (
                <div className={classes.container}>
                    <FormTitleCart
                        display={true}
                        title={getFormTitle(questions)}
                        description={options.confirmMessage}
                    >
                        {options.linkToNewResponse && (
                            <p
                                className={classes.link}
                                onClick={() => {
                                    router.reload();
                                }}
                            >
                                Submit another response
                            </p>
                        )}
                    </FormTitleCart>
                </div>
            )}
        </div>
    );
};

export default QuestionnaireAnswer;
