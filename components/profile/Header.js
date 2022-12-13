import classes from './Header.module.css';

import { signOut } from "next-auth/react";

import SignInButton from '../Signin/SignInButton';
import SignUpButton from '../Signin/SignUpButton';

import { FormIcon } from '../UI/Icons';

const Header = props => {
    const onSignOutHandler = () => {
        signOut({redirect: false});
    }

    const HanderStatus = (status, session) => {
        if(status === 'authenticated')
        {
            return <>
                <span>{session.user.username}</span>
                <button
                    type='button'
                    className={classes.button}
                    onClick={onSignOutHandler}
                >Log Out</button>
            </>
        }
        else
        {
            return <>
                <SignInButton className={classes.button}/>
                <SignUpButton className={classes.button}/>
            </>
        }
    }

    return <div className={classes.container}>
        <div className={classes.logo}>
            <FormIcon size={30} color="white"/>
        </div>
        <div className={classes.account}>
            {HanderStatus(props.status, props.session)}
        </div>
    </div>
}

export default Header;