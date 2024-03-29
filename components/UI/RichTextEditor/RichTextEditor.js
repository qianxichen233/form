import { useRef, useState, useCallback, useEffect } from "react";
import {
    Editor,
    EditorState,
    ContentState,
    RichUtils,
    convertToRaw,
    convertFromRaw,
} from "draft-js";

import TextOptionButton from "./TextOptionButton";

import "draft-js/dist/Draft.css";
import classes from "./RichTextEditor.module.css";

import { BoldIcon, ItalicIcon, UnderlineIcon } from "../Icons";

const fontsize = {
    big: "20px",
    normal: "12pt",
};

const padding = {
    big: "20px",
    normal: "10px",
};

const emptyContentState = convertFromRaw({
    entityMap: {},
    blocks: [
        {
            text: "",
            key: "foo",
            type: "unstyled",
            entityRanges: [],
        },
    ],
});

const RichTextEditor = (props) => {
    const size = props.size || "normal";

    const [optionState, setOptionState] = useState({
        bold: false,
        italic: false,
        underline: false,
    });

    const [Focus, setFocus] = useState(false);
    const [editorState, setEditorState] = useState(() => {
        return props.value
            ? typeof props.value === "string"
                ? EditorState.createWithContent(
                      ContentState.createFromText(props.value)
                  )
                : EditorState.createWithContent(convertFromRaw(props.value))
            : EditorState.createWithContent(emptyContentState);
    });

    useEffect(() => {
        if (!props.value)
            setEditorState(EditorState.createWithContent(emptyContentState));
    }, [props.value]);

    const editorRef = useRef(null);
    const editorStateRef = useRef(null);
    editorStateRef.current = editorState;
    const optionStateRef = useRef(null);
    optionStateRef.current = optionState;

    const FocusEditor = () => {
        editorRef.current.focus();
    };

    const onClickHandler = (e) => {
        if (e.target.classList.contains(classes.editor)) e.preventDefault();
        FocusEditor();
        if (props.onClick) props.onClick();
    };

    const updateOptionState = (state) => {
        const newState = {
            bold: state.getCurrentInlineStyle().has("BOLD"),
            italic: state.getCurrentInlineStyle().has("ITALIC"),
            underline: state.getCurrentInlineStyle().has("UNDERLINE"),
        };
        setOptionState(newState);
    };

    const handleKeyCommand = useCallback((command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            updateOptionState(newState);
            return "handled";
        }
        return "not-handled";
    });

    const onOptionClick = useCallback((command, e) => {
        e.preventDefault();
        handleKeyCommand(command, editorStateRef.current);
    });

    const onContentChange = (content) => {
        updateOptionState(content);
        props.passValue(convertToRaw(content.getCurrentContent()));
        setEditorState(content);
    };

    return (
        <div
            className={`${classes.container} ${
                Focus ? classes.containerActive : ""
            }`}
            style={{ "--width": props.width ? props.width : "100%" }}
        >
            <div
                className={classes.inputContainer}
                onMouseDown={onClickHandler}
            >
                <div
                    className={`${classes.editor} 
                             ${props.preview ? classes.preview : ""} 
                             ${props.MissingError ? classes.error : ""}
                             ${
                                 props.transparent ? classes.transparent_bg : ""
                             }`}
                    style={{
                        "--fontsize": props.fontsize || fontsize[size],
                        "--paddingVertical":
                            props.paddingVertical || padding[size],
                        "--paddingHorizontal":
                            props.paddingHorizontal || "10px",
                        borderBottom: props.noUnderline ? "none" : "",
                    }}
                >
                    <Editor
                        editorState={editorState}
                        onChange={onContentChange}
                        onFocus={() => {
                            setFocus(true);
                            if (props.onFocus) props.onFocus();
                        }}
                        onBlur={() => {
                            setFocus(false);
                            if (props.onBlur) props.onBlur();
                        }}
                        placeholder={props.placeholder}
                        handleKeyCommand={handleKeyCommand}
                        ref={editorRef}
                    />
                </div>
                {props.noUnderline || (
                    <span
                        className={`${classes.bar} ${
                            Focus ? classes.barActive : ""
                        }`}
                    />
                )}
            </div>
            {props.preview || !props.options ? null : (
                <div
                    className={`${classes.optionBar} ${
                        Focus ? classes.optionActive : ""
                    }`}
                >
                    {props.options.map((option, index) => {
                        if (option === "bold")
                            return (
                                <TextOptionButton
                                    onMouseDown={onOptionClick.bind(
                                        null,
                                        "bold"
                                    )}
                                    active={optionState.bold}
                                    key={index}
                                >
                                    <BoldIcon size={18} />
                                </TextOptionButton>
                            );
                        if (option === "italic")
                            return (
                                <TextOptionButton
                                    onMouseDown={onOptionClick.bind(
                                        null,
                                        "italic"
                                    )}
                                    active={optionState.italic}
                                    key={index}
                                >
                                    <ItalicIcon size={18} />
                                </TextOptionButton>
                            );
                        if (option === "underline")
                            return (
                                <TextOptionButton
                                    onMouseDown={onOptionClick.bind(
                                        null,
                                        "underline"
                                    )}
                                    active={optionState.underline}
                                    key={index}
                                >
                                    <UnderlineIcon size={18} />
                                </TextOptionButton>
                            );
                    })}
                </div>
            )}
        </div>
    );
};

export default RichTextEditor;
