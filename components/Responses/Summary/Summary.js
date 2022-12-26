import SummaryCart from "./SummaryCart";
import HintBar from '../../UI/HintBar/HintBar';

import classes from './Summary.module.css';
import { useState } from "react";

const ResponsesTransform = (responses) => {
    let transformed = {};
    for(const response of responses)
    {
        const parsedResponse = JSON.parse(response.content);
        for(const answer of parsedResponse)
        {
            if(answer.key === 0) continue;
            if(!transformed[answer.key]) transformed[answer.key] = new Array();
            transformed[answer.key].push(answer.content);
        }
    }
    return transformed;
}

const Summary = props => {
    const [hintText, setHintText] = useState({
        timeout: null,
        text: ''
    });
    const questions = props.questions.filter(question => question.key !== 0); //exclude title cart

    const transformedResponses = ResponsesTransform(props.responses);

    const setHintHandler = (text) => {
        setHintText((prev) => {
            if(prev.timeout) clearTimeout(prev.timeout);
            const timeout = setTimeout(() => {
                setHintText({
                    timeout: null,
                    text: ''
                });
            }, 3000);
            return {
                timeout,
                text
            }
        });
    }

    return <div className={classes.container}>
        {questions.map(question => {
            return <SummaryCart
                key={question.key}
                question={question.content}
                responses={transformedResponses[question.key]}
                setHint={setHintHandler}
            />
        })}
        <HintBar
            active={hintText.text !== ''}
            text={hintText.text}
        />
    </div>
}

export default Summary;