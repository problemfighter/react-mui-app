import React from 'react';
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import TRComponent from "tm-react/src/artifacts/component/tr-component";
import {Button, ButtonGroup, ExpandMoreIcon} from "react-mui-ui/ui/ui-component";
import TRDropdown, {DropdownStyle} from "react-mui-ui/ui/tr-dropdown";
import {TRDropdownDataHelper} from "react-mui-ui/ui/tr-ui-data";
import {TrUtil} from "tm-react/src/artifacts/util/tr-util";
import TRBrowserStorageManager from "tm-react/src/artifacts/manager/tr-browser-storage-manager";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import {ApiUtil} from "../../system/api-util";
import {ApiUrl} from "../../system/api-url";


class State extends TRComponentState {}

interface Props extends TRProps {
    route: any
    appConfig: any
    dropdownStyle?: DropdownStyle
}



export default class ProfileDropdown extends TRComponent<Props, State> {


    logoutAction(event: any) {
        const _this = this;
        _this.getToApi(ApiUtil.makeGetRequestUrl(ApiUrl.LOGOUT_URL, {
                key: "token",
                value: TRBrowserStorageManager.getByKey("refreshToken")
            }),
            {
                callback(response: TRHTTResponse): void {
                    const responseData = ApiUtil.getResponseData(response);
                    TRBrowserStorageManager.clear();
                    TrUtil.gotoUrl(_this, "/");
                }
            },
            {
                callback(response: TRHTTResponse): void {
                    TRBrowserStorageManager.clear();
                    TrUtil.gotoUrl(_this, "/");
                }
            }
        );
    }

    profile(event: any) {

    }

    changePassword(event: any) {

    }

    render() {
        const _this = this;
        const dropdownAction = new TRDropdownDataHelper();
        dropdownAction.add("profile", "Profile" , {
            click(event: any, onClickData: any): void {
                _this.profile(event);
            }
        });
        dropdownAction.add("changePassword", "Change Password", {
            click(event: any, onClickData: any): void {
                _this.changePassword(event);
            }
        });
        dropdownAction.add("logout", "Logout", {
            click(event: any, onClickData: any): void {
                _this.logoutAction(event);
            }
        });

        const dropDownStyle: DropdownStyle = {
            popper: {
                style: {
                    zIndex: 1201,
                    marginTop: 3
                }
            }
        };

        return (
            <React.Fragment>
                <ButtonGroup variant="contained" color="primary" style={{zIndex:1500}}>
                    <Button>{TRBrowserStorageManager.getByKey("operatorName")}</Button>
                    <TRDropdown dropdownStyle={dropDownStyle} clickIcon={ExpandMoreIcon} actions={dropdownAction.getList()}/>
                </ButtonGroup>
            </React.Fragment>
        );
    }
}