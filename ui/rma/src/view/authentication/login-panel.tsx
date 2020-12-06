import React from 'react';
import TRComponent from "tm-react/src/artifacts/component/tr-component";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";


export default class LoginPanel extends TRComponent<any, TRComponentState> {
     renderUI() {
        return (
            <React.Fragment>
                <h1>React Mono Repo View</h1>
            </React.Fragment>
        );
    }
}