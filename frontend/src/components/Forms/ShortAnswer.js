import Form from '../UI/Form';

const ShortAnswer = () => {
    return <Form>
        <div>
            <input type="text" placeholder='Question Statement'></input>
        </div>
        <input type="text" disabled></input>
    </Form>
}

export default ShortAnswer;