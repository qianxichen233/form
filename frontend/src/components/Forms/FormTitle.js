import { useState, useRef, useEffect } from 'react';
import lodash from 'lodash';

import Form from '../UI/Form';
import TextInputBar from '../UI/TextInputBar';
import TextInput from '../UI/TextInput';

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

    const onContentChangeHandler = (type, clearError, e) => {
        if(clearError) props.onErrorClear();
        let newContent = lodash.cloneDeep(contentRef.current);
        newContent[type] = e.target.value;

        dispatch(setQuestionStore({
            id: 0,
            content: newContent
        }));
        setContent(newContent);
    }

    const TitleError = props.missingItem?.type === 'title';
    const DescriptionError = props.missingItem?.type === 'description';

    return <Form>
        <TextInputBar>
            <TextInput
                placeholder="Form Title"
                value={content.title}
                onChange={onContentChangeHandler.bind(null, 'title', TitleError)}
                size='big'
                preview={props.preview}
                MissingError={TitleError}
                onClick={
                    TitleError ?
                    props.onErrorClear : null
                }
            ></TextInput>
        </TextInputBar>
        <TextInputBar>
            <TextInput
                placeholder="Form Description"
                value={content.description}
                onChange={onContentChangeHandler.bind(null, 'description', DescriptionError)}
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