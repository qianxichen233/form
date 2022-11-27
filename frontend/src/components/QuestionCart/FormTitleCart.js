import FormTitle from '../Forms/FormTitle';

import TitleCart from "../UI/TitleCart";


const FormTitleCart = props => {
    return <TitleCart Focus={props.Focus} onClick={props.onClick}>
        <FormTitle
            missingItem={props.missingItem}
            onErrorClear={props.onErrorClear}
            preview={!props.Focus}
            onFocus={props.onFocus}
        />
    </TitleCart>
}

export default FormTitleCart;