import { useState } from 'react';
import MultipleChoice from '../Forms/MultipleChoice';
import ShortAnswer from '../Forms/ShortAnswer';
import Cart from '../UI/Cart';

import classes from './QuestionCart.module.css';

const QuestionCart = () => {
    const [cart, setCart] = useState(
        <MultipleChoice/>
    );

    const ChangeQuestionHandler = (e) => {
        if(e.target.value === "multiple_choice")
            setCart(<MultipleChoice/>);
        else if(e.target.value === "short_answer")
            setCart(<ShortAnswer/>);
    }

    return <Cart>
        <select className={classes.QuestionType} onChange={ChangeQuestionHandler}>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="short_answer">Short Answer</option>
        </select>
        {cart}
    </Cart>
}

export default QuestionCart;