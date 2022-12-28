import classes from './NumberInput.module.css';
import { ArrowLeft, ArrowRight } from '../Icons';

const NumberInput = props => {
    const updateValue = value => {
        if(value < (props.min || 1))
            value = (props.min || 1);
        if(props.max && value > props.max)
            value = props.max;
        props.onChange(value);
    }

    return <div className={classes.container}>
        <div
            className={`${classes.button} ${props.value === (props.min || 1) ? '' : classes.active}`}
            onClick={e => updateValue(props.value - 1)}>
            <ArrowLeft color={props.value === (props.min || 1) ? 'lightgrey' : ''}/>
        </div>
        <input
            type="number"
            value={props.value}
            onChange={e => updateValue(+e.target.value)}
            onClick={e => e.target.select()}
            autoComplete={"false"}
        />
        <span>of</span>
        <span>{props.max}</span>
        <div
            className={`${classes.button} ${(props.max && props.value === (props.max)) ? '' : classes.active}`}
            onClick={e => updateValue(props.value + 1)}
            style={{marginLeft: '10px'}}
        >
            <ArrowRight color={(props.max && props.value === (props.max)) ? 'lightgrey' : ''}/>
        </div>
    </div>
}

export default NumberInput;