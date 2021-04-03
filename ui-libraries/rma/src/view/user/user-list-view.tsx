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
    Typography,
    withStyles
} from "react-mui-ui/ui/ui-component";
import {viewCommon} from "react-material-app/src/assets/style-jss";
import TRTableHeader, {SortDirection} from "react-mui-ui/ui/tr-table-header";
import {Align, TRTableActionData, TRTableActionDataHelper, TRTableHeaderDataHelper} from "react-mui-ui/ui/tr-ui-data";
import {TrUtil} from "tm-react/src/artifacts/util/tr-util";
import TRPagination from "react-mui-ui/ui/tr-pagination";
import {ApiUtil} from "../../system/api-util";
import SystemConfig from "../../system/system-config";
import CaTableAction from "../../override/ca-table-action";
import UserUrlMapping from "./user-url-mapping";


interface Props extends TRProps {
    route: any;
    classes: any;
}

const tableHeaderDefinition = TRTableHeaderDataHelper.init("First Name", "firstName", true, "First Name", Align.left);
tableHeaderDefinition.add( "Last Name", "lastName", true, "Last Name", Align.left);
tableHeaderDefinition.add( "Email", "email", true, "Email Address", Align.left);



class UserListViewState extends TRComponentState {
    apiData: any;
    list: any = [];
}

class UserListView extends TRComponent<Props, UserListViewState> {

    state: UserListViewState = new UserListViewState().setMaxItem(SystemConfig.itemPerPage());

    componentDidMount() {
        this.showRedirectMessage();
        this.loadData();
    }

    public loadData(data: object = {}) {
        const _this = this;
        // this.postJsonToApi(UserUrlMapping.API.LIST, ApiUtil.getSortAndPaginationData(this.state),
        //     {
        //         callback(response: TRHTTResponse): void {
        //             let apiResponse = ApiUtil.processApiResponseAndShowError(response, _this);
        //             let list = [];
        //             if (apiResponse && apiResponse.data) {
        //                 list = apiResponse.data;
        //             }
        //
        //             let totalItem = 0;
        //             if (apiResponse && apiResponse.pagination && apiResponse.pagination.total) {
        //                 totalItem = apiResponse.pagination.total;
        //             }
        //             _this.setState({
        //                 list: list,
        //                 totalItem: totalItem,
        //                 apiData: apiResponse
        //             });
        //         }
        //     },
        //     {
        //         callback(response: TRHTTResponse): void {
        //             ApiUtil.processApiErrorResponse(response, _this);
        //         }
        //     }
        // );
    }

    tableActions(component: any, rowData: any): Map<string, TRTableActionData> {
        let tableAction: TRTableActionDataHelper = TRTableActionDataHelper.start("Details", "");
        tableAction.addAction("Edit").setCallbackData(rowData).setAction({
            click(event: any, onClickData: any): void {
                component.redirectWithData(UserUrlMapping.ui.create + "/" + onClickData.uuid, {})
            }
        });

        tableAction.addAction("Reset Password").setCallbackData(rowData).setAction({
            click(event: any, onClickData: any): void {
                component.redirect(UserUrlMapping.ui.resetPassword)
            }
        });

        tableAction.addAction("Active").setCallbackData(rowData).setAction({
            click(event: any, onClickData: any): void {
                component.redirect(UserUrlMapping.ui.resetPassword)
            }
        }).addConfirmation();

        tableAction.addAction("Delete").setCallbackData(rowData).setAction({
            click(event: any, onClickData: any): void {
                component.redirect(UserUrlMapping.ui.resetPassword)
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
                        <Typography variant="h5">Users</Typography>
                    </div>
                    <div>
                        <div className={classes.displayInline}>
                            {/*<TextField placeholder="search" name="search" onKeyUp={(event: any)=>{ApiUtil.search(event, _this, ["firstName", "lastName", "email"])}}/>*/}
                        </div>
                        <Button className={classes.marginToLeft}  variant="contained" color="primary" onClick={(event:any) => {TrUtil.gotoUrl(_this, "/user/registration")}}>Create</Button>
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
                            {this.state.list.map((row: any, index: any) => (
                                <TableRow key={index}>
                                    <TableCell align="left">{row.firstName}</TableCell>
                                    <TableCell align="left">{row.lastName}</TableCell>
                                    <TableCell align="left">{row.email}</TableCell>
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

export default withStyles(viewCommon)(UserListView);