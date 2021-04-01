import React from 'react';
import TRComponent from "tm-react/src/artifacts/component/tr-component";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import {
    Button,
    CssBaseline,
    FormControl,
    Input,
    InputLabel,
    Paper,
    Typography,
    withStyles
} from "react-mui-ui/ui/ui-component";
import {LoginLayoutJss} from "../../assets/login-layout-jss";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import {TrFormDefinitionData} from "tm-react/src/artifacts/data/tr-form-definition-data";
import {ApiUrl} from "../../system/api-url";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import {TrUtil} from "tm-react/src/artifacts/util/tr-util";
import {AppConstant} from "../../system/app-constant";
import AuthenticationService from "../../service/authentication-service";
import {ApiUtil} from "../../system/api-util";

interface ForgotPasswordViewProps extends TRProps {
    classes: any;
    route: any;
}

class ForgotPasswordView extends TRComponent<ForgotPasswordViewProps, TRComponentState> {

    state: TRComponentState = new TRComponentState();

    componentDidMount() {
        this.addFormDefinition("email", new TrFormDefinitionData({
            required: true,
            errorMessage: "Please Enter Email Address",
            isHelpTextAttribute: false
        }));
    }

    resetPassword(event: any) {
        event.preventDefault();
        const _this = this;
        if (!this.validateFormInput()) {
            this.showErrorFlash("Please enter your email.");
        } else {
            this.postJsonToApi(ApiUrl.RESET_PASSWORD, this.state.formData,
                {
                    callback(response: TRHTTResponse): void {
                        let apiResponse = ApiUtil.processApiResponse(response, _this);
                        if (apiResponse.status === AppConstant.STATUS_SUCCESS && apiResponse.data.token) {
                            AuthenticationService.instance().processLoginToken(apiResponse.data);
                            _this.successRedirect("/", "Reset Email has been sent.")
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
                        <Typography variant="h5">Forgot password</Typography>
                        <form onSubmit={(event:any) => {this.resetPassword(event)}} className={classes.form}>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Email Address</InputLabel>
                                <Input id="email" autoComplete="email"
                                       autoFocus {...this.handleInputDataChange("email")} />
                            </FormControl>
                            <Button type="submit" variant="contained" fullWidth color="primary" children="Send" className={classes.submit}/>
                            <Button variant="contained" fullWidth color="primary" children="Try Login" onClick={event => { TrUtil.gotoUrl(this, "/");}} className={classes.submit}/>
                        </form>
                    </Paper>
                </main>
            </React.Fragment>
        );
    }
}

export default withStyles(LoginLayoutJss)(ForgotPasswordView);