import classes from "./DivLine.module.css";

const DivLine = (props) => {
    return (
        <div
            className={classes.container}
            style={{ height: props.height, width: props.width }}
        ></div>
    );
};

export default DivLine;
