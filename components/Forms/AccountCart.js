import Cart from "../UI/Cart/Cart";
import { useRouter } from "next/router";

import classes from "./AccountCart.module.css";

const AccountCart = (props) => {
    const router = useRouter();

    const onClickHandler = () => {
        router.push(`/signin?callback=${router.asPath}`);
    };

    const showInfo = (logIn, required, responded) => {
        if (logIn) {
            //if log in
            if (!required || !responded) {
                //and not limit response or never responded before
                return `, this email ${
                    props.record ? "WILL" : "will NOT"
                } be recorded`;
            } else {
                //required and responded
                return (
                    <>
                        ,
                        <span style={{ color: "red" }}>
                            {" maximum number of responses reached"}
                        </span>
                    </>
                );
            }
        } else {
            //if not log in
            if (required) {
                //if limit response
                return (
                    <>
                        ,
                        <span style={{ color: "red" }}>
                            {" You must Log in to submit"}
                        </span>
                    </>
                );
            } //respond as Anonymous
            else {
                return;
            }
        }
    };

    return (
        <Cart>
            <div className={classes.container}>
                {props.preview && (
                    <p>
                        You Are Now In
                        <span> Preview Mode</span>
                    </p>
                )}
                {!props.preview && (
                    <>
                        <p>
                            You are answering as{" "}
                            <span>
                                {props.email ? props.email : "Anonymous"}
                            </span>
                            {showInfo(
                                Boolean(props.email),
                                props.required,
                                props.responded
                            )}
                        </p>
                        <span onClick={onClickHandler}>
                            {props.email ? "Switch account" : "Log in"}
                        </span>
                    </>
                )}
            </div>
            {props.requiredHint && (
                <div className={classes.requiredHint}>* Required</div>
            )}
        </Cart>
    );
};

export default AccountCart;
