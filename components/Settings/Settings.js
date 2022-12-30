import { useState } from "react";
import Cart from "../UI/Cart/Cart";
import EnableBar from "./OptionBar/EnableBar";
import OpenBar from "./OptionBar/OpenBar";
import TextBar from "./OptionBar/TextBar";
import DivLine from "../UI/DivLine/DivLine";

import classes from "./Settings.module.css";

const Settings = (props) => {
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
                        enable={props.options.quiz}
                        onChange={(status) => {
                            props.setOptions((prev) => {
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
                                text="Collect Email Address"
                                enable={props.options.collectEmail}
                                onChange={(status) => {
                                    props.setOptions((prev) => {
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
                                enable={props.options.limitResponse}
                                onChange={(status) => {
                                    props.setOptions((prev) => {
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
                                enable={props.options.shuffleOrder}
                                onChange={(status) => {
                                    props.setOptions((prev) => {
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
                                content={props.options.confirmMessage}
                                onChange={(newText) => {
                                    props.setOptions((prev) => {
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
                                enable={props.options.linkToNewResponse}
                                onChange={(status) => {
                                    props.setOptions((prev) => {
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
                                enable={props.options.defaultRequired}
                                onChange={(status) => {
                                    props.setOptions((prev) => {
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
