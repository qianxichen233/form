import Cart from '../../UI/Cart/Cart';
import ChoiceBar from '../../UI/ChoiceBar/ChoiceBar';

import { Options } from '../../UI/Icons';

import classes from './ResponseHeader.module.css';

const ResponseHeader = props => {
    return <Cart className={classes.container}>
        <div className={classes.top}>
            <p>{`${props.responseNumber} Response${props.responseNumber === 1 ? '' : 's'}`}</p>
            <div>
                {props.published ?
                <p className={classes.publish}>Form Published</p> :
                <p className={classes.notpublish}>Form Not Published</p>}
                <div className={classes.icon}>
                    <Options />
                </div>
            </div>
        </div>
        <div className={classes.choice}>
            <ChoiceBar
                options={['Summary', 'Question', 'Individual']}
                active={props.status}
                onChange={props.setStatus}
            />
        </div>
    </Cart>
};

export default ResponseHeader;