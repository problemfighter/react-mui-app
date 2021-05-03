import React from "react";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import TRComponent from "tm-react/src/artifacts/component/tr-component";
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
import TRReactSelect from "../../../../react-mui-ui/ui/tr-react-select";
import RMAEnumDropdown from "../../../data/rma-enum-dropdown";


interface Props extends TRProps {
    route: any;
    title?: any;
    updateButtonLabel?: any
    parentComponent: any
    updateURL: string
    detailsURL: string
    onClose(): void
}

class State extends TRComponentState{}

export default class ResourceEditView extends TRComponent<Props, State> {

    state: State = new State();

    static defaultProps = {
        title: "Update",
        updateButtonLabel: "Update"
    };

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.showRedirectMessage();
        this.loadFormData();
    }


    loadFormData() {
        const _this = this;
        let message = "Data not available";
        this.getToApi(_this.props.detailsURL,
            {
                callback(response: TRHTTResponse): void {
                    let apiResponse = ApiUtil.processApiResponseAndShowError(response, _this);
                    if (apiResponse && apiResponse.status === AppConstant.STATUS_SUCCESS && !ApiUtil.isEmptyObject(apiResponse.data)) {
                        let data = apiResponse.data;
                        _this.setState({formData: data})
                    } else {
                        _this.props.parentComponent.showErrorFlash("Unable to load data from API");
                        _this.props.onClose();
                    }
                }
            },
            {
                callback(response: TRHTTResponse): void {
                    _this.props.parentComponent.showErrorFlash(message);
                    _this.props.onClose();
                }
            }
        );
    }


    uploadFile(event: any) {
        event.preventDefault();
        const _this = this;
        if (this.validateFormInput()) {
            this.postFileToApi(this.props.updateURL, this.state.formData,
                {
                    callback(response: TRHTTResponse): void {
                        let apiResponse = ApiUtil.processApiResponse(response, _this);
                        if (apiResponse && apiResponse.status === AppConstant.STATUS_SUCCESS) {
                            _this.props.parentComponent.showSuccessFlash("Successfully Updated");
                             _this.props.parentComponent.loadData()
                            _this.props.onClose();
                        } else {
                           ApiUtil.processApiResponseError(apiResponse, _this);
                        }
                    }
                },
                {
                    callback(response: TRHTTResponse): void {
                        _this.props.parentComponent.showErrorFlash("Unable to save data to API");
                        _this.props.onClose();
                    }
                }
            )
        }
    }


    renderUI() {
        let _this = this;
        return (
            <React.Fragment>
                <Card>
                    <CardHeader title={this.props.title}/>
                    <Divider />
                    <form noValidate autoComplete="off">
                        <CardContent>
                            <Grid  container spacing={4}>
                                <Grid item xs={6} ><TextField {...this.handleInputDataChange("title")}  label="Title" fullWidth /></Grid>
                                <Grid item xs={6} ><TextField {...this.handleInputDataChange("altText")}  label="Alt Text" fullWidth /></Grid>
                                <Grid item xs={6}><TextField {...this.handleInputDataChange("viewOrder")} label="View Order" fullWidth/></Grid>
                                <Grid item xs={6} ><TRReactSelect name="useFor" label="Use For" options={RMAEnumDropdown.useForTypeDropDown} optionLabel="name" optionValue="value" {...this.handleInputDataChange("useFor")}/></Grid>
                                <Grid item xs={12}><TextField {...this.handleInputDataChangeByType("name", "file")} type="file" label="Upload file" fullWidth/></Grid>
                                <Grid item xs={12} >
                                    <TextField {...this.handleInputDataChange("description")} rows={5} multiline={true}  label="Description" fullWidth />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Grid container spacing={1}  justify="flex-end">
                                <Grid  item xs={1}>
                                    <Button size="small" color="primary" type="button" fullWidth variant="contained" onClick={(event: any) => { _this.uploadFile(event)}} children={this.props.updateButtonLabel}/></Grid>
                                <Grid  item xs={1}>
                                    <Button color="secondary" size="small" fullWidth variant="contained" children="Close" onClick={(event:any) => {_this.props.onClose()}}/></Grid>
                            </Grid>
                        </CardActions>
                    </form>
                </Card>
            </React.Fragment>
        )
    }
}