import MultipleChoiceCart from "./MultipleChoiceCart";
import TextAnswerCart from './TextAnswerCart';
import DateTimeInputCart from './DateTimeInputCart';

const SummaryCart = props => {
    if(props.question.type === 'MultipleChoice')
    {
        return <MultipleChoiceCart
            question={props.question}
            responses={props.responses}
            setHint={props.setHint}
        />
    }
    if(props.question.type === 'TextAnswer')
    {
        return <TextAnswerCart
            question={props.question}
            responses={props.responses}
            setHint={props.setHint}
        />
    }
    if(props.question.type === 'DateTimeInput')
    {
        return <DateTimeInputCart
            question={props.question}
            responses={props.responses}
            setHint={props.setHint}
        />
    }
}

export default SummaryCart;