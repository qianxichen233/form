import DynamicInput from '../UI/TextInput/DynamicInput';
import Button from '../UI/Button/Button';

import classes from './header.module.css';

import { FormIcon, Preview } from '../UI/Icons';
import { useRef } from 'react';
import Link from 'next/link';

const Header = (props) => {
    const QuestionRef = useRef();
    const ResponseRef = useRef();
    const SettingRef = useRef();
    const HeaderRef = useRef();

    const getLeftValue = (subpage) => {
        if(!QuestionRef.current) return;
        if(subpage === 'questions')
            return QuestionRef.current.getBoundingClientRect().left;
        if(subpage === 'responses')
            return ResponseRef.current.getBoundingClientRect().left;
        if(subpage === 'settings')
            return SettingRef.current.getBoundingClientRect().left;
    }

    const getWidthValue = (subpage) => {
        if(!QuestionRef.current) return;
        if(subpage === 'questions')
            return QuestionRef.current.offsetWidth;
        if(subpage === 'responses')
            return ResponseRef.current.offsetWidth;
        if(subpage === 'settings')
            return SettingRef.current.offsetWidth;
    }

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
                <span
                    className={`${props.subpage === 'questions' ? classes.active : ''}`}
                    ref={QuestionRef}
                    onClick={props.changePage.bind(null, 'questions')}
                >Questions</span>
                <span
                    className={`${props.subpage === 'responses' ? classes.active : ''}`}
                    ref={ResponseRef}
                    onClick={props.changePage.bind(null, 'responses')}
                >Responses</span>
                <span
                    className={`${props.subpage === 'settings' ? classes.active : ''}`}
                    ref={SettingRef}
                    onClick={props.changePage.bind(null, 'settings')}
                >Settings</span>
                <div
                    style={{
                        left: getLeftValue(props.subpage),
                        width: getWidthValue(props.subpage)
                    }}
                ></div>
            </div>
        </div>
        <div
            className={classes.placeholder}
            style={{height: HeaderRef.current?.offsetHeight}}
        ></div>
    </>
}

export default Header;