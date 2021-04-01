import TRLayoutInfoData from "tm-react/src/artifacts/data/view/tr-layout-info-data";
import React from "react";


const SomeView = React.lazy(() => import('./user-list-view'));


export default class TemplateUrlMapping {

    public static API = {
        LIST: "XXXXXXXX",
        CREATE: "XXXXXXXX",
        UPDATE: "XXXXXXXX",
        DELETE: "XXXXXXXX",
        DETAILS: "XXXXXXXX",
        ACTIVE_INACTIVE: "XXXXXXXX",
    };


    public static ui = {
        list: "XXXXXXXX",
        create: "XXXXXXXX",
        update: "XXXXXXXX",
        details: "XXXXXXXX",
    };

    public static privateUrlMappings(privateLayoutInfo: TRLayoutInfoData): TRLayoutInfoData {
        privateLayoutInfo.addPageInstance(this.ui.list, SomeView);
        return privateLayoutInfo;
    }

    public static publicUrlMappings(publicLayoutInfo: TRLayoutInfoData): TRLayoutInfoData {
        return publicLayoutInfo;
    }
}