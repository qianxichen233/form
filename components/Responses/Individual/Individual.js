import { useState } from "react";

import Cart from "../../UI/Cart/Cart";
import NumberInput from "../../UI/NumberInput/NumberInput";
import { DeleteCartButton } from "../../UI/Icons";
import QuestionnaireDisplay from "../../Questionnaire/QuestionnaireDisplay";
import Modal from "../../UI/Modal/Modal";
import ConfirmCard from "../../UI/Cart/ConfirmCard";

import classes from './Individual.module.css';

const Individual = props => {
    const [responseIndex, setResponseIndex] = useState(1);
    const [deleteHint, setDeleteHint] = useState(false);

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
                    onClick={setDeleteHint.bind(null, true)}
                >
                    <DeleteCartButton size={25}/>
                </div>
            </div>
        </Cart>
        <QuestionnaireDisplay
            questions={props.questions}
            responses={props.responses[responseIndex - 1].content}
        />
        <Modal
            active={deleteHint}
            deactive={setDeleteHint.bind(null, false)}
            center={true}
            color={'rgb(128 128 128 / 50%)'}
        >
            <ConfirmCard
                title="Delete Response"
                description="Are you sure you want to permanently delete this response?"
                ConfirmName="Yes"
                CancelButton={{
                    bgcolor: "white",
                    textcolor: "purple",
                    hoverbg: "rgba(211,211,211,0.3)",
                    hovertext: "black",
                    hoverborder: "#4d90fe"
                }}
                ConfirmButton={{
                    bgcolor: "#4d90fe",
                    textcolor: "white",
                    hoverbg: "#407bda"
                }}
                onCancel={setDeleteHint.bind(null, false)}
                onConfirm={props.delete.bind(null, props.responses[responseIndex - 1].id)}
            />
        </Modal>
    </div>
}

export default Individual;