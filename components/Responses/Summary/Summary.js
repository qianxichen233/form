import SummaryCart from "./SummaryCart";

import classes from './Summary.module.css';

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
    const questions = props.questions.filter(question => question.key !== 0); //exclude title cart

    const transformedResponses = ResponsesTransform(props.responses);

    return <div className={classes.container}>
        {questions.map(question => {
            return <SummaryCart
                key={question.key}
                question={question.content}
                responses={transformedResponses[question.key]}
            />
        })}
    </div>
}

export default Summary;