import { useRouter } from 'next/router';
import classes from './FormCard.module.css';

import Modal from '../UI/Modal/Modal';
import DeleteCard from './DeleteCard';
import RenameCard from './RenameCard';

import { Options } from '../UI/Icons';
import { useState } from 'react';

import { DeleteCartButton, Rename } from '../UI/Icons'

const FormCard = props => {
    const router = useRouter();

    const [optionActive, setOptionActive] = useState(false);
    const [deleteActive, setDeleteActive] = useState(false);
    const [renameActive, setRenameActive] = useState(false);

    const onOptionClickHandler = e => {
        if(e.target.attributes['name']?.value !== 'optionBar')
            setOptionActive(true);
        e.target = e.currentTarget;
    }
    
    const onDeleteHandler = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.formID}`, {
            method: 'DELETE'
        }).then(res => res.json())
        .then((data) => {
            if(!data.error)
                router.reload(window.location.pathname);
        })
        .catch(console.log);
    }

    const onRenameHandler = (name) => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.formID}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: name
            })
        }).then(res => res.json())
        .then((data) => {
            if(!data.error)
                router.reload(window.location.pathname);
        })
        .catch(console.log);
    }

    const ImageSrc = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.formID}/preview`;

    return <>
        <div
            className={classes.card}
            onClick={(e) => {
                const name = e.target.attributes['name']?.value;
                if(name !== 'options' && name !== 'optionBar')
                    router.push(`/questionnaire/${props.formID}/edit`);
            }}
        >
            <div className={classes.preview}>
                <img
                    src={ImageSrc}
                    width={200}
                    height={200}
                    alt="Questionnaire Preview"
                    draggable={false}
                />
            </div>
            <div className={classes.textContainer}>
                <p className={classes.formtitle}>{props.title}</p>
                <div className={classes.optionRow}>
                    <span className={classes.formtime}>Edited At {props.date} {props.time}</span>
                    <div className={classes.optionIcon} onClick={onOptionClickHandler} name="options">
                        <Options size={20}/>
                        {optionActive && <div
                            className={classes.options}
                            name="optionBar"
                            onClick={e => e.target = e.currentTarget}
                        >
                            <div className={classes.option} onClick={() => {
                                setOptionActive(false);
                                setRenameActive(true);
                            }}>
                                <Rename size={20}/>
                                <span>Rename</span>
                            </div>
                            <div className={classes.option} onClick={() => {
                                setOptionActive(false);
                                setDeleteActive(true);
                            }}>
                                <DeleteCartButton size={20}/>
                                <span>Delete</span>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
        <Modal
            active={optionActive}
            deactive={setOptionActive.bind(null, false)}
        ></Modal>
        <Modal
            active={deleteActive}
            color='rgb(128 128 128 / 50%)'
            center={true}
        >
            <DeleteCard
                title={props.title}
                onDelete={onDeleteHandler}
                onCancel={setDeleteActive.bind(null, false)}
            />
        </Modal>
        <Modal
            active={renameActive}
            color='rgb(128 128 128 / 50%)'
            center={true}
        >
            <RenameCard
                onRename={onRenameHandler}
                onCancel={setRenameActive.bind(null, false)}
                name={props.title}
            />
        </Modal>
    </>
}

export default FormCard;