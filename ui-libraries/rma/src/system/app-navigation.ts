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

    private static populateObjectToNav(navList: any, nav: TRListDataHelper, route: any, nested: boolean = false) {
        let _this = this;
        if (navList) {
            navList.forEach(function (value: any) {
                if (nested) {
                    if (value.url !== "") {
                        nav.addChild(value.name, value.displayName, value.icon, _this.setAction(route, value.url));
                    } else {
                        nav.addChild(value.name, value.displayName, value.icon);
                    }
                } else {
                    if (value.url !== "") {
                        nav.add(value.name, value.displayName, value.icon, _this.setAction(route, value.url));
                    } else {
                        nav.add(value.name, value.displayName, value.icon);
                    }
                }
                if (value.nested) {
                    _this.populateObjectToNav(value.nested, nav, route, true)
                    nav.addToParent()
                }
            });
        }
        return nav;
    }

    public static getNavigation(route: any): Array<TRListData> {
        let menuObj = TRBrowserStorageManager.getAsJSON("navList");
        let nav: TRListDataHelper = TRListDataHelper.start("dashboard", "Dashboard", "dashboard", this.setAction(route, "/dashboard"));
        this.populateObjectToNav(menuObj, nav, route)
        console.log(nav)
        return nav.getList();
    }
}