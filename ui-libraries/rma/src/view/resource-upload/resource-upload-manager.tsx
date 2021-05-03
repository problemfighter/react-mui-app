import TRComponent from "tm-react/src/artifacts/component/tr-component";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import {
    Box, Card, CardActionArea, CardMedia, CloudUploadIcon, DeleteIcon,
    Divider, EditIcon,
    Grid, IconButton, LinearProgress, SaveIcon, Typography
} from "react-mui-ui/ui/ui-component";
import React from "react";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import {ApiUtil} from "../../system/api-util";
import {AppConstant} from "../../system/app-constant";
import TRDialog, {DialogMaxWidth} from "../../../../react-mui-ui/ui/tr-dialog";
import ResourceEditView from "./resource-edit-view";


interface Props extends TRProps {
    route: any;
    title?: string
    uploadButtonLabel?: string
    inputName?: string
    gridSize?: any,
    uploadParams?: any
    uploadUrl: string
    listUrl: string
    deleteUrl: string
    imgSrcMiddleUrl: string

    enableEdit?: boolean;
    updateTitle?: any;
    updateButtonLabel?: any
    updateURL?: string
    detailsURL?: string
}

class State extends TRComponentState {
    isProcessing: any = []
    list: any = [];
    isOpenEditPopup: boolean = false
    updateURL: any
    detailsURL: any
}

export default class ResourceUploadManager extends TRComponent<Props, State> {

    static defaultProps = {
        title: "Resources",
        uploadButtonLabel: "Upload",
        gridSize: 2,
        inputName: "file",
    };

    state: State = new State();

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.loadData()
    }

    loadThumbX(file: File, index: any) {
        return (
            <Grid item xs={3} key={index}>
                <Card>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="200"
                            width="200"
                            image={URL.createObjectURL(file)}
                        />
                    </CardActionArea>
                    <Box textAlign="center">
                        <IconButton color="primary" component="span" title="Update meta information">
                            <EditIcon/>
                        </IconButton>
                        <IconButton color="secondary" component="span" title="Delete the resources">
                            <DeleteIcon/>
                        </IconButton>
                        <IconButton color="primary" component="span" title="Replace the resources">
                            <CloudUploadIcon/>
                        </IconButton>
                    </Box>
                </Card>
            </Grid>
        )
    }

    deleteUploadedPreview(event: any, index: any) {
        let data = this.getValueFromFormData(this.getInputName())
        if (data && data instanceof Array && data.some((item: any) => item instanceof File)) {
            delete data[index];
            let count = 0;
            data.forEach((file: any, index: any) => {
                count++;
            })
            if (count === 0) {
                data = ""
            }
            this.setValueToFormData(this.getInputName(), data)
        }
    }

    getUploadPreviewView(file: File, index: any) {
        return (
            <Grid item xs={this.props.gridSize} key={index}>
                <Card>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="100"
                            width="100"
                            image={URL.createObjectURL(file)}
                        />
                    </CardActionArea>
                    {this.state.isProcessing[index] ? <LinearProgress /> : ""}
                    <Box textAlign="center">
                        <IconButton color="secondary" component="span" title="Delete the resources" onClick={(event: any) => {this.deleteUploadedPreview(event, index)}}>
                            <DeleteIcon/>
                        </IconButton>
                    </Box>
                </Card>
            </Grid>
        )
    }

    getTitle(row: any){
        if (row && row.title){
            return <Box textAlign="center" p={1}><Typography>{row.title}</Typography></Box>
        }
        return ""
    }

    loadThumb(row: any, index: any) {
        let _this = this
        let url = window.appConfig.getBaseURL() + this.props.imgSrcMiddleUrl + row.id + "/" + row.name
        return (
            <Grid item xs={this.props.gridSize} key={index}>
                <Card>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="100"
                            width="100"
                            image={url}
                        />
                    </CardActionArea>
                    {this.getTitle(row)}
                    <Box textAlign="center">
                        {_this.props.enableEdit ? (
                            <IconButton color="secondary" component="span" title="Update meta information"
                                    onClick={(event: any) => {
                                        _this.setState({
                                            updateURL: _this.props.updateURL,
                                            detailsURL: _this.props.detailsURL + row.id
                                        })
                                        _this.openCloseUpdateDialog()
                                    }}>
                            <EditIcon/>
                        </IconButton>
                        ) : ""}
                        <IconButton color="secondary" component="span" title="Delete the resources"
                                    onClick={(event: any) => {
                                        this.delete(row.id)
                                    }}>
                            <DeleteIcon/>
                        </IconButton>
                    </Box>
                </Card>
            </Grid>
        )
    }

    loadPreview(files: any) {
        let _this = this;
        if (files) {
            let view: any = []
            files.forEach((file: any, index: any) => {
                view.push(_this.getUploadPreviewView(file, index))
            })
            return view
        }
        return ""
    }

    getInputName() {
        if (this.props.inputName) {
            return this.props.inputName
        }
        return ""
    }

    uploadFile(data: any, index: any) {
        const {uploadUrl} = this.props
        let _this = this;
        let progress = _this.state.isProcessing
        progress[index] = true
        _this.setState({
            isProcessing: progress
        })
        this.postFileToApi(uploadUrl, data,
            {
                callback(response: TRHTTResponse): void {
                    _this.deleteUploadedPreview(undefined, index)
                    delete _this.state.isProcessing[index]
                    _this.loadData()
                }
            },
            {
                callback(response: TRHTTResponse): void {
                    console.log("Error")
                    console.log(response)
                }
            }
        )
    }

    startUpload() {
        let _this = this;
        let name = this.getInputName()
        let files = this.state.formData[name]
        let {uploadParams} = this.props
        if (!uploadParams) {
            uploadParams = {}
        }
        if (files) {
            files.forEach((file: any, index: any) => {
                uploadParams.name = file
                _this.uploadFile(uploadParams, index)
            })
        }
    }

    delete(id: any) {
        let _this = this;
        this.deleteToApi(_this.props.deleteUrl + id,
            {
                callback(response: TRHTTResponse): void {
                    let apiResponse = ApiUtil.processApiResponse(response, _this);
                    if (apiResponse && apiResponse.status === AppConstant.STATUS_SUCCESS) {
                        _this.showSuccessFlash("Successfully Deleted");
                        _this.loadData();
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
    }

    public loadData() {
        const _this = this;
        this.getToApi(this.props.listUrl,
            {
                callback(response: TRHTTResponse): void {
                    let apiResponse = ApiUtil.processApiResponseAndShowError(response, _this);
                    let list = [];
                    if (apiResponse && apiResponse.data) {
                        list = apiResponse.data;
                    }
                    _this.setState({
                        list: list
                    });
                }
            },
            {
                callback(response: TRHTTResponse): void {
                    ApiUtil.processApiErrorResponse(response, _this);
                }
            }
        );
    }

    openCloseUpdateDialog(isOpen = true) {
        this.setState({isOpenEditPopup: isOpen})
    }

    renderUI() {
        let _this = this;
        let {title} = this.props
        let inputName = _this.getInputName()
        return (
            <React.Fragment>
                <TRDialog
                    isOpen={_this.state.isOpenEditPopup} maxWidth={DialogMaxWidth.LARGE}
                    children={
                        <ResourceEditView
                            route={_this.props.route}
                            title={_this.props.updateTitle}
                            updateButtonLabel={_this.props.uploadButtonLabel}
                            updateURL={_this.state.updateURL}
                            detailsURL={_this.state.detailsURL}
                            onClose={() => {_this.openCloseUpdateDialog(false)}}
                            parentComponent={_this}
                          />}
                />
                <Grid container spacing={1} justify="space-between" alignItems="center">
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">
                            <Box>{title}</Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={2} >
                        <IconButton color="primary" component="label" title="Upload resources">
                            <CloudUploadIcon/>
                            <input type="file" multiple hidden {...this.handleInputDataChange(inputName)} />
                        </IconButton>
                        {
                            _this.state.formData[inputName] && _this.state.formData[inputName] !== "" ? (
                                <IconButton color="primary" component="span" title="Upload resources"
                                            onClick={(event: any) => { _this.startUpload() }}>
                                    <SaveIcon/>
                                </IconButton>
                            ) : ""
                        }
                    </Grid>
                </Grid>
                <Divider/>
                <br/>
                <Grid container spacing={4}>
                    {_this.loadPreview(this.state.formData[inputName])}
                    {_this.state.list.map((row: any, index: any) => _this.loadThumb(row, index))}
                </Grid>
            </React.Fragment>
        )
    }

}