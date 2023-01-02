import classes from "./SigninPage.module.css";

import SigninForm from "./SigninForm";
import SignUpForm from "./SignUpForm";
import { useState } from "react";

const SigninPage = (props) => {
    const [status, setStatus] = useState("signin");

    return (
        <div className={classes.container}>
            {status === "signin" && <SigninForm onChangeStatus={setStatus} />}
            {status === "signup" && <SignUpForm onChangeStatus={setStatus} />}
        </div>
    );
};

export default SigninPage;
