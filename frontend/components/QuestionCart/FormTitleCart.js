import FormTitle from '../Forms/FormTitle';

import TitleCart from "../UI/Cart/TitleCart";

const FormTitleCart = props => {
    return <TitleCart
        Focus={props.Focus}
        onClick={props.onClick}
        ScrollTo={props.ScrollTo}
        cancelScroll={props.cancelScroll}
    >
        <FormTitle
            missingItem={props.missingItem}
            onErrorClear={props.onErrorClear}
            preview={!props.Focus}
            onFocus={props.onFocus}
        />
    </TitleCart>
}

export default FormTitleCart;