import Cart from "../../UI/Cart/Cart";

import classes from './DateTimeInputCart.module.css';

const mergeResponse = (responses, type) => {
    let mergedResponses = {};
    for(const response of responses)
    {
        let splitedResponse;
        if(type === 'time')
            splitedResponse = response.split(':');
        else if(type === 'date')
        {
            const index = response.lastIndexOf('-');
            splitedResponse = [response.substr(0, index), response.substr(index + 1)];
        }
        if(!mergedResponses[splitedResponse[0]])
        {
            const newEntry = {};
            newEntry[splitedResponse[1]] = 0;
            mergedResponses[splitedResponse[0]] = newEntry;
        }
        if(!mergedResponses[splitedResponse[0]][splitedResponse[1]])
            mergedResponses[splitedResponse[0]][splitedResponse[1]] = 0;
        ++mergedResponses[splitedResponse[0]][splitedResponse[1]];
    }
    return mergedResponses;
}

const generateList = (responses, type) => {
    return Object.keys(responses).map((key, index) => {
        let displayedKey;
        if(type === 'time')
        {
            displayedKey = <>
                <span>{key}</span>
                <span className={classes.timeKey_colon}>:</span>
                <div className={classes.timeKey_underscore}></div>
            </>
        }
        else displayedKey = <span>{key}</span>;
        return <li key={index}>
            <div>
                {displayedKey}
            </div>
            <ul>
                {Object.keys(responses[key]).map((time, index) => {
                    let displayedTime;
                    if(type === 'time') displayedTime = key + ':' + time;
                    else displayedTime = time;
                    return <li key={index} className={`${classes.dataItem} ${responses[key][time] > 1 ? classes.dataItemHighlight : ''}`}>
                        <span>{displayedTime}</span>
                        {responses[key][time] > 1 ? 
                        <span className={classes.dataItemTag}>
                            {responses[key][time]}
                        </span> : null}
                    </li>
                })}
            </ul>
        </li>
    });
}

const DateTimeInputCart = props => {
    const responses = props.responses.filter(response => {
        if(response) return true;
    });
    const mergedResponses = mergeResponse(responses, props.question.subtype);

    const description = props.question.description.blocks.map(
        block => (!block.text.trim() && '\n') || block.text
    ).join('\n');

    return <Cart>
        <header className={classes.header}>
            <div>
                <h3>{description}</h3>
                <p>{`${responses.length} response${responses.length === 1 ? '' : 's'}`}</p>
                {responses.length === 0 && <p>No responses yet for this question</p>}
            </div>
        </header>
        <ul className={classes.dataContainer}>
            {generateList(mergedResponses, props.question.subtype)}
        </ul>
    </Cart>
}

export default DateTimeInputCart;