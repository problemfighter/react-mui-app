import React from 'react';
import TRComponent from "tm-react/src/artifacts/component/tr-component";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import {
    Button, Card, CardActions, CardContent, CardHeader,
    Grid,
    TextField,
} from "react-mui-ui/ui/ui-component";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import {TrFormDefinitionData} from "tm-react/src/artifacts/data/tr-form-definition-data";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import {AppConstant} from "../../system/app-constant";
import {TrUtil} from "tm-react/src/artifacts/util/tr-util";
import {ApiUtil} from "../../system/api-util";
import UserUrlMapping from "./user-url-mapping";


interface Props extends TRProps {
    classes: any;
    route: any;
}

class State extends TRComponentState{

}

class ChangePasswordView extends TRComponent<Props, State> {

    state: State = new State();

    constructor(props: Props) {
        super(props);
        this.addFormDefinition("current_password", new TrFormDefinitionData({
            required: true,
            errorMessage: "Please Enter Current Password",
        }));
        this.addFormDefinition("new_password", new TrFormDefinitionData({
            required: true,
            errorMessage: "Please Enter New Password",

        }));
        this.addFormDefinition("confirm_new_password", new TrFormDefinitionData({
            required: true,
            errorMessage: "Please Enter Confirm your new password.",

        }));
    }


    onSubmit (event: any){
        event.preventDefault();
        const _this = this;
        if (this.validateFormInput()) {
            if (this.state.formData.new_password !== this.state.formData.confirm_new_password) {
                _this.showErrorFlash("New Password and confirm password not matched.")
            }else{
                this.putJsonToApi(UserUrlMapping.API.CHANGE_PASSWORD, this.state.formData,
                    {
                        callback(response: TRHTTResponse): void {
                            let apiResponse = ApiUtil.processApiResponse(response, _this);
                            if (apiResponse.status === AppConstant.STATUS_SUCCESS) {
                                _this.successRedirect( "/user", apiResponse.message);
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
    }

    renderUI() {
        const _this = this;
        return (
            <React.Fragment>
                <Card>
                    <CardHeader title="Change Password"/>
                    <form onSubmit={(event: any) => { this.onSubmit(event)}} noValidate>
                        <CardContent>
                            <Grid component="div" container spacing={3}>
                                <Grid item xs={12} component="div"><TextField {...this.handleInputDataChange("current_password")} type="password" label="Current Password" margin="normal" fullWidth /></Grid>
                                <Grid item xs={6} component="div"><TextField {...this.handleInputDataChange("new_password")} type="password"  label="New Password" margin="normal" fullWidth /></Grid>
                                <Grid item xs={6} component="div"><TextField {...this.handleInputDataChange("confirm_new_password")}  type="password" label="Confirm new password" margin="normal" fullWidth /></Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Grid container spacing={1} component="div" justify="flex-end">
                                <Grid component="div" item xs={1}>
                                    <Button size="small" color="primary" type="submit" fullWidth variant="contained" children="Update"/></Grid>
                                <Grid component="div" item xs={1}>
                                    <Button color="secondary" size="small" fullWidth variant="contained" children="Cancel" onClick={(event:any) => {TrUtil.gotoUrl(_this, "/user")}}/></Grid>
                            </Grid>
                        </CardActions>
                    </form>
                </Card>
            </React.Fragment>
        );
    }
}

export default ChangePasswordView;