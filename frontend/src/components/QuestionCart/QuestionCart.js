import { useState } from 'react';

import MultipleChoice from '../Forms/MultipleChoice';
import TextAnswer from '../Forms/TextAnswer';

import Cart from '../UI/Cart/Cart';
import SelectBar from '../UI/SelectBar/SelectBar';

import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import classes from './QuestionCart.module.css';

import { ArrowUp, ArrowDown, AddButton, DeleteCartButton, CopyButton } from '../UI/Icons';

const getType = (type) => {
    if(!type) return null;
    if(type.type === 'MultipleChoice')
    {
        if(type.subtype === 'multichoice')
            return "MultipleChoice";
        if(type.subtype === 'checkbox')
            return "Checkbox";
    }
    if(type.type === "TextAnswer")
    {
        if(type.subtype === "shortanswer")
            return "ShortAnswer";
        if(type.subtype === "paragraph")
            return "Paragraph";
    }
}

const getInitState = (props) => {
    const type = props.content?.type;
    if(!type)
    {
        const initialType = getType(props.initialType);
        return {
            type: initialType ? initialType : "MultipleChoice",
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
    if(type === 'TextAnswer')
    {
        if(props.content.subtype === 'shortanswer')
        {
            return {
                type: "ShortAnswer",
                id: props.id,
                content: props.content
            }
        }
        if(props.content.subtype === 'paragraph')
        {
            return {
                type: "Paragraph",
                id: props.id,
                content: props.content
            }
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
                                {value: "Paragraph", name: "Paragraph"},
                                {value: "ShortAnswer", name: "Short Answer"}
                            ],
                            [
                                {value: "MultipleChoice", name: "Multiple Choice"},
                                {value: "Checkbox", name: "Checkbox"}
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
                    <TextAnswer
                        id={cart.id}
                        subtype='shortanswer'
                        className={classes.question}
                        content={cart.content}
                        missingItem={props.missingItem}
                        onErrorClear={props.onErrorClear}
                        preview={!props.Focus}
                        onFocus={props.onFocus}
                    />
                </DndProvider>
            }
            else if(cart.type === "Paragraph")
            {
                return <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
                    <TextAnswer
                        id={cart.id}
                        subtype='paragraph'
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