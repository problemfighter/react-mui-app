import React from "react";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import TRComponent from "tm-react/src/artifacts/component/tr-component";
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    Divider,
    Grid,
    Table,
    TableBody
} from "react-mui-ui/ui/ui-component";
import KeyValueTableRow from "bl-ui-common/src/view/common/key-value-table-row";
import {TrUtil} from "tm-react/src/artifacts/util/tr-util";
import {ApiUtil} from "react-material-app/src/system/api-util";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import {AppConstant} from "react-material-app/src/system/app-constant";
import ProductUrlMapping from "./product-url-mapping";

interface Props extends TRProps {
    route: any;
    classes?: any;
}

class State extends TRComponentState{
    listURL: string = ProductUrlMapping.ui.list;
    editURL: string = ProductUrlMapping.ui.create;
    name: string = "Product Details";
    loadDataFromAPI: string = ProductUrlMapping.API.DETAILS;
}

export default  class ProductDetailsView extends TRComponent<Props, State> {

    state: State = new State();

    componentDidMount() {
        this.showRedirectMessage();
        let uuid = ApiUtil.getParamsDataFromRouter(this.props.route, "uuid");
        if (uuid) {
            this.state.editURL += "/" + uuid;
            this.loadFormData(uuid);
        } else {
            this.failedRedirect(this.state.listURL, "Invalid Data");
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
        this.postJsonToApi(_this.state.loadDataFromAPI, filter,
            {
                callback(response: TRHTTResponse): void {
                    let apiResponse = ApiUtil.processApiResponseAndShowError(response, _this);
                    if (apiResponse && apiResponse.status === AppConstant.STATUS_SUCCESS && !ApiUtil.isEmptyObject(apiResponse.data)) {
                        let data = apiResponse.data;
                        _this.setState({formData: data})
                    } else {
                        _this.failedRedirect(_this.state.listURL, message);
                    }
                }
            },
            {
                callback(response: TRHTTResponse): void {
                    _this.failedRedirect(_this.state.listURL, message);
                }
            }
        );
    }


    renderUI() {
        let _this = this;
        return (
            <React.Fragment>
                <Card>
                    <Divider/>
                    <CardActions>
                        <div style={{ width: '100%' }}>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Box flexGrow={1} fontSize={16} fontWeight="fontWeightBold" pl={5}>
                                    {_this.state.name}
                                </Box>
                                <ButtonGroup variant="contained">
                                    <Button onClick={(event:any) => {
                                        TrUtil.gotoUrl(_this, _this.state.editURL)
                                    }}>Edit</Button>
                                    <Button color="primary" onClick={(event:any) => {TrUtil.gotoUrl(_this, _this.state.listURL)}}>Back</Button>
                                </ButtonGroup>
                            </Box>
                        </div>
                    </CardActions>
                    <Divider/>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <Table>
                                    <TableBody>
                                        <KeyValueTableRow name="Name" value={this.state.formData.name}/>
                                        <KeyValueTableRow name="Price" value={this.state.formData.price}/>
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Grid container spacing={1}  justify="flex-end">
                            <Grid  item xs={1}>
                                <Button size="small" color="primary" onClick={(event:any) => {TrUtil.gotoUrl(_this, _this.state.listURL)}} fullWidth variant="contained" children="back"/>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>
            </React.Fragment>
        )
    }
}