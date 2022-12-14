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
    const [passwordRepeatError, setPasswordRepeatError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [username, setUsername] = useState('');

    const usernameChangeHandler = e => {
        setUsername(e.target.value);
        if(usernameError) setUsernameError('');
    }

    const emailChangeHandler = e => {
        setEmail(e.target.value);
        if(emailError) setEmailError('');
    }

    const passwordChangeHandler = e => {
        setPassword(e.target.value);
        if(passwordError) setPasswordError('');
    }

    const passwordRepeatChangeHandler = e => {
        setPasswordRepeat(e.target.value);
        if(passwordRepeatError) setPasswordRepeatError('');
    }

    const onSumbitHandler = () => {
        if(!username)
        {
            setUsernameError('Please enter the username!');
            return;
        }
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
        if(password.length < 8)
        {
            setPasswordError('Password should be at least 8 characters!');
            return;
        }
        if(password !== passwordRepeat)
        {
            setPasswordRepeatError('Password not the same!');
            return;
        }
        fetch('/api/signup', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        }).then(response => {
            if(!response.ok)
                return response.json();
            else
            {
                setSuccessMsg('Sign Up Succeed!');
                setTimeout(() => {
                    router.reload(window.location.pathname);
                }, 2000);
            }
        }).then(err => {
            if(err.msg === 'Email Address Exists!')
                setEmailError('Email Address Exists!');
            else setPasswordError(err.msg);
        })
        .catch(console.log);
    }

    return <>
        <button
            type='button'
            className={props.className}
            onClick={() => setActive(true)}
        >Sign Up</button>
        <Modal
            active={active}
            deactive={setActive.bind(null, false)}
            color='rgb(128 128 128 / 50%)'
            center={true}
        >
            <div className={classes.form}>
                <div className={classes.title}>
                    <span>SIGN UP</span>
                </div>
                <div className={classes.input}>
                    <input
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={usernameChangeHandler}
                    ></input>
                    {usernameError && <p>{usernameError}</p>}
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
                    <input
                        type="password"
                        placeholder='Repeat Password'
                        value={passwordRepeat}
                        onChange={passwordRepeatChangeHandler}
                    ></input>
                    {passwordRepeatError && <p>{passwordRepeatError}</p>}
                    {successMsg && <p style={{color: 'green'}}>{successMsg}</p>}
                </div>
                <div className={classes.buttonDiv}>
                    <button type='button' onClick={onSumbitHandler}>Sign Up</button>
                </div>
            </div>
        </Modal>
    </>
}

export default SignInButton;