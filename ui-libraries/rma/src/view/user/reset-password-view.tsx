import React from 'react';
import TRComponent from "tm-react/src/artifacts/component/tr-component";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import {
    Avatar,
    Button,
    CssBaseline,
    FormControl, FormHelperText, Grid,
    Input,
    InputLabel,
    Paper, TextField,
    Typography,
    withStyles
} from "react-mui-ui/ui/ui-component";
import {LoginLayoutJss} from "../../assets/login-layout-jss";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";


interface LoginUI extends TRProps {
    classes: any;
    route: any;
}

class State extends TRComponentState{

}

class ResetPasswordView extends TRComponent<LoginUI, State> {

    state: State = new State();

    constructor(props: LoginUI) {
        super(props);
    }



    renderUI() {
        const {classes} = this.props;
        return (
            <React.Fragment>
            </React.Fragment>
        );
    }
}

export default withStyles(LoginLayoutJss)(ResetPasswordView);