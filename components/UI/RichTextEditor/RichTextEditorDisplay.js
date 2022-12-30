import { useRef, useState } from "react";
import {
    Editor,
    EditorState,
    ContentState,
    convertFromRaw,
    convertToRaw,
    convertFromHTML,
    ContentBlock,
    SelectionState,
    Modifier,
} from "draft-js";

import "draft-js/dist/Draft.css";
import classes from "./RichTextEditor.module.css";
import { OrderedSet } from "immutable";

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

const requiredContentState = convertFromRaw({
    entityMap: {},
    blocks: [
        {
            text: "*",
            key: "required",
            type: "red",
            entityRanges: [],
        },
    ],
});

const addRequiredHint = (editorState) => {
    const currentContent = editorState.getCurrentContent();

    const blockMap = currentContent.getBlockMap();
    const key = blockMap.last().getKey();
    const length = blockMap.last().getLength();
    const selection = new SelectionState({
        anchorKey: key,
        anchorOffset: length,
        focusKey: key,
        focusOffset: length,
    });

    const textWithInsert = Modifier.insertText(
        currentContent,
        selection,
        " *",
        OrderedSet.of("RED")
    );
    const editorWithInsert = EditorState.push(
        editorState,
        textWithInsert,
        "insert-characters"
    );
    return editorWithInsert;
};

const RichTextEditorDisplay = (props) => {
    const size = props.size || "normal";
    //const content = EditorState.createWithContent(convertFromRaw(props.value));
    let content = props.value
        ? typeof props.value === "string"
            ? EditorState.createWithContent(
                  ContentState.createFromText(props.value)
              )
            : EditorState.createWithContent(convertFromRaw(props.value))
        : EditorState.createWithContent(emptyContentState);

    if (props.requiredHint) content = addRequiredHint(content);

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
                        customStyleMap={{
                            RED: {
                                color: "red",
                            },
                        }}
                        placeholder={props.placeholder}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
};

export default RichTextEditorDisplay;
