import { useRef, useState } from "react";
import { Editor, EditorState, ContentState, convertFromRaw } from "draft-js";

import "draft-js/dist/Draft.css";
import classes from "./RichTextEditor.module.css";

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

const RichTextEditorDisplay = (props) => {
    const size = props.size || "normal";
    //const content = EditorState.createWithContent(convertFromRaw(props.value));
    const content = props.value
        ? typeof props.value === "string"
            ? EditorState.createWithContent(
                  ContentState.createFromText(props.value)
              )
            : EditorState.createWithContent(convertFromRaw(props.value))
        : EditorState.createWithContent(emptyContentState);

    return (
        <div
            className={`${classes.container}`}
            style={{ "--width": props.width ? props.width : "100%" }}
        >
            <div className={classes.inputContainer}>
                <div
                    className={`${classes.editor} ${
                        props.underline ? "" : classes.preview
                    } ${classes.transparent_bg}`}
                    style={{
                        "--fontsize": props.fontsize || fontsize[size],
                        "--paddingVertical":
                            props.paddingVertical || padding[size],
                        "--paddingHorizontal":
                            props.paddingHorizontal || "10px",
                    }}
                >
                    <Editor
                        editorState={content}
                        //blockStyleFn={() => classes.noSelect}
                        placeholder={props.placeholder}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
};

export default RichTextEditorDisplay;
