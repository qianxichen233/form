import DynamicInput from '../UI/TextInput/DynamicInput';
import Button from '../UI/Button/Button';
import ChoiceBar from '../UI/ChoiceBar/ChoiceBar';

import classes from './header.module.css';

import { FormIcon, Preview } from '../UI/Icons';
import { useRef } from 'react';
import Link from 'next/link';

const Header = (props) => {
    const HeaderRef = useRef();

    return <>
        <div className={classes.header} ref={HeaderRef}>
            <div className={classes.row}>
                <div>
                    <Link href="/">
                        <FormIcon color="purple" size={50}/>
                    </Link>
                    <DynamicInput
                        className={classes.input}
                        value={props.title}
                        onChange={props.onChange}
                        default="Untitled Form"
                        fontSize='16pt'
                    />
                    <span className={classes.hint}>{props.saveHint}</span>
                </div>
                <div className={classes.rightDiv}>
                    <div onClick={props.preview}>
                        <Preview size={25}/>
                    </div>
                    <Button
                        name="Publish"
                        onClick={props.submit}
                        bgcolor="#4d90fe"
                        textcolor="white"
                        hoverbg="#407bda"
                    />
                    <span>{props.username}</span>
                </div>
            </div>
            <div className={classes.choice}>
                <ChoiceBar
                    options={['Questions', 'Responses', 'Settings']}
                    active={props.subpage}
                    onChange={props.changePage}
                />
            </div>
        </div>
        <div
            className={classes.placeholder}
            style={{height: HeaderRef.current?.offsetHeight}}
        ></div>
    </>
}

export default Header;