import React from 'react';
import TRComponent from "tm-react/src/artifacts/component/tr-component";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import {
    Button,
    CssBaseline,
    Grid,
    Paper, TextField,
    Typography,
    withStyles
} from "react-mui-ui/ui/ui-component";
import {LoginLayoutJss} from "../../assets/login-layout-jss";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import {TrFormDefinitionData} from "tm-react/src/artifacts/data/tr-form-definition-data";
import {Link} from "react-router-dom";
import {ApiUrl} from "../../system/api-url";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import {TrUtil} from "tm-react/src/artifacts/util/tr-util";
import {AppConstant} from "../../system/app-constant";
import AuthenticationService from "../../service/authentication-service";
import {AppMessage} from "../../system/app-message";
import {ApiUtil} from "../../system/api-util";

interface LoginUI extends TRProps {
    classes: any;
    route: any;
}

class State extends TRComponentState{

}

class LoginView extends TRComponent<LoginUI, State> {

    state: State = new State();

    constructor(props: LoginUI) {
        super(props);
        this.addFormDefinition("email", new TrFormDefinitionData({
            required: true,
            errorMessage: "Please Enter Email Address",
        }));
        this.addFormDefinition("password", new TrFormDefinitionData({
            required: true,
            errorMessage: "Please Enter Password",

        }));
    }

    componentDidMount() {
        this.showRedirectMessage();
    }


    doLogin(event: any) {
        event.preventDefault();
        const _this = this;
        if (!this.validateFormInput()) {
            this.showErrorFlash("Please enter email or password");
        } else {
            this.postJsonToApi(ApiUrl.LOGIN_URL, this.state.formData,
                {
                    callback(response: TRHTTResponse): void {
                        let apiResponse = ApiUtil.processApiResponseAndShowError(response, _this);
                        if (apiResponse && apiResponse.status === AppConstant.STATUS_SUCCESS && apiResponse.data.login.accessToken) {
                            AuthenticationService.instance().processLoginToken(apiResponse.data);
                            TrUtil.gotoUrl(_this, "/dashboard");
                        }
                    }
                },
                {
                    callback(response: TRHTTResponse): void {
                        ApiUtil.processApiErrorResponse(response, _this);
                    }
                }
            );
        }
    }

    renderUI() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <CssBaseline/>
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography variant="h4">{AppMessage.loginLabel}</Typography>
                        <br/>
                        <form onSubmit={(event:any) => {this.doLogin(event)}} className={classes.form} noValidate>
                            <TextField {...this.handleInputDataChange("email")} type="email" label="Email Address" margin="normal" fullWidth required/>
                            <TextField {...this.handleInputDataChange("password")} type="password" label="Password" margin="normal" fullWidth required/>
                            <Button type="submit" variant="contained" fullWidth color="primary" children="Login" className={classes.submit}/>
                            <Grid container style={{marginTop:20}}>
                                <Grid item xs>
                                    <Link to="#" onClick={event => {TrUtil.gotoUrl(this, "/forgot-password")}} >
                                        Forgot password?
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </main>
            </React.Fragment>
        );
    }
}

export default withStyles(LoginLayoutJss)(LoginView);