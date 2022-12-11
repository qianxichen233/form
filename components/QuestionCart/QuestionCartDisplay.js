import { useEffect, useState } from 'react';

import MultipleChoiceAnswer from '../Forms/MultipleChoiceAnswer';
import DateTimeInputAnswer from '../Forms/DateTimeInputAnswer';
import TextAnswerAnswer from '../Forms/TextAnswerAnswer';

import Cart from '../UI/Cart/Cart';

import classes from './QuestionCart.module.css';

const QuestionCartDisplay = ({
    onChange,
    children,
    type,
    missingMessage,
    clearMissingMessage,
    ...leftProps}) => {

    return <Cart Error={missingMessage}>
        {(type => {
            if(type === 'MultipleChoice')
            {
                return <MultipleChoiceAnswer
                    onChange={onChange}
                    {...leftProps}
                />
            }
            if(type === 'TextAnswer')
            {
                return <TextAnswerAnswer
                    onChange={onChange}
                    {...leftProps}
                />
            }
            if(type === 'DateTimeInput')
            {
                return <DateTimeInputAnswer
                    onChange={onChange}
                    {...leftProps}
                />
            }
        })(type)}
    </Cart>
}

export default QuestionCartDisplay;