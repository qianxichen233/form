import { useState, useEffect, useRef } from "react";

import Form from "../UI/Form";

const MultipleChoice = (props) => {
    const [options, setOptions] = useState([]);

    const optionsRef = useRef();
    optionsRef.current = options; //to escape closure

    const DeleteOptionHandler = (e) => {
        e.preventDefault();
        if(e.target.type == "button")
        {
            const newOptions = optionsRef.current.filter((elem) => {
                return +elem.props.id !== +e.currentTarget.id;
            });
            setOptions(newOptions);
        }
    }

    const AddOptionHandler = (e) => {
        e.preventDefault();
        let newOptions = [...optionsRef.current];
        const key = Math.random(); //use random number as key
        newOptions.push(
            <div onClick={DeleteOptionHandler} key={key} id={key}>
                <input type="text" autoFocus></input>
                <button type="button">X</button>
            </div>
        );
        setOptions(newOptions);
    }

    useEffect(() => {
        let options = [];
        for(let i = 0; i < 4; ++i) //4 options initially
        {
            const key = Math.random(); //use random number as key
            options.push(
                <div onClick={DeleteOptionHandler} key={key} id={key}>
                    <input type="text"></input>
                    <button type="button">X</button>
                </div>
            );
        }
        setOptions(options);
    }, []);

    return <Form>
        <div>
            <input type="text" placeholder="Question Statement"></input>
        </div>
        {options}
        <input type="text" placeholder="Add Option" onClick={AddOptionHandler}></input>
    </Form>;
}

export default MultipleChoice;