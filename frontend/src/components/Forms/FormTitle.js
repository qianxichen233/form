import { useState, useRef, useEffect } from 'react';
import lodash from 'lodash';

import Form from '../UI/Cart/Form';
import TextInputBar from '../UI/TextInput/TextInputBar';
import TextInput from '../UI/TextInput/TextInput';
import RichTextEditor from '../UI/RichTextEditor/RichTextEditor';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

const FormTitle = (props) => {
    const [content, setContent] = useState({
        type: 'title',
        title: '',
        description: ''
    });

    const dispatch = useDispatch();

    const contentRef = useRef(null);
    contentRef.current = content;

    useEffect(() => {
        dispatch(setQuestionStore({
            id: 0,
            content: contentRef.current
        }));
    }, [dispatch]);

    const onTitleChangeHandler = (clearError, content) => {
        if(clearError) props.onErrorClear();
        let newContent = lodash.cloneDeep(contentRef.current);
        newContent['title'] = content;

        dispatch(setQuestionStore({
            id: 0,
            content: newContent
        }));
        setContent(newContent);
    }

    const onDescriptionChangeHandler = (clearError, e) => {
        if(clearError) props.onErrorClear();
        let newContent = lodash.cloneDeep(contentRef.current);
        newContent['description'] = e.target.value;

        dispatch(setQuestionStore({
            id: 0,
            content: newContent
        }));
        setContent(newContent);
    }

    const TitleError = props.missingItem?.type === 'title';
    const DescriptionError = props.missingItem?.type === 'description';

    return <Form>
        <RichTextEditor
            placeholder="Form Title"
            passValue={onTitleChangeHandler.bind(null, TitleError)}
            preview={props.preview}
            MissingError={TitleError}
            onClick={
                TitleError ?
                props.onErrorClear : null
            }
            onFocus={props.onFocus}
            fontsize={'24pt'}
            transparent={true}
        />
        <TextInputBar>
            <TextInput
                placeholder="Form Description"
                value={content.description}
                onChange={onDescriptionChangeHandler.bind(null, DescriptionError)}
                size='normal'
                preview={props.preview}
                MissingError={DescriptionError}
                onClick={
                    DescriptionError ?
                    props.onErrorClear : null
                }
            ></TextInput>
        </TextInputBar>
    </Form>
}

export default FormTitle;