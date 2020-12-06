import React from 'react';
import {TRProps, TRState} from "tm-react/src/artifacts/model/tr-model";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import TRReactComponent from "tm-react/src/artifacts/framework/tr-react-component";
import {TRProgress} from "react-mui-ui/ui/tr-progress";
import TRFlashMessage, {Variant} from "react-mui-ui/ui/tr-flash-message";


interface Props extends TRProps {
    componentState: TRComponentState;
    component: any;
}

export default class AppBeforeRenderUIView extends TRReactComponent<Props, TRState> {

    render() {
        const props = this.props;
        const {showProgress, showFlashMessage, messageData} = this.props.componentState;
        return (
            <React.Fragment>
                {showFlashMessage ? (<TRFlashMessage message={messageData.message} isOpen={showFlashMessage} onCloseFunction={
                    (event: any) => {
                        if (props.component && props.component.closeFlashMessage) {
                            props.component.closeFlashMessage();
                        }
                    }
                } variant={Variant[messageData.status]}/>) : ""}
                {showProgress ? (TRProgress.linear(showProgress, "secondary",  9999)) : ""}
            </React.Fragment>
        );
    }

}