import Cart from "../../UI/Cart/Cart";
import TextAnswerChart from "./TextAnswerChart";
import SlideButton from '../../UI/Button/SlideButton';
import RichTextEditorDisplay from '../../UI/RichTextEditor/RichTextEditorDisplay';

import classes from './TextAnswerCart.module.css';
import { useCallback, useState } from "react";
import { CopyButton } from '../../UI/Icons';
import { copyToClipBoard } from './utils';

const TextAnswerCart = props => {
    let responses = props.responses.map(response => {
        if(!response) return;
        if(typeof(response) !== 'string')
            return response.blocks.map(
                block => (!block.text.trim() && '\n') || block.text
            ).join('\n');
        return response;
    }).filter(response => {
        if(response) return true;
    });

    let countedResponses = {};
    let displayChart = false;

    for(const response of responses)
    {
        if(!countedResponses[response])
            countedResponses[response] = 0;
        else if(props.question.subtype === 'shortanswer') displayChart = true;
        ++countedResponses[response];
    }

    const [showChart, setShowChart] = useState(displayChart);
    const [CartRef, setCartRef] = useState();

    const measuredRef = useCallback(node => {
        if (node !== null)
            setCartRef(node);
    }, []);

    return <Cart ref={measuredRef}>
        <header className={classes.header}>
            <div>
                <RichTextEditorDisplay
                    value={props.question.description}
                    size='big'
                    width={'100%'}
                    placeholder="Question Statement"
                    paddingVertical='20px'
                    paddingHorizontal='0'
                />
                <p>{`${responses.length} response${responses.length === 1 ? '' : 's'}`}</p>
                {responses.length === 0 && <p>No responses yet for this question</p>}
            </div>
            {props.question.subtype === 'shortanswer' &&
            <div data-html2canvas-ignore="true">
                <SlideButton
                    label="Show Chart"
                    labelPos="left"
                    checked={showChart}
                    onChange={setShowChart}
                />
                {showChart &&
                    <div onClick={() => {
                        props.setHint('Chart Copied to Clipboard.');
                        copyToClipBoard(CartRef);
                    }}>
                        <div>
                            <CopyButton size={25} color="blue"/>
                        </div>
                        <p>Copy</p>
                    </div>
                }
            </div>}
        </header>
        {responses.length > 0 && 
        (showChart ?
        <TextAnswerChart data={countedResponses}/>
        :
        <ul className={classes.responseContainer}>
            {Object.keys(countedResponses).map((response, index) => {
                if(!response) return null;
                return <li key={index}>
                    <span>{response}</span>
                    {(countedResponses[response] > 1) &&
                        <span className={classes.count}>{countedResponses[response]}</span>
                    }
                </li>
            })}
        </ul>)}
    </Cart>
}

export default TextAnswerCart;