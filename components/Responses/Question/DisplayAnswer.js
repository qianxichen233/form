import OptionDisplay from '../../Forms/OptionDisplay';
import Cart from '../../UI/Cart/Cart';
import { RichTextToPlain } from '../utils';

import classes from './DisplayAnswer.module.css';

const mergeResponse = (responses, type) => {
    let newResponse = [];
    let indexMap = {};
    let noAnswerIndex;
    if(type === 'multichoice' || type === 'checkbox')
        responses = responses.map(response => {
            if(response) return response.toString();
        });
    if(type === 'paragraph')
        responses = responses.map(response => RichTextToPlain(response));

    for(const response of responses)
    {
        if(!response)
        {
            if(!noAnswerIndex)
            {
                noAnswerIndex = newResponse.length;
                newResponse.push({
                    noResponse: true,
                    count: 1
                });
            }
            else ++newResponse[noAnswerIndex].count;
            continue;
        }
        if(indexMap[response] === undefined || indexMap[response] === null)
        {
            indexMap[response] = newResponse.length;
            newResponse.push({
                response,
                count: 1
            });
        }
        else
            ++newResponse[indexMap[response]].count;
    }
    return newResponse;
}

const QuestionCart = (response, type) => {
    if(response.noResponse)
        return <span className={classes.blank}>Question left blank</span>;
    if(type === 'multichoice' || type === 'checkbox')
    {
        const options = response.response.split(',').map((option, index) => {
            return {
                content: option,
                key: index
            }
        });
        return <OptionDisplay
            fill={true}
            options={options}
            type={type}
        />;
    }
    if(type === 'shortanswer' || type === 'paragraph')
        return <p className={classes.textAnswer}>{response.response}</p>
    if(type === 'date')
    {
        const [year, month, day] = response.response.split('-');
        return <div className={classes.date}>
            <div>
                <span>MM</span>
                <span>{month}</span>
            </div>
            <span>/</span>
            <div>
                <span>DD</span>
                <span>{day}</span>
            </div>
            <span>/</span>
            <div>
                <span>YYYY</span>
                <span>{year}</span>
            </div>
        </div>
    }
    if(type === 'time')
    {
        const [hour, min] = response.response.split(':');
        return <div className={classes.time}>
            <span>Time</span>
            <div>
                <span>{hour}</span>
                <span>:</span>
                <span>{min}</span>
            </div>
        </div>
    }
}

const DisplayAnswer = props => {
    if(!props.responses)
        return <p>No Response Yet</p>
    const responses = mergeResponse(props.responses, props.type);
    return <>
        {responses.map((response, index) => {
            return <Cart key={index} className={classes.cart}>
                <div className={classes.questionContainer}>
                    {QuestionCart(response, props.type)}
                </div>
                <div className={classes.line}></div>
                <div className={classes.footer}>
                    <span>{`${response.count} response${response.count === 1 ? '' : 's'}`}</span>
                </div>
            </Cart>
        })}
    </>
}

export default DisplayAnswer;