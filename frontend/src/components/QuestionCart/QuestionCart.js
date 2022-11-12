import { useState } from 'react';
import MultipleChoice from '../Forms/MultipleChoice';
import ShortAnswer from '../Forms/ShortAnswer';
import Cart from '../UI/Cart';

import classes from './QuestionCart.module.css';

const QuestionCart = (props) => {
    const [cart, setCart] = useState(
        <MultipleChoice id={props.id} content={props.content}/>
    );

    const ChangeQuestionHandler = (e) => {
        if(e.target.value === "multiple_choice")
            setCart(<MultipleChoice id={props.id}/>);
        else if(e.target.value === "short_answer")
            setCart(<ShortAnswer id={props.id}/>);
    }

    return <Cart onClick={props.onEdit} id={props.id}>
        <select className={classes.QuestionType} onChange={ChangeQuestionHandler}>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="short_answer">Short Answer</option>
        </select>
        <button name="DeleteButton" className={classes.DeleteButton}>X</button>
        {cart}
        <button name="AddButton" className={classes.AddButton}>+</button>
        <button name="CopyButton" className={classes.CopyButton}>Copy</button>
    </Cart>
}

export default QuestionCart;