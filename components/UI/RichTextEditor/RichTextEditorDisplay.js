import { useRef, useState } from 'react';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

import 'draft-js/dist/Draft.css';
import classes from './RichTextEditor.module.css';

const fontsize = {
    big: '20px',
    normal: '12pt'
};

const padding = {
    big: '20px',
    normal: '10px'
}

const RichTextEditorDisplay = (props) => {
    const size = props.size || 'normal';
    const content = EditorState.createWithContent(convertFromRaw(props.value));

    return <div
        className={`${classes.container}`}
        style={{'--width': props.width ? props.width : '100%'}}
    >
        <div className={classes.inputContainer}>
            <div
                className={`${classes.editor} 
                            ${classes.preview} 
                            ${classes.transparent_bg}`}
                style={{'--fontsize': props.fontsize || fontsize[size],
                        '--paddingVertical': props.paddingVertical || padding[size],
                        '--paddingHorizontal': props.paddingHorizontal || '10px'}}
            >
                <Editor
                    editorState={content}
                    //blockStyleFn={() => classes.noSelect}
                    placeholder={props.placeholder}
                    readOnly
                />
            </div>
        </div>
    </div>;
}

export default RichTextEditorDisplay;