import { useState, useRef, useEffect } from 'react';
import lodash from 'lodash';

import Form from '../UI/Cart/Form';

import { useDispatch } from 'react-redux';
import { setQuestionStore } from '../stores/questionSlice';

import dynamic from 'next/dynamic';
const RichTextEditorDisplay = dynamic(
    () => import('../UI/RichTextEditor/RichTextEditorDisplay'),
    { ssr: false }
);

const FormTitleDisplay = (props) => {
    return <Form>
        <RichTextEditorDisplay
            value={props.title}
            display={true}
            fontsize={'24pt'}
            size='big'
        />
        <RichTextEditorDisplay
            value={props.description}
            display={true}
            size='normal'
        />
    </Form>
}

export default FormTitleDisplay;