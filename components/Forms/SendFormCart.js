import classes from "./SendFormCart.module.css";
import { Close } from "../UI/Icons";
import { useEffect, useState } from "react";
import ChoiceBar from "../UI/ChoiceBar/ChoiceBar";
import Button from "../UI/Button/Button";
import HintBar from "../UI/HintBar/HintBar";
import SimpleInput from "../UI/TextInput/SimpleInput";
import { RichTextToPlain } from "../Responses/utils";

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const SendFormCart = (props) => {
    const [method, setMethod] = useState("Email");
    const [hintText, setHintText] = useState({
        timeout: null,
        text: "",
    });

    const [emailContent, setEmailContent] = useState({
        to: "",
        subject: "",
        message: "You are invited to fill out a form:",
    });
    const [errorHint, setErrorHint] = useState("");

    useEffect(() => {
        const questions = props.getQuestions();
        const title = RichTextToPlain(
            questions.find((question) => {
                return question.content.type === "title";
            }).content.title
        );
        setEmailContent((prev) => {
            return {
                ...prev,
                subject: title,
            };
        });
    }, []);

    const setHintHandler = (text) => {
        setHintText((prev) => {
            if (prev.timeout) clearTimeout(prev.timeout);
            const timeout = setTimeout(() => {
                setHintText({
                    timeout: null,
                    text: "",
                });
            }, 3000);
            return {
                timeout,
                text,
            };
        });
    };

    const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/questionnaire/${props.id}/answer`;

    const setClipboard = (text) => {
        const type = "text/plain";
        const blob = new Blob([text], { type });
        const data = [new ClipboardItem({ [type]: blob })];

        navigator.clipboard.write(data).then(() => {
            setHintHandler("Copied to clipboard");
        });
    };

    const onSendEmailHandler = async (emailContent) => {
        if (!emailContent.to) {
            setErrorHint("Please enter the recipient");
            return;
        }
        if (!validateEmail(emailContent.to)) {
            setErrorHint("Please enter valid email address");
            return;
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.id}/send`,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    options: {
                        to: emailContent.to,
                        subject: emailContent.subject,
                        message: emailContent.message + url,
                    },
                }),
            }
        );
        if (!response.ok) console.log(await response.json());
        else setHintHandler("Email Sent");
    };

    return (
        <div className={classes.container}>
            <header>
                <div>
                    <p>Send Form</p>
                    <div onClick={props.onCancel}>
                        <Close size={20} />
                    </div>
                </div>
                <div className={classes.choicebar}>
                    <span>Send via</span>
                    <div>
                        <ChoiceBar
                            options={["Email", "Link"]}
                            active={method}
                            onChange={setMethod}
                        />
                    </div>
                </div>
            </header>
            {method === "Link" ? (
                <div className={classes.link}>
                    <p>Link</p>
                    <div className={classes.input}>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => e.preventDefault()}
                            onClick={(e) => e.target.select()}
                        />
                    </div>
                    <div className={classes.buttons}>
                        <Button
                            name="Cancel"
                            onClick={props.onCancel}
                            bgcolor="transparent"
                            textcolor="grey"
                            hoverbg="rgba(211,211,211,0.3)"
                            hoverborder="transparent"
                            bordercolor="transparent"
                        />
                        <Button
                            name="Copy"
                            onClick={setClipboard.bind(null, url)}
                            bgcolor="transparent"
                            textcolor="purple"
                            hoverbg="rgba(211,211,211,0.3)"
                        />
                    </div>
                </div>
            ) : (
                <div className={classes.email}>
                    <p>Email</p>
                    <SimpleInput
                        placeholder="To"
                        value={emailContent.to}
                        onChange={(value) => {
                            setEmailContent((prev) => {
                                return { ...prev, to: value };
                            });
                        }}
                        errorHint={errorHint}
                        cancelError={setErrorHint.bind(null, "")}
                    />
                    <SimpleInput
                        placeholder="Subject"
                        value={emailContent.subject}
                        onChange={(value) => {
                            setEmailContent((prev) => {
                                return { ...prev, subject: value };
                            });
                        }}
                    />
                    <SimpleInput
                        placeholder="Message"
                        value={emailContent.message}
                        onChange={(value) => {
                            setEmailContent((prev) => {
                                return { ...prev, message: value };
                            });
                        }}
                    />
                    <div className={classes.buttons}>
                        <Button
                            name="Cancel"
                            onClick={props.onCancel}
                            bgcolor="transparent"
                            textcolor="grey"
                            hoverbg="rgba(211,211,211,0.3)"
                            hoverborder="transparent"
                            bordercolor="transparent"
                        />
                        <Button
                            name="Send"
                            onClick={onSendEmailHandler.bind(
                                null,
                                emailContent
                            )}
                            bgcolor="transparent"
                            textcolor="purple"
                            hoverbg="rgba(211,211,211,0.3)"
                        />
                    </div>
                </div>
            )}
            <HintBar active={hintText.text !== ""} text={hintText.text} />
        </div>
    );
};

export default SendFormCart;
