import TRComponent from "tm-react/src/artifacts/component/tr-component";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import {
    Box,
    Button, Card, CardActionArea,
    CardActions,
    CardContent,
    CardHeader, CardMedia, CloudUploadIcon, DeleteIcon,
    Divider, EditIcon,
    Grid, IconButton, PhotoCameraIcon, TextField
} from "react-mui-ui/ui/ui-component";
import React from "react";


interface Props extends TRProps {
    route: any;
    title?: string
    uploadButtonLabel?: string
    inputName?: string
    gridSize?: bigint
}

class State extends TRComponentState{}

export default class ResourceUploadManager extends TRComponent<Props, State> {

    static defaultProps = {
        title: "Resources",
        uploadButtonLabel: "Upload",
        gridSize: 3,
        inputName: "file",
    };

    state: State = new State();

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {

    }

    loadThumb(file: File, index: any) {
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
        if (data && data instanceof Array && data.length !== 0 && data[0] instanceof File) {
            data.splice(index, 1);
            this.setValueToFormData(this.getInputName(), data)
        }
    }

    getUploadPreviewView(file: File, index: any) {
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
                        <IconButton color="secondary" component="span" title="Delete the resources" onClick={(event: any) => {this.deleteUploadedPreview(event, index)}}>
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

    renderUI() {
        let _this = this;
        let {title, uploadButtonLabel, inputName} = this.props
        inputName = _this.getInputName()
        return (
            <React.Fragment>
                <Grid container spacing={1} justify="space-between" alignItems="center">
                    <Grid item xs={6}>
                        <CardHeader title={title}/>
                    </Grid>
                    <Grid item xs={1} >
                        <Button color="primary" variant="contained" component="label">
                            {uploadButtonLabel}
                            <input type={inputName} multiple hidden {...this.handleInputDataChange(inputName)} />
                        </Button>
                    </Grid>
                </Grid>
                <Divider/>
                <CardContent>
                    <Grid  container spacing={4}>
                        { _this.loadPreview(this.state.formData[inputName])}
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container spacing={1} justify="flex-end">
                        <Grid item xs={1}>
                            <Button color="secondary" size="small" fullWidth variant="contained" children="close"/>
                        </Grid>
                    </Grid>
                </CardActions>
            </React.Fragment>
        )
    }

}