import TRBrowserStorageManager from "tm-react/src/artifacts/manager/tr-browser-storage-manager";
import TRHTTRequest from "tm-react/src/artifacts/processor/http/tr-http-request";
import {TrUtil} from "tm-react/src/artifacts/util/tr-util";
import {TRHTTPCall} from "tm-react/src/artifacts/model/tr-model";
import {ApiUrl} from "../system/api-url";
import TRHTTCallback from "tm-react/src/artifacts/processor/http/tr-http-callback";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import {ApiUtil} from "../system/api-util";

export default class AuthenticationService {


    public processAuth(request: TRHTTRequest): TRHTTRequest {
        let accessToken = TRBrowserStorageManager.getByKey("accessToken");
        if(accessToken){
            request.headers = TrUtil.addDataToObject(request.headers, "Authorization", "Bearer " + accessToken);
        }
        return request;
    }


    public addAuthorizationMetaData(data: any): boolean {
        let responseData = data.login;
        let accessToken = responseData.accessToken;
        let refreshToken = responseData.refreshToken;

        let access = data.access;
        let navList = data.navList;
        if (access) {
            TRBrowserStorageManager.addAsJSONString("access", access);
        }

        if (navList) {
            TRBrowserStorageManager.addAsJSONString("navList", navList);
        }

        if (accessToken && refreshToken) {
            TRBrowserStorageManager.add("accessToken", accessToken);
            TRBrowserStorageManager.add("refreshToken", refreshToken);
            return true;
        }
        return false;
    }

    public processLoginToken(responseData: any): boolean {
        if (this.addAuthorizationMetaData(responseData)) {
            TRBrowserStorageManager.add("isAuthorized", true);
            let user = responseData.user;
            let name = user.firstName;
            if (user.lastName) {
                name += " " + user.lastName
            }
            TRBrowserStorageManager.add("operatorName", name);
            TRBrowserStorageManager.add("operatorId", user.id);
            TRBrowserStorageManager.addAsJSONString("apiData", responseData);
            return true;
        }
        return false;
    }

    public renewAuthorization (trHttpCall: TRHTTPCall): void {
        const  component = trHttpCall.getComponent();
        let request: TRHTTRequest = component.httpRequestData(ApiUrl.RENEW_TOKEN_URL);
        request.requestData = {
            refreshToken: TRBrowserStorageManager.getByKey("refreshToken")
        };
        let callback: TRHTTCallback = {
            before: (response: TRHTTResponse) => {
                component.showProgress();
            },
            success: (response: TRHTTResponse) => {
                const responseData = ApiUtil.getResponseData(response);
                if (responseData && responseData.status !== "error" && this.addAuthorizationMetaData(responseData.data)) {
                    trHttpCall.resume();
                }else{
                    TrUtil.redirectTo( "/");
                    component.showLoginUI();
                }
            },
            failed: (response: TRHTTResponse) => {
                let message = "Unable to process request when trying to renew session";
                if (response.message){
                    message = response.message
                }
                component.showErrorFlash(message);
            },
            finally: () => {}
        };
        component.httpCaller().postJSON(request, callback);
    }


    public static instance() {
        return new AuthenticationService();
    }
}