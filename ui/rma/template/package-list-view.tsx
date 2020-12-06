import React from 'react';
import TRComponent from "tm-react/src/artifacts/component/tr-component";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography, withStyles,
} from "react-mui-ui/ui/ui-component";
import TRTableHeader from "react-mui-ui/ui/tr-table-header";
import {Align, TRTableActionData, TRTableActionDataHelper, TRTableHeaderDataHelper} from "react-mui-ui/ui/tr-ui-data";
import {TrUtil} from "tm-react/src/artifacts/util/tr-util";
import TRPagination from "react-mui-ui/ui/tr-pagination";
import {ApiUtil} from "react-material-app/src/system/api-util";
import SystemConfig from "react-material-app/src/system/system-config";
import PackageUrlMapping from "./package-url-mapping";
import {viewCommon} from "bl-ui-crm/src/assets/style-jss";
import CaTableAction from "react-material-app/src/override/ca-table-action";
import {AppConstant} from "react-material-app/src/system/app-constant";



interface Props extends TRProps {
    route: any;
    classes: any;
    name: string;
    listViewData: { [key: string]: any };
}

const tableHeaderDefinition = TRTableHeaderDataHelper.init("Name", "name", true, "Name", Align.left);
tableHeaderDefinition.add( "Price", "price", true, "Price", Align.left);



class State extends TRComponentState {
    apiData: any;
    list: any = [];
}


class PackageListView extends TRComponent<Props, State> {

    state: State = new State().setMaxItem(SystemConfig.itemPerPage());

    componentDidMount() {
        this.showRedirectMessage();
        this.loadData();
    }

    public loadData(data: object = {}) {
        const _this = this;
        let commonConditions = ApiUtil.getSortAndPaginationData(this.state);
        this.postJsonToApi(PackageUrlMapping.API.LIST,  commonConditions,
            {
                callback(response: TRHTTResponse): void {
                    let apiResponse = ApiUtil.processApiResponseAndShowError(response, _this);
                    let list = [];
                    if (apiResponse && apiResponse.data) {
                        list = apiResponse.data;
                    }

                    let totalItem = 0;
                    if (apiResponse && apiResponse.pagination && apiResponse.pagination.total) {
                        totalItem = apiResponse.pagination.total;
                    }
                    _this.setState({
                        list: list,
                        totalItem: totalItem,
                        apiData: apiResponse
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

    delete(uuid: string){
        let _this = this;
        let commonConditions = {
            where: {
                equal: {
                    uuid :  uuid
                }
            }
        };
        this.deleteJsonToApi(PackageUrlMapping.API.DELETE,  commonConditions,
            {
                callback(response: TRHTTResponse): void {
                    let apiResponse = ApiUtil.processApiResponse(response, _this);
                    if (apiResponse && apiResponse.status === AppConstant.STATUS_SUCCESS) {
                        _this.showSuccessFlash("Successfully Deleted!");
                        _this.loadData();
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


    tableActions(component: any, rowData: any): Map<string, TRTableActionData> {
        let tableAction: TRTableActionDataHelper = TRTableActionDataHelper.start("Details", "");
        tableAction.addAction("Edit").setCallbackData(rowData).setAction({
            click(event: any, onClickData: any): void {
                component.redirectWithData(PackageUrlMapping.ui.create + "/" + onClickData.uuid, {})
            }
        });

        tableAction.addAction("Delete").setCallbackData(rowData).setAction({
            click(event: any, onClickData: any): void {
                component.delete(onClickData.uuid)
            }
        }).addConfirmation();

        return tableAction.getMap()
    }

    renderUI() {
        const {classes} = this.props;
        const _this = this;
        return (
            <React.Fragment>
                <Paper className={classes.mainActionArea}>
                    <div>
                        <Typography variant="h5">Packages</Typography>
                    </div>
                    <div>
                        <div className={classes.displayInline}>
                            <TextField placeholder="search" name="search" onKeyUp={(event: any)=>{ApiUtil.search(event, _this, ["firstName", "lastName"])}}/>
                        </div>
                        <Button className={classes.marginToLeft}  variant="contained" color="primary" onClick={(event:any) => {TrUtil.gotoUrl(_this, PackageUrlMapping.ui.create)}}>Create</Button>
                        <Button className={classes.marginToLeft}  variant="contained" color="primary" onClick={(event:any) => {this.loadData()}} >Reload</Button>
                    </div>
                </Paper>
                <Paper>
                    <Table>
                        <TRTableHeader
                            clickForSortFunction={{click(event: any, onClickData: any): void {_this.sortItemAction(event, onClickData, () => {_this.loadData()})}}}
                            actionColumnAlign={Align.right}
                            headers={tableHeaderDefinition.getHeaders()}
                            orderBy={this.state.orderBy}
                            sortDirection={this.state.sortDirection}/>
                        <TableBody>
                            {this.state.list.map((row: any, index:any) => (
                                <TableRow key={index} hover tabIndex={-1}>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">{row.price}</TableCell>
                                    <TableCell align="right">
                                        <CaTableAction actions={this.tableActions(_this, row)}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TRPagination {...ApiUtil.paginationManager(this, ()=>{_this.loadData()})}/>
                </Paper>
            </React.Fragment>);
    }
}
export default withStyles(viewCommon)(PackageListView);