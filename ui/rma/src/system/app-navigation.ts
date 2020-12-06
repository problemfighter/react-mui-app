import {TRListData, TRListDataHelper} from "react-mui-ui/ui/tr-ui-data";
import TRBrowserStorageManager from "tm-react/src/artifacts/manager/tr-browser-storage-manager";

export default class AppNavigation {


    private static setAction(route: any, url: string) {
        return {
            click(event: any, onClickData: any): void {
                route.history.push(url);
            }
        }
    }

    public static getNavigation(route: any): Array<TRListData> {
        let menuObj = TRBrowserStorageManager.getAsJSON("navList");
        let nav: TRListDataHelper = TRListDataHelper.start("dashboard", "Dashboard", "dashboard", this.setAction(route, "/dashboard"));
        let _this = this;
        if (menuObj){
            menuObj.forEach(function (value: any) {
                if (value.url !== ""){
                    nav.add(value.name, value.displayName, value.icon, _this.setAction(route, value.url));
                }else{
                    nav.add(value.name, value.displayName, value.icon);
                }
            });
        }
        return nav.getList();
    }
}