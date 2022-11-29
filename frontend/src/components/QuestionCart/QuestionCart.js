import { useState } from 'react';
import MultipleChoice from '../Forms/MultipleChoice';
import ShortAnswer from '../Forms/ShortAnswer';
import Cart from '../UI/Cart';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import classes from './QuestionCart.module.css';

import { HiOutlineTrash } from 'react-icons/hi';
import { MdContentCopy } from 'react-icons/md';
import { GrAddCircle } from 'react-icons/gr';
import { ArrowUp, ArrowDown } from '../UI/Icons';

const getInitState = (props) => {
    const type = props.content?.type;
    if(!type)
    {
        return {
            type: "MultipleChoice",
            id: props.id
        }
    }
    if(type === 'MultipleChoice')
    {
        if(props.content.subtype === 'multichoice')
        {
            return {
                type: "MultipleChoice",
                id: props.id,
                content: props.content
            }
        }
        if(props.content.subtype === 'checkbox')
        {
            return {
                type: "Checkbox",
                id: props.id,
                content: props.content
            }
        }
    }
    if(type === 'ShortAnswer')
    {
        return {
            type: "ShortAnswer",
            id: props.id,
            content: props.content
        }
    }
}

const QuestionCart = (props) => {
    const [cart, setCart] = useState(getInitState(props));

    const ChangeQuestionHandler = (e) => {
        setCart({
            type: e.target.value,
            id: props.id
        });
    }
    return <Cart
        onClick={props.onEdit}
        id={props.id}
        Focus={props.Focus}
        ScrollTo={props.ScrollTo}
        cancelScroll={props.cancelScroll}
    >
        {props.Focus &&
        <div className={classes.ButtonGroupTop}>
            <select
                className={classes.QuestionType}
                onChange={ChangeQuestionHandler}
                value={cart.type}
            >
                <option value="MultipleChoice">Multiple Choice</option>
                <option value="Checkbox">Checkbox</option>
                <option value="ShortAnswer">Short Answer</option>
            </select>
            <div
                name="DeleteButton"
                className={classes.DeleteButton}
                onClick={e => e.target = e.currentTarget}
            >
                <HiOutlineTrash size={20}/>
            </div>
        </div>}
        {(cart => {
            if(cart.type === "MultipleChoice")
            {
                return <DndProvider backend={HTML5Backend}>
                    <MultipleChoice
                        id={cart.id}
                        subtype='multichoice'
                        className={classes.question}
                        content={cart.content}
                        missingItem={props.missingItem}
                        onErrorClear={props.onErrorClear}
                        preview={!props.Focus}
                        onFocus={props.onFocus}
                    />
                </DndProvider>
            }
            else if(cart.type === "Checkbox")
            {
                return  <DndProvider backend={HTML5Backend}>
                    <MultipleChoice
                        id={cart.id}
                        subtype='checkbox'
                        className={classes.question}
                        content={cart.content}
                        missingItem={props.missingItem}
                        onErrorClear={props.onErrorClear}
                        preview={!props.Focus}
                        onFocus={props.onFocus}
                    />
                </DndProvider>
            }
            else if(cart.type === "ShortAnswer")
            {
                return <DndProvider backend={HTML5Backend}>
                    <ShortAnswer
                        id={cart.id}
                        className={classes.question}
                        content={cart.content}
                        missingItem={props.missingItem}
                        onErrorClear={props.onErrorClear}
                        preview={!props.Focus}
                        onFocus={props.onFocus}
                    />
                </DndProvider>
            }
        })(cart)}
        {props.Focus &&
        <>
            <div className={classes.optionDiv}></div>
            <div className={classes.ButtonGroupBottom}>
                <div
                    name="MoveUp"
                    className={classes.MoveButton}
                    onClick={e => e.target = e.currentTarget}
                >
                    <ArrowUp size={20}/>
                </div>
                <div
                    name="MoveDown"
                    className={classes.MoveButton}
                    onClick={e => e.target = e.currentTarget}
                >
                    <ArrowDown size={20}/>
                </div>
                <div
                    name="AddButton"
                    className={classes.AddButton}
                    onClick={e => e.target = e.currentTarget}
                >
                    <GrAddCircle size={20}/>
                </div>
                <div
                    name="CopyButton"
                    className={classes.CopyButton}
                    onClick={e => e.target = e.currentTarget}
                >
                    <MdContentCopy size={20}/>
                </div>
            </div>
        </>}
    </Cart>
}

export default QuestionCart;