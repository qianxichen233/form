import classes from './MultipleChoice.module.css';

import OptionInputAnswer from '../UI/OptionBar/OptionInputAnswer';

import { CircleCheckBox,
         CircleCheckBoxFill,
         BoxCheckBox,
         BoxCheckBoxFill } from '../UI/Icons';

const RenderCircleCheckBox = (checked) => {
    if(checked) return <CircleCheckBoxFill className={classes.icon} size={20} color="grey"/>
    return <CircleCheckBox className={classes.icon} size={20} color="grey"/>;
}

const RenderBoxCheckBox = (checked) => {
    if(checked) return <BoxCheckBoxFill className={classes.icon} size={20} color="grey"/>
    return <BoxCheckBox className={classes.icon} size={20} color="grey"/>;
}

const OptionDisplay = (props) => {
    return <div className={classes.optionContainer}>
        {props.options.map((option, index) => {
            return <div
                key={option.key}
                className={classes.container}
                >
                    {
                        props.type === 'multichoice' ?
                        RenderCircleCheckBox(props.fill) :
                        RenderBoxCheckBox(props.fill)
                    }
                    <OptionInputAnswer
                        placeholder={`Option ${index + 1}`}
                        value={option.content}
                    />
            </div>
        })}
    </div>;
}

export default OptionDisplay;