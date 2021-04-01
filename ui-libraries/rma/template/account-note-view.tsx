import React from "react";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import TRComponent from "tm-react/src/artifacts/component/tr-component";


interface Props extends TRProps {
    route: any;
    classes?: any;
}

class State extends TRComponentState{}

export default  class AccountNoteView extends TRComponent<Props, State> {

    state: State = new State();

    renderUI() {
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }
}