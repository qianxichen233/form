import { useState } from "react";
import Cart from "../UI/Cart/Cart";
import EnableBar from "./OptionBar/EnableBar";
import OpenBar from "./OptionBar/OpenBar";
import TextBar from "./OptionBar/TextBar";
import DivLine from "../UI/DivLine/DivLine";

import classes from "./Settings.module.css";

const Settings = (props) => {
    const [options, setOptions] = useState({
        quiz: false,
        collectEmail: false,
        limitResponse: false,
        shuffleOrder: false,
        linkToNewResponse: false,
        defaultRequired: false,
        confirmMessage: "Your response has been recorded",
    });

    if (props.hide) return;
    return (
        <div className={classes.container}>
            <Cart>
                <p className={classes.title}>Settings</p>
                <DivLine width={`calc(100% - 60px)`} />
                <div className={classes.mainOption}>
                    <EnableBar
                        text="Make this a quiz"
                        description="Assign point values, set answers, and automatically provide feedback"
                        enable={options.quiz}
                        onChange={(status) => {
                            setOptions((prev) => {
                                return { ...prev, quiz: status };
                            });
                        }}
                    />
                </div>
                <DivLine width={`calc(90% - 60px)`} />
                <div className={classes.mainOption}>
                    <OpenBar
                        text="Responses"
                        description="Manage how responses are collected and protected"
                        height={"100px"}
                    >
                        <div className={classes.subOption}>
                            <EnableBar
                                text="Requires sign in"
                                enable={options.collectEmail}
                                onChange={(status) => {
                                    setOptions((prev) => {
                                        return {
                                            ...prev,
                                            collectEmail: status,
                                        };
                                    });
                                }}
                            />
                        </div>
                        <div className={classes.subOption}>
                            <EnableBar
                                text="Limit to 1 Response"
                                enable={options.limitResponse}
                                onChange={(status) => {
                                    setOptions((prev) => {
                                        return {
                                            ...prev,
                                            limitResponse: status,
                                        };
                                    });
                                }}
                            />
                        </div>
                    </OpenBar>
                </div>
                <DivLine width={`calc(90% - 60px)`} />
                <div className={classes.mainOption}>
                    <OpenBar
                        text="Presentation"
                        description="Manage how the form and responses are presented"
                        height={"100px"}
                    >
                        <div className={classes.subOption}>
                            <EnableBar
                                text="Shuffle question order"
                                enable={options.shuffleOrder}
                                onChange={(status) => {
                                    setOptions((prev) => {
                                        return {
                                            ...prev,
                                            shuffleOrder: status,
                                        };
                                    });
                                }}
                            />
                        </div>
                        <div className={classes.subOption}>
                            <TextBar
                                text="Confirmation message"
                                content={options.confirmMessage}
                                onChange={(newText) => {
                                    setOptions((prev) => {
                                        return {
                                            ...prev,
                                            confirmMessage: newText,
                                        };
                                    });
                                }}
                            />
                        </div>
                        <div className={classes.subOption}>
                            <EnableBar
                                text="Show link to submit another response"
                                enable={options.linkToNewResponse}
                                onChange={(status) => {
                                    setOptions((prev) => {
                                        return {
                                            ...prev,
                                            linkToNewResponse: status,
                                        };
                                    });
                                }}
                            />
                        </div>
                    </OpenBar>
                </div>
            </Cart>
            <Cart>
                <p className={classes.title}>Default</p>
                <DivLine width={`calc(100% - 60px)`} />
                <div className={classes.mainOption}>
                    <OpenBar text="Question Defaults" height={"100px"}>
                        <div className={classes.subOption}>
                            <EnableBar
                                text="Make questions required by default"
                                enable={options.defaultRequired}
                                onChange={(status) => {
                                    setOptions((prev) => {
                                        return {
                                            ...prev,
                                            defaultRequired: status,
                                        };
                                    });
                                }}
                            />
                        </div>
                    </OpenBar>
                </div>
            </Cart>
        </div>
    );
};

export default Settings;
