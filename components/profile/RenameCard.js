import { useEffect, useRef, useState } from 'react';
import Button from '../UI/Button/Button';

import classes from './DeleteCard.module.css';

const RenameCard = props => {
    const [name, setName] = useState(props.name);
    const inputRef = useRef();

    useEffect(() => {
        if(inputRef)
            inputRef.current.select();
    }, [inputRef]);

    return <div className={classes.form}>
        <h2>Rename</h2>
        <p>{`Please enter the new name for the form`}</p>
        <div className={classes.input}> 
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                ref={inputRef}
            ></input>
        </div>
        <div className={classes.buttons}>
            <Button
                name="Cancel"
                onClick={props.onCancel}
                bgcolor="white"
                textcolor="purple"
                hoverbg="rgba(211,211,211,0.3)"
                hovertext="black"
                hoverborder="#4d90fe"
            />
            <Button
                name="Rename"
                onClick={props.onRename.bind(null, name)}
                bgcolor="#4d90fe"
                textcolor="white"
                hoverbg="#407bda"
            />
        </div>
    </div>
}

export default RenameCard;