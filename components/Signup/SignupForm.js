import { useRef } from "react";

import classes from './SignupForm.module.css';

const SignupForm = props => {
    const UsernameRef = useRef();
    const PasswordRef = useRef();
    const EmailRef = useRef();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        fetch('/api/signup', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: UsernameRef.current.value,
                email: EmailRef.current.value,
                password: PasswordRef.current.value
            })
        }).then(response => {
            if(!response.ok)
                return response.json();
        }).then(console.log)
        .catch(console.log);
    }

    return (
        <div>
            <form onSubmit={onSubmitHandler} className={classes.form}>
                <input type="text" placeholder="username" ref={UsernameRef}/>
                <input type="password" placeholder="password" ref={PasswordRef}/>
                <input type="email" placeholder="email" ref={EmailRef}/>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default SignupForm;