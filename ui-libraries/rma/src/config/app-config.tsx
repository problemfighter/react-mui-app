import React from 'react';
import TRAppConfig from "tm-react/src/artifacts/config/tr-app-config";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import AppBeforeRenderUIView from "../view/common/app-before-render-ui-view";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import AppSuspenseLoader from "../view/common/app-suspense-loader";
import TRHTTAuthCallback from "tm-react/src/artifacts/processor/http/tr-http-auth-callback";
import TRHTTRequest from "tm-react/src/artifacts/processor/http/tr-http-request";
import AuthenticationService from "../service/authentication-service";
import {TRHTTPCall} from "tm-react/src/artifacts/model/tr-model";


export default class AppConfig extends TRAppConfig {

    public getSuspenseLoader() {
        return (<AppSuspenseLoader/>)
    }

    public getBeforeRenderUIView(componentState: TRComponentState, component: any) {
        return (<AppBeforeRenderUIView componentState={componentState} component={component} />)
    }


    public getBaseURL(): string {
        return "http://localhost:3000/";
    }

    public getStaticBaseURL(): string {
        return "static/";
    }

    public isAuthorized (response?: TRHTTResponse): boolean {
        if (response && response.httpCode === 401){
            return false
        }
        return true;
    }

    public authCallback(): TRHTTAuthCallback | undefined{
        let authCallback: TRHTTAuthCallback = {
            process(request: TRHTTRequest): TRHTTRequest {
                return AuthenticationService.instance().processAuth(request);
            }
        };
        return authCallback;
    }

    public renewAuthorization (trHttpCall: TRHTTPCall): void {
        let authService = new AuthenticationService();
        authService.renewAuthorization(trHttpCall);
    }
}