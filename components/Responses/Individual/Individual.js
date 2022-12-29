import { useEffect, useState } from "react";

import Cart from "../../UI/Cart/Cart";
import NumberInput from "../../UI/NumberInput/NumberInput";
import { DeleteCartButton } from "../../UI/Icons";
import QuestionnaireDisplay from "../../Questionnaire/QuestionnaireDisplay";

import classes from './Individual.module.css';

const Individual = props => {
    const [responseIndex, setResponseIndex] = useState(1);

    const onDeleteResponseHandler = async (id) => {

    }

    return <div className={classes.container}>
        <Cart>
            <div className={classes.header}>
                <div className={classes.numberInput}>
                    <NumberInput
                        value={responseIndex}
                        max={props.responses.length}
                        onChange={setResponseIndex}
                    />
                </div>
                <div
                    className={classes.icon}
                    onClick={onDeleteResponseHandler.bind(null, responseIndex - 1)}
                >
                    <DeleteCartButton size={25}/>
                </div>
            </div>
        </Cart>
        <QuestionnaireDisplay
            questions={props.questions}
            responses={props.responses[responseIndex - 1].content}
        />
    </div>
}

export default Individual;