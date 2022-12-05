import { useState, useRef, useEffect } from 'react';
import lodash from 'lodash';

import Form from '../UI/Cart/Form';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

import dynamic from 'next/dynamic';
const RichTextEditor = dynamic(
    () => import('../UI/RichTextEditor/RichTextEditor'),
    { ssr: false }
);

const FormTitle = (props) => {
    const [content, setContent] = useState({
        type: 'title',
        title: null,
        description: null
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

    const onDescriptionChangeHandler = (clearError, content) => {
        if(clearError) props.onErrorClear();
        let newContent = lodash.cloneDeep(contentRef.current);
        newContent['description'] = content;

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
            size='big'
            options={['bold', 'italic', 'underline', 'hyperlink', 'clearformat']}
        />
        <RichTextEditor
            placeholder="Form Description"
            passValue={onDescriptionChangeHandler.bind(null, DescriptionError)}
            preview={props.preview}
            MissingError={DescriptionError}
            onClick={
                DescriptionError ?
                props.onErrorClear : null
            }
            onFocus={props.onFocus}
            transparent={true}
            size='normal'
            options={['bold', 'italic', 'underline', 'hyperlink', 'orderedlist', 'unorderedlist', 'clearformat']}
        />
    </Form>
}

export default FormTitle;