import classes from './header.module.css';

const Header = (props) => {
    return <div className={classes.header}>
        <input
            text="text"
            value={props.title}
            onChange={props.onChange}
        ></input>
    </div>
}

export default Header;