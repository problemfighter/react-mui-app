import React from 'react';
import TRLayoutInfoData from "tm-react/src/artifacts/data/view/tr-layout-info-data";
import TRURLMapping from "tm-react/src/artifacts/config/tr-url-mapping";
import PublicLayout from "../view/layouts/public-layout";
import PrivateLayout from "../view/layouts/private-layout";
import UserUrlMapping from "../view/user/user-url-mapping";



const LoginView = React.lazy(() => import('../view/authentication/login-view'));
const ForgotPasswordView = React.lazy(() => import('../view/authentication/forgot-password-view'));
const Dashboard = React.lazy(() => import('../view/dashboard/dashboard'));
const Component = React.lazy(() => import('react-mui-ui/ui/tr-ui-demo'));


export default class URLMapping extends TRURLMapping {


    public getPublicLayouts() : TRLayoutInfoData{
        let publicLayoutInfo: TRLayoutInfoData = new TRLayoutInfoData();
        publicLayoutInfo.layout = PublicLayout;
        publicLayoutInfo.addPageInstance("/", LoginView);
        publicLayoutInfo.addPageInstance("/forgot-password", ForgotPasswordView);
        publicLayoutInfo.addPageInstance("/component", Component);
        return publicLayoutInfo;
    }

    public getPrivateLayouts() : TRLayoutInfoData{
        let privateLayoutInfo: TRLayoutInfoData = new TRLayoutInfoData();
        privateLayoutInfo = new TRLayoutInfoData();
        privateLayoutInfo.layout = PrivateLayout;
        privateLayoutInfo.addPageInstance("/dashboard", Dashboard);
        privateLayoutInfo = UserUrlMapping.privateUrlMappings(privateLayoutInfo);
        return privateLayoutInfo;
    }

    public getLayoutsAndPages(): Array<TRLayoutInfoData> {
        let pageWithLayout: Array<TRLayoutInfoData> = [];
        pageWithLayout.push(this.getPublicLayouts());
        pageWithLayout.push(this.getPrivateLayouts());
        return pageWithLayout
    }

}