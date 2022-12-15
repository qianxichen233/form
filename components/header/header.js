import DynamicInput from '../UI/TextInput/DynamicInput';
import Button from '../UI/Button/Button';

import classes from './header.module.css';

import { FormIcon, Preview } from '../UI/Icons';

const Header = (props) => {
    return <div className={classes.header}>
        <div className={classes.row}>
            <div>
                <FormIcon color="purple" size={50}/>
                <DynamicInput
                    className={classes.input}
                    value={props.title}
                    onChange={props.onChange}
                    default="Untitled Form"
                    fontSize='16pt'
                />
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
            <span>Questions</span>
            <span>Responses</span>
            <span>Settings</span>
        </div>
    </div>
}

export default Header;