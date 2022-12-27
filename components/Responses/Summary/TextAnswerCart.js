import Cart from "../../UI/Cart/Cart";

import classes from './TextAnswerCart.module.css';

const TextAnswerCart = props => {
    const responses = props.responses.map(response => {
        if(!response) return;
        if(typeof(response) !== 'string')
            return response.blocks.map(
                block => (!block.text.trim() && '\n') || block.text
            ).join('\n');
        return response;
    }).filter(response => {
        if(response) return true;
    });

    const description = props.question.description.blocks.map(
        block => (!block.text.trim() && '\n') || block.text
    ).join('\n');

    return <Cart>
        <header className={classes.header}>
            <div>
                <h3>{description}</h3>
                <p>{`${responses.length} response${responses.length === 1 ? '' : 's'}`}</p>
                {responses.length === 0 && <p>No responses yet for this question</p>}
            </div>
        </header>
        <ul className={classes.responseContainer}>
            {responses.map((response, index) => {
                if(!response) return null;
                return <li key={index}>
                    {response}
                </li>
            })}
        </ul>
    </Cart>
}

export default TextAnswerCart;