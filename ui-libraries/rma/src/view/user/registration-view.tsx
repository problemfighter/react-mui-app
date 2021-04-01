import React from 'react';
import TRComponent from "tm-react/src/artifacts/component/tr-component";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import {
    Button, Card, CardActions, CardContent, CardHeader, Grid, TextField
} from "react-mui-ui/ui/ui-component";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import {TrUtil} from "tm-react/src/artifacts/util/tr-util";
import {TrFormDefinitionData} from "tm-react/src/artifacts/data/tr-form-definition-data";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import {AppConstant} from "../../system/app-constant";
import {ApiUtil} from "../../system/api-util";
import {TRMessageData} from "tm-react/src/artifacts/data/tr-message-data";
import TRReactSelect from "react-mui-ui/ui/tr-react-select";
import UserUrlMapping from "./user-url-mapping";


interface Props extends TRProps {
    route: any;
}

class State extends TRComponentState{
    isEdit: boolean = false;
    submitUrl: string = UserUrlMapping.API.CREATE;
    formHeading: string = "Create User";
    buttonLabel: string = "Save";
    accessGroups: Array<object> = [];
}

class RegistrationView extends TRComponent<Props, State> {

    state: State = new State();

    constructor(props: Props) {
        super(props);
        this.addFormDefinition("email", new TrFormDefinitionData({
            required: true,
            customValidation:{validate(fieldName: string, value: any, formData: { [p: string]: any }): TRMessageData {
                    if (!value){
                        return TRMessageData.failed("Please Enter Email Address")
                    }
                    let regex = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
                    if (regex.test(value))
                    {
                        return TRMessageData.success("");
                    }
                    return TRMessageData.failed("You have entered an invalid email address!")
                }}
        }));
        this.addFormDefinition("firstName", new TrFormDefinitionData({
            required: true,
            errorMessage: "Please Enter First Name",

        }));

        let uuid = ApiUtil.getParamsDataFromRouter(this.props.route, "uuid");
        if (!uuid){
            this.addFormDefinition("password", new TrFormDefinitionData({
                required: true,
                errorMessage: "Please Enter Password.",

            }));
        }
    }

    componentDidMount() {
        this.showRedirectMessage();
        this.loadAccessGroup();
        let uuid = ApiUtil.getParamsDataFromRouter(this.props.route, "uuid");
        if (uuid){
            this.setState({
                isEdit: true,
                formHeading: "Update User",
                buttonLabel: "Update",
            });
            this.state.submitUrl = UserUrlMapping.API.UPDATE;
            this.loadFormData(uuid);
        }
    }


    loadAccessGroup() {
        const _this = this;
        let message = "Invalid Access Group";
        this.getToApi(UserUrlMapping.API.ACCESS_GROUP_LIST,
            {
                callback(response: TRHTTResponse): void {
                    let apiResponse = ApiUtil.processApiResponseAndShowError(response, _this);
                    if (apiResponse && apiResponse.status === AppConstant.STATUS_SUCCESS) {
                        _this.setState({accessGroups: apiResponse.data})
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


    onSubmit(event: any) {
        event.preventDefault();
        const _this = this;
        if (this.validateFormInput()) {
            this.postJsonToApi(this.state.submitUrl, this.state.formData,
                {
                    callback(response: TRHTTResponse): void {
                        let apiResponse = ApiUtil.processApiResponse(response, _this);
                        if (apiResponse && apiResponse.status === AppConstant.STATUS_SUCCESS) {
                            _this.successRedirect(UserUrlMapping.ui.list, apiResponse.message);
                        } else {
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
        } else {
            _this.showErrorFlash("Your Form Inputs are not valid.")
        }
    }

    renderUI() {
        const _this = this;
        return (
            <React.Fragment>
                <Card>
                    <CardHeader title={this.state.formHeading}/>
                    <form onSubmit={(event: any) => { this.onSubmit(event)}} noValidate>
                        <CardContent>
                            <Grid component="div" container spacing={3}>
                                <Grid item xs={6} component="div"><TextField {...this.handleInputDataChange("firstName")} label="First Name" margin="normal" fullWidth /></Grid>
                                <Grid item xs={6} component="div"><TextField {...this.handleInputDataChange("lastName")}  label="Last Name" margin="normal" fullWidth /></Grid>
                                <Grid item xs={6} component="div"><TextField {...this.handleInputDataChange("email")} type="email" label="Email Address" margin="normal" fullWidth /></Grid>
                                {
                                    this.state.isEdit ? "" : (<Grid item xs={6} component="div"><TextField {...this.handleInputDataChange("password")} type="password" label="Password" margin="normal" fullWidth /></Grid>)
                                }
                                <Grid item xs={6} component="div"><TRReactSelect {...this.handleInputDataChange("accessGroup")} label="Access Group" options={this.state.accessGroups} optionLabel="name" optionValue="id" /></Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Grid container spacing={1} component="div" justify="flex-end">
                                <Grid component="div" item xs={1}>
                                    <Button size="small" color="primary" type="submit" fullWidth variant="contained" children={this.state.buttonLabel}/></Grid>
                                <Grid component="div" item xs={1}>
                                    <Button color="secondary" size="small" fullWidth variant="contained" children="Cancel" onClick={(event:any) => {TrUtil.gotoUrl(_this, UserUrlMapping.ui.list)}}/></Grid>
                            </Grid>
                        </CardActions>
                    </form>
                </Card>
            </React.Fragment>
        );
    }
}

export default RegistrationView;