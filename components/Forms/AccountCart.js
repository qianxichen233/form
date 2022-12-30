import Cart from "../UI/Cart/Cart";
import { useRouter } from "next/router";

import classes from "./AccountCart.module.css";

const AccountCart = (props) => {
    const router = useRouter();

    const onClickHandler = () => {
        //console.log(`/signin?callback=${encodeURIComponent(router.asPath)}`);
        router.replace(`/signin?callback=${router.asPath}`);
    };

    return (
        <Cart>
            <div className={classes.container}>
                <p>
                    You are answering as{" "}
                    <span>{props.email ? props.email : "Anonymous"}</span>, this
                    email will not be recorded
                </p>
                <span onClick={onClickHandler}>
                    {props.email ? "Switch account" : "Sign in"}
                </span>
            </div>
        </Cart>
    );
};

export default AccountCart;
