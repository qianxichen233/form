import QuestionnaireMaking from "../Questionnaire/QuestionnaireMaking";
import Responses from "../Responses/Responses";
import Header from "../header/header";

import lodash from "lodash";
import { useSelector } from "react-redux";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

import classes from "./EditPage.module.css";
import Settings from "../Settings/Settings";

const generateID = (length) => {
    let result = "";
    let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; ++i)
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    return result;
};

let keyList = [];
const getKey = () => {
    let key;
    do key = generateID(10);
    while (keyList.includes(key));
    keyList.push(key);
    return key;
};

const TitleKey = 0;

const checkRichTextEmpty = (content) => {
    if (!content) return true;
    if (typeof content === "string") return false;
    return content["blocks"][0]["text"] === "";
};

const checkValidity = (questions) => {
    for (const question of questions) {
        if (question.content.type === "title") {
            if (checkRichTextEmpty(question.content.title))
                return {
                    id: question.key,
                    type: "title",
                };
            if (checkRichTextEmpty(question.content.description))
                return {
                    id: question.key,
                    type: "description",
                };
            continue;
        }

        if (checkRichTextEmpty(question.content.description))
            return {
                id: question.key,
                type: "description",
            };

        if (question.content.options) {
            for (let i = 0; i < question.content.options.length; ++i)
                if (!question.content.options[i].content)
                    return {
                        id: question.key,
                        type: "option",
                        index: i,
                    };
        }
    }
    return null;
};

let saveTimeoutIdentifier;

function EditPage() {
    const { data: session, status } = useSession();
    const [authenticated, setAuthenticated] = useState(false);
    const [errorState, setErrorState] = useState();

    const [questions, setQuestions] = useState([]);
    const [options, setOptions] = useState({
        quiz: false,
        collectEmail: false,
        limitResponse: false,
        shuffleOrder: false,
        linkToNewResponse: false,
        defaultRequired: false,
        confirmMessage: "Your response has been recorded",
    });
    const [optionsChange, setOptionsChange] = useState(false);

    const [titleContent, setTitleContent] = useState();
    const [formTitle, setFormTitle] = useState("");

    const [save, setSave] = useState(false);
    const [saveHint, setSaveHint] = useState({
        msg: "",
        timeout: null,
    });
    const [published, setPublished] = useState();

    const [subpage, setSubpage] = useState("Questions");

    const questionRef = useRef();
    questionRef.current = questions;

    const questionContent = useSelector((state) => state.question.questions);

    const router = useRouter();

    useEffect(() => {
        if (optionsChange) {
            OnSettingSaveHandler(options);
            setOptionsChange(false);
        }
    }, [optionsChange, options]);

    useEffect(() => {
        if (status !== "authenticated") return;
        if (questions.length > 0) return;

        fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${router.query.questionnaireID}`
        )
            .then((data) => {
                if (!data.ok) return Promise.reject("unauthenticated");
                return data.json();
            })
            .then((questionnaire) => {
                const content = JSON.parse(questionnaire.content);
                const options = JSON.parse(questionnaire.options);
                console.log(content);
                console.log(options);
                if (Object.keys(content).length === 0) {
                    const key = getKey();
                    setQuestions([
                        {
                            key: key,
                            id: key,
                        },
                    ]);
                    setTitleContent({ content: {} });
                    setFormTitle(questionnaire.title);
                    setAuthenticated(true);
                    setPublished(questionnaire.published);
                } else {
                    let questions = [];
                    for (const question of content) {
                        if (question.content.type === "title") {
                            setTitleContent(question.content);
                            continue;
                        }
                        keyList.push(question.key);
                        questions.push({
                            key: question.key,
                            id: question.key,
                            content: question.content,
                        });
                    }
                    setFormTitle(questionnaire.title);
                    setQuestions(questions);
                    setAuthenticated(true);
                    setPublished(questionnaire.published);
                }
                if (Object.keys(options).length !== 0) setOptions(options);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [status]);

    const getQuestionContent = () => {
        let orderArray = questionRef.current.map((elem) => elem.id);
        orderArray.unshift(TitleKey);

        let CloneQuestion = lodash.cloneDeep(questionContent);
        CloneQuestion.sort((a, b) => {
            return orderArray.indexOf(a.key) - orderArray.indexOf(b.key);
        });

        CloneQuestion = CloneQuestion.map((question, index) => {
            question.order = index;
            return question;
        });

        return CloneQuestion;
    };

    const OnSubmitHandler = async (e) => {
        e.preventDefault();

        let storedQuestion = getQuestionContent();

        const missingPart = checkValidity(storedQuestion);
        if (missingPart) {
            setErrorState(missingPart);
            return;
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${router.query.questionnaireID}`,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formTitle,
                    content: storedQuestion,
                    publish: true,
                }),
            }
        );
        if (response.ok) setPublished(true);
    };

    const OnSaveHandler = async (e) => {
        if (e) e.preventDefault();

        let storedQuestion = getQuestionContent();

        setSaveHint((pre) => {
            if (pre.timeout) clearTimeout(pre.timeout);
            return {
                msg: "Saving...",
                timeout: null,
            };
        });

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${router.query.questionnaireID}`,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formTitle,
                    content: storedQuestion,
                    publish: false,
                }),
            }
        );

        if (!response.ok) {
            setSaveHint({
                msg: "Error",
                timeout: setTimeout(() => {
                    setSaveHint({ msg: "" });
                }, 3000),
            });
            return;
        }

        setSaveHint({
            msg: "Saved",
            timeout: setTimeout(() => {
                setSaveHint({ msg: "" });
            }, 3000),
        });
        setPublished(false);
    };

    const OnOptionsChangeHandler = (newOptions) => {
        setOptions(newOptions);
        setOptionsChange(true);
    };

    const OnSettingSaveHandler = async (options) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${router.query.questionnaireID}/settings`,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    options: options,
                }),
            }
        );
        if (!response.ok) console.log(await response.json());
    };

    if (save) {
        OnSaveHandler();
        setSave(false);
    }

    const SaveTimeOut = () => {
        if (saveTimeoutIdentifier) clearTimeout(saveTimeoutIdentifier);
        saveTimeoutIdentifier = setTimeout(setSave.bind(null, true), 2000);
    };

    const onFormTitleChange = (value) => {
        SaveTimeOut();
        setFormTitle(value);
    };

    const onPreviewHandler = () => {
        window.open(
            `/questionnaire/${router.query.questionnaireID}/answer`,
            "_blank",
            "noopener,noreferrer"
        );
        //router.push(`/questionnaire/${router.query.questionnaireID}/answer`);
    };

    const onPageChangeHandler = (name) => {
        setSubpage(name);
    };

    if (status === "loading") return <p>Loading</p>;
    if (status === "unauthenticated") return <p>Prohibited!</p>;
    if (!titleContent || !authenticated) return <div></div>;

    return (
        <div className={classes.container}>
            <Header
                title={formTitle}
                onChange={onFormTitleChange}
                submit={OnSubmitHandler}
                preview={onPreviewHandler}
                username={session.user.username}
                saveHint={saveHint.msg}
                changePage={onPageChangeHandler}
                subpage={subpage}
            />
            <QuestionnaireMaking
                id={router.query.questionnaireID}
                questions={questions}
                questionsChange={setQuestions}
                titleContent={titleContent}
                getKey={getKey}
                error={errorState}
                clearError={() => setErrorState(null)}
                save={SaveTimeOut}
                hide={subpage !== "Questions"}
            />
            <Responses
                id={router.query.questionnaireID}
                hide={subpage !== "Responses"}
                getQuestions={getQuestionContent}
                published={published}
            />
            <Settings
                id={router.query.questionnaireID}
                hide={subpage !== "Settings"}
                options={options}
                setOptions={OnOptionsChangeHandler}
            />
        </div>
    );
}

export default EditPage;
