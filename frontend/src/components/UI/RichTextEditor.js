import { useRef, useState, useCallback } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';

import TextOptionButton from './TextOptionButton';

import 'draft-js/dist/Draft.css';
import classes from './RichTextEditor.module.css';

import { ImBold, ImItalic, ImUnderline } from 'react-icons/im';

const RichTextEditor = (props) => {
    const [optionState, setOptionState] = useState({
        bold: false,
        italic: false,
        underline: false
    });

    const [Focus, setFocus] = useState(false);
    const [editorState, setEditorState] = useState(() => {
        return props.value ?
            EditorState.createWithContent(convertFromRaw(props.value)) :
            EditorState.createEmpty()
    });

    const editorRef = useRef(null);
    const editorStateRef = useRef(null);
    editorStateRef.current = editorState;
    const optionStateRef = useRef(null);
    optionStateRef.current = optionState;

    const FocusEditor = () => {
        editorRef.current.focus();
    }

    const onClickHandler = (e) => {
        e.preventDefault();
        FocusEditor();
        if(props.onClick) props.onClick();
    }

    const updateOptionState = (state) => {
        const newState = {
            bold: state.getCurrentInlineStyle().has('BOLD'),
            italic: state.getCurrentInlineStyle().has('ITALIC'),
            underline: state.getCurrentInlineStyle().has('UNDERLINE')
        };
        setOptionState(newState);
    }
    
    const handleKeyCommand = useCallback((command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState)
        {
            setEditorState(newState);
            updateOptionState(newState);
            return "handled";
        }
        return "not-handled";
    })

    const onOptionClick = useCallback((command, e) => {
        e.preventDefault();
        handleKeyCommand(command, editorStateRef.current);
    });

    const onContentChange = (content) => {
        updateOptionState(content);
        props.passValue(convertToRaw(content.getCurrentContent()));
        setEditorState(content);
    }

    return <div
        className={`${classes.container} ${Focus ? classes.containerActive : ''}`}
        style={{'--width': props.width ? props.width : '100%'}}
    >
        <div className={classes.inputContainer} onMouseDown={onClickHandler}>
            <div
                className={`${classes.editor} 
                             ${props.preview ? classes.preview : ''} 
                             ${props.MissingError ? classes.error : ''}
                             ${props.transparent ? classes.transparent_bg : ''}`}
                style={{'--fontsize': props.fontsize ? props.fontsize : '20px'}}
            >
                <Editor
                    editorState={editorState}
                    onChange={onContentChange}
                    onFocus={() => {
                        setFocus(true);
                        if(props.onFocus) props.onFocus();
                    }}
                    onBlur={() => setFocus(false)}
                    placeholder={props.placeholder}
                    handleKeyCommand={handleKeyCommand}
                    ref={editorRef}
                />
            </div>
            <span className={`${classes.bar} ${Focus ? classes.barActive : ''}`}/>
        </div>
        {props.preview ? null :
        <div className={`${classes.optionBar} ${Focus ? classes.optionActive: ''}`}>
            <TextOptionButton onMouseDown={onOptionClick.bind(null, 'bold')} active={optionState.bold}>
                <ImBold size={18}/>
            </TextOptionButton>
            <TextOptionButton onMouseDown={onOptionClick.bind(null, 'italic')} active={optionState.italic}>
                <ImItalic size={18} />
            </TextOptionButton>
            <TextOptionButton onMouseDown={onOptionClick.bind(null, 'underline')} active={optionState.underline}>
                <ImUnderline size={18} />
            </TextOptionButton>
        </div>}
    </div>;
}

export default RichTextEditor;