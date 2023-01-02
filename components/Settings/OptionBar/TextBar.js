import { useState } from "react";
import RichTextEditor from "../../UI/RichTextEditor/RichTextEditor";
import { RichTextToPlain } from "../../Responses/utils";

import classes from "./TextBar.module.css";

const TextBar = (props) => {
    const [edit, setEdit] = useState(false);
    const [text, setText] = useState(props.content);
    const [Focus, setFocus] = useState(false);

    const OnSaveHandler = (text) => {
        setFocus(false);
        setEdit(false);
        props.onChange(RichTextToPlain(text));
    };

    const OnCancelHandler = () => {
        setFocus(false);
        setEdit(false);
        setText(props.content);
    };

    return (
        <div className={classes.container}>
            {!edit && (
                <>
                    <div className={classes.text}>
                        <h4>{props.text}</h4>
                        {props.content && <p>{props.content}</p>}
                    </div>
                    <div className={classes.flex}>
                        <div
                            onClick={setEdit.bind(null, true)}
                            className={classes.button}
                        >
                            <p>Edit</p>
                        </div>
                    </div>
                </>
            )}
            {edit && (
                <>
                    <div
                        className={`${classes.input} ${
                            Focus ? classes.focus : ""
                        }`}
                    >
                        <span>{props.text}</span>
                        <div>
                            <RichTextEditor
                                placeholder={props.content}
                                value={text}
                                passValue={setText}
                                transparent={true}
                                noUnderline={true}
                                size="normal"
                                width={"100%"}
                                onFocus={setFocus.bind(null, true)}
                                onBlur={setFocus.bind(null, false)}
                            />
                        </div>
                    </div>
                    <div className={classes.flex}>
                        <div
                            onClick={OnSaveHandler.bind(null, text)}
                            className={classes.button}
                        >
                            <p>Save</p>
                        </div>
                        <div
                            onClick={OnCancelHandler}
                            className={classes.cancelButton}
                        >
                            <p>Cancel</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TextBar;
