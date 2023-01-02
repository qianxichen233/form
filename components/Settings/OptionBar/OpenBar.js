import { useState } from "react";

import { ArrowUp, ArrowDown } from "../../UI/Icons";

import classes from "./OpenBar.module.css";

const OpenBar = (props) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={classes.container}>
            <div
                className={classes.barContainer}
                style={{ height: props.height }}
            >
                <div>
                    <h4>{props.text}</h4>
                    {props.description && <p>{props.description}</p>}
                </div>
                <div
                    onClick={() => {
                        setOpen((prev) => !prev);
                    }}
                >
                    {open ? <ArrowUp /> : <ArrowDown />}
                </div>
            </div>
            {open && <div className={classes.content}>{props.children}</div>}
        </div>
    );
};

export default OpenBar;
