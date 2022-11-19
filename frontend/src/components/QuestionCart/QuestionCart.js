import { useState } from 'react';
import MultipleChoice from '../Forms/MultipleChoice';
import ShortAnswer from '../Forms/ShortAnswer';
import Cart from '../UI/Cart';

import classes from './QuestionCart.module.css';

let currentType = null;

const getInitState = (props) => {
    const type = props.content?.type;
    if(!type)
    {
        currentType = currentType ? currentType : "multiple_choice";
        return <MultipleChoice id={props.id} className={classes.question}/>; //non-copy initial state
    }
    if(type === 'MultipleChoice')
    {
        currentType = currentType ? currentType : "multiple_choice";
        return <MultipleChoice id={props.id} content={props.content} className={classes.question}/>;
    }
    if(type === 'ShortAnswer')
    {
        currentType = currentType ? currentType : "short_answer";
        return <ShortAnswer id={props.id} content={props.content} className={classes.question}/>;
    }
}

const QuestionCart = (props) => {
    const [cart, setCart] = useState(getInitState(props));

    const ChangeQuestionHandler = (e) => {
        if(e.target.value === "multiple_choice")
        {
            currentType = "multiple_choice";
            setCart(<MultipleChoice id={props.id} className={classes.question}/>);
        }
        else if(e.target.value === "short_answer")
        {
            currentType = "short_answer";
            setCart(<ShortAnswer id={props.id} className={classes.question}/>);
        }
    }
    
    return <Cart onClick={props.onEdit} id={props.id}>
        <select
            className={classes.QuestionType}
            onChange={ChangeQuestionHandler}
            value={currentType}
        >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="short_answer">Short Answer</option>
        </select>
        <button name="DeleteButton" className={classes.DeleteButton}>X</button>
        {cart}
        <div className={classes.optionDiv}>
            <div className={classes.divLine}></div>
            <button name="AddButton" className={classes.AddButton}>+</button>
            <button name="CopyButton" className={classes.CopyButton}>Copy</button>
        </div>
    </Cart>
}

export default QuestionCart;