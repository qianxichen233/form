import { useRef, useState, useEffect } from 'react';
import lodash from 'lodash';

import Form from '../UI/Cart/Form';
import TextInputAnswer from '../UI/TextInput/TextInputAnswer';
import QuestionInputBar from '../UI/QuestionBar/QuestionInputBar';
import TextInputBar from '../UI/TextInput/TextInputBar';
import RichTextEditorDisplay from '../UI/RichTextEditor/RichTextEditorDisplay';
import RichTextEditor from '../UI/RichTextEditor/RichTextEditor';

const TextBoxWidth = {
    shortanswer: '50%',
    paragraph: '70%'
}

const TextAnswerAnswer = (props) => {

    return <Form>
        <QuestionInputBar>
            <RichTextEditorDisplay
                value={props.description}
                width={'100%'}
                size='big'
                placeholder="Question Statement"
            />
        </QuestionInputBar>
        <TextInputBar>
            {((type) => {
                if(type === 'shortanswer')
                {
                    return <TextInputAnswer
                        placeholder="Your Answer"
                        value={props.value}
                        onChange={props.onChange}
                        width={TextBoxWidth[props.subtype]}
                        size='normal'
                        display={props.display}
                    ></TextInputAnswer>
                }
                if(type === 'paragraph')
                {
                    if(props.display)
                        return <RichTextEditorDisplay
                            value={props.value}
                            width={'100%'}
                            size='normal'
                            underline={true}
                        />
                    else
                        return <RichTextEditor
                            placeholder="Your Answer"
                            value={props.value}
                            passValue={props.onChange}
                            onFocus={props.onFocus}
                            transparent={true}
                            size='normal'
                            width={'100%'}
                        />
                }
            })(props.subtype)}
        </TextInputBar>
    </Form>
}

export default TextAnswerAnswer;