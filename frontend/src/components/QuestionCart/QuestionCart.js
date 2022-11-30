import { useState } from 'react';

import MultipleChoice from '../Forms/MultipleChoice';
import ShortAnswer from '../Forms/ShortAnswer';
import Cart from '../UI/Cart/Cart';
import SelectBar from '../UI/SelectBar/SelectBar';

import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import classes from './QuestionCart.module.css';

import { ArrowUp, ArrowDown, AddButton, DeleteCartButton, CopyButton } from '../UI/Icons';

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

    const ChangeQuestionHandler = (value) => {
        setCart({
            type: value,
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
            <div className={classes.SelectButton}>
                <SelectBar
                    onChange={ChangeQuestionHandler}
                    value={cart.type}
                    options={
                        [
                            [
                                {value: "MultipleChoice", name: "Multiple Choice"},
                                {value: "Checkbox", name: "Checkbox"}
                            ],
                            [
                                {value: "ShortAnswer", name: "Short Answer"}
                            ]
                        ]
                    }
                />
            </div>
            <div
                name="DeleteButton"
                className={classes.DeleteButton}
                onClick={e => e.target = e.currentTarget}
            >
                <DeleteCartButton size={25} color="grey"/>
            </div>
        </div>}
        {(cart => {
            if(cart.type === "MultipleChoice")
            {
                return <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
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
                return  <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
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
                return <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
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
                    <ArrowUp size={25} color="grey"/>
                </div>
                <div
                    name="MoveDown"
                    className={classes.MoveButton}
                    onClick={e => e.target = e.currentTarget}
                >
                    <ArrowDown size={25} color="grey"/>
                </div>
                <div
                    name="AddButton"
                    className={classes.AddButton}
                    onClick={e => e.target = e.currentTarget}
                >
                    <AddButton size={25} color="grey"/>
                </div>
                <div
                    name="CopyButton"
                    className={classes.CopyButton}
                    onClick={e => e.target = e.currentTarget}
                >
                    <CopyButton size={25} color="grey"/>
                </div>
            </div>
        </>}
    </Cart>
}

export default QuestionCart;