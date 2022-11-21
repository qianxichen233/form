import { useState } from 'react';
import MultipleChoice from '../Forms/MultipleChoice';
import ShortAnswer from '../Forms/ShortAnswer';
import Cart from '../UI/Cart';

import classes from './QuestionCart.module.css';

import { HiOutlineTrash } from 'react-icons/hi';
import { MdContentCopy } from 'react-icons/md';
import { GrAddCircle } from 'react-icons/gr';

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
        <div className={classes.ButtonGroupTop}>
            <select
                className={classes.QuestionType}
                onChange={ChangeQuestionHandler}
                value={currentType}
            >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="short_answer">Short Answer</option>
            </select>
            <div
                name="DeleteButton"
                className={classes.DeleteButton}
                onClick={e => e.target = e.currentTarget}
            >
                <HiOutlineTrash size={20}/>
            </div>
        </div>
        {cart}
        <div className={classes.optionDiv}></div>
        <div className={classes.ButtonGroupBottom}>
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
    </Cart>
}

export default QuestionCart;