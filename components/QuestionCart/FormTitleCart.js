import FormTitle from "../Forms/FormTitle";
import FormTitleDisplay from "../Forms/FormTitleDisplay";

import TitleCart from "../UI/Cart/TitleCart";

const FormTitleCart = (props) => {
    return (
        <TitleCart
            Focus={props.Focus}
            onClick={props.onClick}
            ScrollTo={props.ScrollTo}
            cancelScroll={props.cancelScroll}
        >
            {props.display ? (
                <>
                    <FormTitleDisplay
                        title={props.title}
                        description={props.description}
                    />
                    {props.children}
                </>
            ) : (
                <FormTitle
                    missingItem={props.missingItem}
                    onErrorClear={props.onErrorClear}
                    preview={!props.Focus}
                    onFocus={props.onFocus}
                    content={props.content}
                    save={props.save}
                />
            )}
        </TitleCart>
    );
};

export default FormTitleCart;
