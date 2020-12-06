import React from 'react';
import TRReactComponent from "tm-react/src/artifacts/framework/tr-react-component";
import TRLayoutRenderer from "tm-react/src/artifacts/component/tr-layout-rander";
import {withStyles} from "react-mui-ui/ui/ui-component";
import {privateLayoutJSS} from "react-material-app/src/assets/style-jss";
import {AppConstant} from "../../system/app-constant";
import AppNavigation from "../../system/app-navigation";
import NavigationBar from "../nav/navigation-bar";
import TRBrowserStorageManager from "tm-react/src/artifacts/manager/tr-browser-storage-manager";
import {Redirect} from "react-router";
import {AppMessage} from "../../system/app-message";

class PrivateLayout extends TRReactComponent<any, any> {

    render() {
        const {component, route, appConfig, classes} = this.props;
        let renderView = (
            <NavigationBar
                route={route}
                appConfig={appConfig}
                itemList={AppNavigation.getNavigation(route)}
                appTitle={AppMessage.appName}
                bodyContent={<TRLayoutRenderer route={route} appConfig={appConfig} component={component}/>}/>
            );

        if (!Boolean(TRBrowserStorageManager.getByKey("isAuthorized"))) {
            renderView = (<Redirect to="/" />);
        }

        return (
            <React.Fragment>
                {renderView}
            </React.Fragment>
        );
    }

}

export default withStyles(privateLayoutJSS)(PrivateLayout);