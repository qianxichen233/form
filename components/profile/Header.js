import classes from './Header.module.css';

import { FormIcon } from '../UI/Icons';

const Header = props => {
    return <div className={classes.container}>
        <div className={classes.logo}>
            <FormIcon size={30} color="white"/>
        </div>
        <div className={classes.account}>
            <span>{props.session.user.username}</span>
            <button type='button' className={classes.button}>Sign Out</button>
        </div>
    </div>
}

export default Header;