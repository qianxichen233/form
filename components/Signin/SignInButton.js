import { useState } from 'react';
import { signIn } from "next-auth/react";
import Modal from '../UI/Modal/Modal';
import { useRouter } from 'next/router';

import classes from './SignInButton.module.css';

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const SignInButton = props => {
    const router = useRouter();

    const [active, setActive] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailChangeHandler = e => {
        setEmail(e.target.value);
        if(emailError) setEmailError('');
    }

    const passwordChangeHandler = e => {
        setPassword(e.target.value);
        if(passwordError) setPasswordError('');
    }

    const onSumbitHandler = async () => {
        if(!validateEmail(email))
        {
            setEmailError('Invalid email format!');
            return;
        }
        if(!password)
        {
            setPasswordError('Please enter the password!');
            return;
        }
        const result = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password
        });
        if(result.error)
        {
            console.log(result.error);
            if(result.error === 'User not found!')
                setEmailError('Email not found!');
            else
                setPasswordError(result.error);
            return;
        }
        router.reload(window.location.pathname);
    }

    return <>
        <button
            type='button'
            className={props.className}
            onClick={() => setActive(true)}
        >Log In</button>
        <Modal
            active={active}
            deactive={setActive.bind(null, false)}
            color='rgb(128 128 128 / 50%)'
            center={true}
        >
            <div className={classes.form}>
                <div className={classes.title}>
                    <span>LOG IN</span>
                </div>
                <div className={classes.input}>
                    <input
                        type="text"
                        placeholder='Email'
                        value={email}
                        onChange={emailChangeHandler}
                    ></input>
                    {emailError && <p>{emailError}</p>}
                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={passwordChangeHandler}
                    ></input>
                    {passwordError && <p>{passwordError}</p>}
                </div>
                <div className={classes.buttonDiv}>
                    <button type='button' onClick={onSumbitHandler}>Log In</button>
                </div>
            </div>
        </Modal>
    </>
}

export default SignInButton;