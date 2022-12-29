import { useEffect, useState } from "react";
import Cart from "../../UI/Cart/Cart";
import NumberInput from "../../UI/NumberInput/NumberInput";
import RichTextEditorDisplay from "../../UI/RichTextEditor/RichTextEditorDisplay";
import SelectBar from '../../UI/SelectBar/SelectBar';
import ShowHideButton from "../../UI/Button/ShowHideButton";
import OptionInputAnswer from '../../UI/OptionBar/OptionInputAnswer';
import DisplayAnswer from "./DisplayAnswer";
import { RichTextToPlain } from '../utils';

import { CircleCheckBox, BoxCheckBox } from '../../UI/Icons';

import classes from './Question.module.css';

const ResponsesTransform = (responses) => {
    let transformed = {};
    for(const response of responses)
    {
        for(const answer of response.content)
        {
            if(answer.key === 0) continue;
            if(!transformed[answer.key]) transformed[answer.key] = new Array();
            transformed[answer.key].push(answer.content);
        }
    }
    return transformed;
}

const Question = props => {
    const [questionIndex, setQuestionIndex] = useState(1);
    const [showOption, setShowOption] = useState(false);
    const [responsesByQuestion, setResponsesByQuestion] = useState([]);

    useEffect(() => {
        let NewResponses = [];
        const transformedResponses = ResponsesTransform(props.responses);
        for(const question of props.questions)
            NewResponses.push(transformedResponses[question.key]);
        setResponsesByQuestion(NewResponses);
    }, [props.responses]);

    const questionContent = props.questions.map(question => {
        return RichTextToPlain(question.content.description);
    });

    return <div>
        <Cart>
            <div className={classes.header}>
                <div className={classes.selectBar}>
                    <SelectBar
                        onChange={setQuestionIndex}
                        value={questionIndex}
                        options={
                            [
                                questionContent.map(((question, index) => {
                                    return {
                                        value: index + 1,
                                        name: question
                                    }
                                }))
                            ]
                        }
                    />
                </div>
                <div className={classes.numberInput}>
                    <NumberInput
                        value={questionIndex}
                        max={props.questions.length}
                        onChange={setQuestionIndex}
                    />
                </div>
            </div>
        </Cart>
        <Cart className={classes.cart}>
            <div className={classes.question}>
                <div>
                    <RichTextEditorDisplay
                        value={props.questions[questionIndex - 1].content.description}
                        size='big'
                        width={'100%'}
                        placeholder="Question Statement"
                    />
                </div>
                <div>
                    {props.questions[questionIndex - 1].content.type === 'MultipleChoice' && 
                    <ShowHideButton
                        text={showOption ? "Hide Options" : "View Options"}
                        triggered={showOption}
                        onChange={setShowOption}
                    />}
                </div>
            </div>
            <div className={classes.options}>
                {(props.questions[questionIndex - 1].content.type === 'MultipleChoice' && showOption) &&
                props.questions[questionIndex - 1].content.options.map((option, index) => {
                    return <div
                            key={option.key}
                            className={classes.container}
                        >
                            {
                                props.questions[questionIndex - 1].content.subtype === 'multichoice' ?
                                <CircleCheckBox size={20}/> :
                                <BoxCheckBox size={20}/>
                            }
                            <OptionInputAnswer
                                placeholder={`Option ${index + 1}`}
                                value={option.content}
                            />
                    </div>
                })}
            </div>
        </Cart>
        <DisplayAnswer
            responses={responsesByQuestion[questionIndex - 1]}
            type={props.questions[questionIndex - 1].content.subtype}
        />
        <Cart className={classes.cart}>
            <div className={classes.footer}>
                <div>
                    <NumberInput
                        value={questionIndex}
                        max={props.questions.length}
                        onChange={setQuestionIndex}
                    />
                </div>
            </div>
        </Cart>
    </div>
}

export default Question;