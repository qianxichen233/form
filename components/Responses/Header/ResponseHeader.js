import { useState } from 'react';

import Cart from '../../UI/Cart/Cart';
import ChoiceBar from '../../UI/ChoiceBar/ChoiceBar';
import OptionCart from '../../UI/Cart/OptionCart';
import { DeleteCartButton, Check } from '../../UI/Icons';
import { Options } from '../../UI/Icons';
import Modal from '../../UI/Modal/Modal';
import ConfirmCard from '../../UI/Cart/ConfirmCard';

import classes from './ResponseHeader.module.css';

const ResponseHeader = props => {
    const [optionActive, setOptionActive] = useState(false);
    const [emailNotification, setEmailNotification] = useState(false);
    const [deleteActive, setDeleteActive] = useState(false);

    const OnDeleteClickHandler = (e) => {
        e.stopPropagation();
        setOptionActive(false);
        setDeleteActive(true);
    }

    return <Cart className={classes.container}>
        <div className={classes.top}>
            <p>{`${props.responseNumber} Response${props.responseNumber === 1 ? '' : 's'}`}</p>
            <div>
                {props.published ?
                <p className={classes.publish}>Form Published</p> :
                <p className={classes.notpublish}>Form Not Published</p>}
                <div className={classes.icon} onClick={setOptionActive.bind(null, true)}>
                    <Options />
                    {optionActive &&
                    <OptionCart
                        width="max-content"
                        zIndex='1001'
                        options={[
                            {
                                Icon: (emailNotification ? Check : null),
                                text: 'Get email notifications from new responses',
                                onClick: () => {setEmailNotification(prev => !prev)}
                            },
                            {
                                Icon: DeleteCartButton,
                                text: 'Delete all responses',
                                onClick: OnDeleteClickHandler
                            }
                        ]}
                    />}
                </div>
            </div>
        </div>
        <div className={classes.choice}>
            <ChoiceBar
                options={['Summary', 'Question', 'Individual']}
                active={props.status}
                onChange={props.setStatus}
            />
        </div>
        <Modal
            active={optionActive}
            deactive={setOptionActive.bind(null, false)}
        />
        <Modal
            active={deleteActive}
            center={true}
            color={'rgb(128 128 128 / 50%)'}
        >
            <ConfirmCard
                title="Delete Responses"
                description="Are you sure you want to permanently delete ALL responses?"
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
                onCancel={setDeleteActive.bind(null, false)}
                onConfirm={props.deleteResponses}
            />
        </Modal>
    </Cart>
};

export default ResponseHeader;