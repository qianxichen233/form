import { useRef, useState } from 'react';
import Modal from '../Modal/Modal';

import classes from './SelectBar.module.css';

import { ShortText, BoxCheckBoxFill, CircleCheckBoxFill, CaretDown } from '../Icons';

const IconMap = {
    MultipleChoice: <CircleCheckBoxFill size={20} color="grey"/>,
    Checkbox: <BoxCheckBoxFill size={20} color="grey"/>,
    ShortAnswer: <ShortText size={20} color="grey"/>
};

const getName = (options, value) => {
    for(const div of options)
        for(const option of div)
            if(option.value === value)
                return option.name;
    return '';
}

const getIndex = (options, value) => {
    let index = 0;
    for(const div of options)
    {
        for(const option of div)
        {
            if(option.value === value)
                return index;
            ++index;
        }
    }
    return index;
}

const SelectBar = props => {
    const [ModalOpen, setModalOpen] = useState(false);

    const ref = useRef(null);

    const onClickHandler = (e) => {
        setModalOpen(true);
    }

    const OptionRender = (option) => {
        return <div
            key={option.value}
            className={`${classes.optionBar} ${option.value === props.value ? classes.selected : ''}`}
            onClick={() => {
                props.onChange(option.value);
                setModalOpen(false);
            }}
            style={{
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            }}
        >
            <div className={classes.icon}>
                {IconMap[option.value]}
            </div>
            <span className={classes.text}>{getName(props.options, option.value)}</span>
        </div>
    }

    return <>
        <div
            className={classes.selectBar}
            onClick={onClickHandler}
            ref={ref}
        >
            <div className={classes.icon}>
                {IconMap[props.value]}
            </div>
            <span className={classes.text}>{getName(props.options, props.value)}</span>
            <div className={classes.arrow}>
                <CaretDown size={10}/>
            </div>
        </div>
        <Modal active={ModalOpen} deactive={setModalOpen.bind(null, false)}>
            {ModalOpen && <div
                className={classes.optionContainer}
                style={{
                    left: ref.current.getBoundingClientRect().left,
                    top: ref.current.getBoundingClientRect().top - getIndex(props.options, props.value) * ref.current.offsetHeight
                }}
            >
                {props.options.map((division, index, array) => {
                    return <div key={index}>
                        {division.map(option => {
                            return OptionRender(option);
                        })}
                        {index === array.length - 1 ? null : <span className={classes.division}></span>}
                    </div>
                })}
            </div>}
        </Modal>
    </>
}

export default SelectBar;