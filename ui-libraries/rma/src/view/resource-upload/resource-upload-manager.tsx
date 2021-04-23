import TRComponent from "tm-react/src/artifacts/component/tr-component";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import {
    Box,
    Button, Card, CardActionArea,
    CardActions,
    CardContent,
    CardHeader, CardMedia, DeleteIcon,
    Divider, EditIcon,
    Grid, IconButton, PhotoCameraIcon, TextField
} from "react-mui-ui/ui/ui-component";
import React from "react";


interface Props extends TRProps {
    route: any;
}

class State extends TRComponentState{}

export default class ResourceUploadManager extends TRComponent<Props, State> {

    state: State = new State();

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {

    }


    renderUI() {
        let _this = this;
        return (
            <React.Fragment>
                <Grid container spacing={1} justify="space-between" alignItems="center">
                    <Grid item xs={6}>
                        <CardHeader title="Upload"/>
                    </Grid>
                    <Grid item xs={1} >
                        <Button color="primary" variant="contained" component="label">
                            Upload
                            <input type="file" hidden {...this.handleInputDataChange("file")} />
                        </Button>
                    </Grid>
                </Grid>
                <Divider/>
                <CardContent>
                    <Grid  container spacing={4}>
                        <Grid item xs={3}>
                            <Card>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="120"
                                        width="120"
                                        image="https://imgd.aeplcdn.com/476x268/n/cw/ec/38904/mt-15-front-view.jpeg"
                                    />
                                </CardActionArea>
                                <Box textAlign="center">
                                    <IconButton color="primary" component="span">
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton color="secondary" component="span">
                                        <DeleteIcon/>
                                    </IconButton>
                                    <IconButton color="primary" component="span">
                                        <PhotoCameraIcon/>
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
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