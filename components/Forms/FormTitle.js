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
    const [content, setContent] = useState(props.content ? {
            type: 'title',
            title: props.content?.title,
            description: props.content?.description
        } : {
        type: 'title',
        title: null,
        description: null
    });

    const dispatch = useDispatch();

    const contentRef = useRef(null);
    contentRef.current = content;

    useEffect(() => {
        //props.save();
        dispatch(setQuestionStore({
            id: 0,
            content: contentRef.current
        }));
    }, [dispatch]);

    const onTitleChangeHandler = (clearError, content) => {
        if(clearError) props.onErrorClear();
        if(contentRef.current.title?.blocks[0].text === content['blocks'][0].text) return;
        let newContent = lodash.cloneDeep(contentRef.current);
        newContent['title'] = content;

        props.save();
        dispatch(setQuestionStore({
            id: 0,
            content: newContent
        }));
        setContent(newContent);
    }

    const onDescriptionChangeHandler = (clearError, content) => {
        if(clearError) props.onErrorClear();
        if(contentRef.current.description?.blocks[0].text === content['blocks'][0].text) return;
        let newContent = lodash.cloneDeep(contentRef.current);
        newContent['description'] = content;

        props.save();
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
            value={content.title}
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
            value={content.description}
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