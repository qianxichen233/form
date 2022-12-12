import { useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Router from "next/router";

import classes from './SigninForm.module.css';

const SignupForm = props => {
    const { data: session, status } = useSession();

    const PasswordRef = useRef();
    const EmailRef = useRef();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            email: EmailRef.current.value,
            password: PasswordRef.current.value
        });
        if(!result.error) window.location = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;
    }

    return (
        <div>
            <form onSubmit={onSubmitHandler} className={classes.form}>
                <input type="email" placeholder="email" ref={EmailRef}/>
                <input type="password" placeholder="password" ref={PasswordRef}/>
                <button type="submit">Submit</button>
            </form>
            <button type="button" onClick={() => signOut({redirect: false})}>Signout</button>
        </div>
    )
}

export default SignupForm;