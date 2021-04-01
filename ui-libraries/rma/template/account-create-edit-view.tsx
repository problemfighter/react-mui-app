import React from "react";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import TRComponent from "tm-react/src/artifacts/component/tr-component";
import AccountUrlMapping from "../accounts/account-url-mapping";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import {ApiUtil} from "react-material-app/src/system/api-util";
import {AppConstant} from "react-material-app/src/system/app-constant";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField
} from "react-mui-ui/ui/ui-component";
import {TrUtil} from "tm-react/src/artifacts/util/tr-util";
import UserUrlMapping from "react-material-app/src/view/user/user-url-mapping";


interface Props extends TRProps {
    route: any;
    classes?: any;
}

class State extends TRComponentState{
    isEdit: boolean = false;
    submitUrl: string = UserUrlMapping.API.CREATE;
    formHeading: string = "Create Contact";
    buttonLabel: string = "Save";
}

export default  class ContactCreateEditView extends TRComponent<Props, State> {

    state: State = new State();



    componentDidMount() {
        this.showRedirectMessage();
        let uuid = ApiUtil.getParamsDataFromRouter(this.props.route, "uuid");
        if (uuid){
            this.setState({
                isEdit: true,
                formHeading: "Update Contact",
                buttonLabel: "Update",
            });
            this.state.submitUrl = UserUrlMapping.API.UPDATE;
            this.loadFormData(uuid);
        }
    }


    loadFormData(uuid: any) {
        const _this = this;
        let filter = {
            where: {
                equal: {"uuid": uuid}
            }
        };
        let message = "Invalid Data";
        this.postJsonToApi(UserUrlMapping.API.DETAILS, filter,
            {
                callback(response: TRHTTResponse): void {
                    let apiResponse = ApiUtil.processApiResponseAndShowError(response, _this);
                    if (apiResponse && apiResponse.status === AppConstant.STATUS_SUCCESS && !ApiUtil.isEmptyObject(apiResponse.data)) {
                        let data = apiResponse.data;
                        data["where"] = filter.where;
                        _this.setState({formData: data})
                    } else {
                        _this.failedRedirect(UserUrlMapping.ui.list, message);
                    }
                }
            },
            {
                callback(response: TRHTTResponse): void {
                    _this.failedRedirect(UserUrlMapping.ui.list, message);
                }
            }
        );
    }


    onSubmit (event: any){
        event.preventDefault();
        const _this = this;
        if (this.validateFormInput()) {
            this.postJsonToApi(this.state.submitUrl, this.state.formData,
                {
                    callback(response: TRHTTResponse): void {
                        let apiResponse = ApiUtil.processApiResponse(response, _this);
                        if (apiResponse && apiResponse.status === AppConstant.STATUS_SUCCESS) {
                            _this.successRedirect( "accounts", apiResponse.message);
                        }else{
                            ApiUtil.processApiResponseError(apiResponse, _this);
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
        let _this = this;
        return (
            <React.Fragment>
                <Card>
                    <CardHeader title={this.state.formHeading}/>
                    <Divider />
                    <form onSubmit={(event: any) => { this.onSubmit(event)}} noValidate autoComplete="off">
                        <CardContent>
                            <Grid  container spacing={4}>
                                <Grid item xs={5} ><TextField {...this.handleInputDataChange("firstName")}  label="First Name" fullWidth /></Grid>
                                <Grid item xs={5} ><TextField {...this.handleInputDataChange("lastName")}  label="Last Name" fullWidth /></Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Grid container spacing={1}  justify="flex-end">
                                <Grid  item xs={1}>
                                    <Button size="small" color="primary" type="submit" fullWidth variant="contained" children={this.state.buttonLabel}/></Grid>
                                <Grid  item xs={1}>
                                    <Button color="secondary" size="small" fullWidth variant="contained" children="Cancel" onClick={(event:any) => {TrUtil.gotoUrl(_this, "/accounts")}}/></Grid>
                            </Grid>
                        </CardActions>
                    </form>
                </Card>
            </React.Fragment>
        )
    }
}