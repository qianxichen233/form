import FormTitle from '../Forms/FormTitle';

import Cart from "../UI/Cart";

const FormTitleCart = props => {
    return <Cart Focus={props.Focus} onClick={props.onClick}>
        <FormTitle
            missingItem={props.missingItem}
            onErrorClear={props.onErrorClear}
            preview={!props.Focus}
        />
    </Cart>
}

export default FormTitleCart;