import lodash from 'lodash';

import classes from './MultipleChoice.module.css';

import Form from "../UI/Cart/Form";
import OptionInputAnswer from '../UI/OptionBar/OptionInputAnswer';
import QuestionInputBar from '../UI/QuestionBar/QuestionInputBar';

import RichTextEditorDisplay from "../UI/RichTextEditor/RichTextEditorDisplay";

import { CircleCheckBox,
         CircleCheckBoxFill,
         BoxCheckBox,
         BoxCheckBoxFill } from '../UI/Icons';

const RenderCircleCheckBox = (checked) => {
    if(checked) return <CircleCheckBoxFill className={classes.icon} size={20} color="grey"/>
    return <CircleCheckBox className={classes.icon} size={20} color="grey"/>;
}

const RenderBoxCheckBox = (checked) => {
    if(checked) return <BoxCheckBoxFill className={classes.icon} size={20} color="grey"/>
    return <BoxCheckBox className={classes.icon} size={20} color="grey"/>;
}

const updateAnswer = (answer, index, type) => {
    if(type === 'multichoice')
    {
        const prev = answer.findIndex((ans) => ans);
        if(prev === index) answer[index] = !answer[index];
        else
        {
            if(prev !== -1) answer[prev] = false;
            answer[index] = true;
        }
    }
    else
        answer[index] = !answer[index];
    return answer;
}

const MultipleChoiceAnswer = (props) => {
    const answer = props.value || (props.display ? new Array() : new Array(props.options.length).fill(false));

    return <Form>
        <QuestionInputBar>
            <RichTextEditorDisplay
                value={props.description}
                size='big'
                width={'100%'}
                placeholder="Question Statement"
            />
        </QuestionInputBar>
        <div className={classes.optionContainer}>
            {props.options.map((option, index) => {
                return <div
                    key={option.key}
                    className={classes.container}
                    onClick={props.display ? null : () => {
                        let newAnswer = lodash.cloneDeep(answer);
                        newAnswer = updateAnswer(newAnswer, index, props.subtype);
                        props.onChange(newAnswer);
                    }}
                    >
                        {
                            props.subtype === 'multichoice' ?
                            RenderCircleCheckBox(props.display ? answer.includes(option.content) : answer[index]) :
                            RenderBoxCheckBox(props.display ? answer.includes(option.content) : answer[index])
                        }
                        <OptionInputAnswer
                            placeholder={`Option ${index + 1}`}
                            value={option.content}
                        />
                </div>
            })}
        </div>
    </Form>;
}

export default MultipleChoiceAnswer;