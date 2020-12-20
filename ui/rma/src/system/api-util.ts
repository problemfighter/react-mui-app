import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import SystemConfig from "./system-config";
import {AppConstant} from "./app-constant";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import {AppMessage} from "./app-message";


export const ApiUtil = {

    getResponseData: (response: any) => {
        const {isSuccess, responseData} = response;
        if (responseData && isSuccess) {
            return responseData
        }
        return undefined
    },

    search(event: any, component: any, searchKey: string[]) {
        if (event.keyCode === AppConstant.pressEnter) {
            if (searchKey) {
                let search: { [key: string]: any } = {};
                searchKey.forEach((value) => {
                    search[value] = "%" + event.target.value + "%";
                });
                component.state.queryCondition["search"] = search;
            }
            if (component.loadData) {
                component.loadData();
            }
        }
    },

    makeGetRequestUrl: (baseUrl: string, ...queryParams: Array<{key: string, value: string}>) => {
        let url = baseUrl;

        if(queryParams) {
            url = url.concat("?", queryParams[0].key, "=", queryParams[0].value);
            queryParams.shift();
        }

        queryParams.forEach((item: {key: string, value: string})=>{
            url = url.concat("&",item.key,"=",item.value)
        });

        return url;
    },

    processApiResponse: (response: TRHTTResponse, component: any) =>{
        if (!response.isSuccess || !response.responseData) {
            let message = AppMessage.unableToCommunicate;
            if (response.responseData.message){
                message = response.responseData.message;
            }
            component.showErrorFlash(message);
        } else {
            return response.responseData;
        }
    },

    processApiErrorResponse: (response: TRHTTResponse, component: any) =>{
        if (response.status === AppConstant.STATUS_ERROR && response.error.message) {
            component.showErrorFlash(response.error.message.text);
        } else {
            let message = AppMessage.unableToCommunicate;
            if (response.responseData.message.text){
                let data = response.responseData.message.text;
                if (typeof data === 'string' || data instanceof String){
                    message = response.responseData.message.text;
                }
            }
            component.showErrorFlash(message);
        }
    },

    getParamsDataFromRouter(router: any, key: string) {
        if (router && router.match && router.match.params && router.match.params[key]){
            return router.match.params[key]
        }
        return null
    },

    isEmptyObject(obj: object): boolean {
        return Object.keys(obj).length === 0
    },

    processApiResponseAndShowError: (response: TRHTTResponse, component: any) =>{
        let apiResponse = ApiUtil.processApiResponse(response, component);
        if (apiResponse.status === AppConstant.STATUS_ERROR && apiResponse.error && apiResponse.error.message){
            component.showErrorFlash(apiResponse.error.message.text);
            return null;
        }else{
            return apiResponse;
        }
    },
    showErrorMessageOnApiDataProcess(responseData: any, component: any){
        if (responseData && responseData.status == AppConstant.STATUS_ERROR &&
            responseData.error && responseData.error.message) {
            component.showErrorFlash(responseData.error.message.text)
        }
    },
    processApiResponseError: (responseData: any, component: any) => {
        if (responseData && responseData.status == AppConstant.STATUS_ERROR &&
            responseData.error && responseData.error.fields && responseData.error.fields.length !== 0) {
            component.validateApiResponseData(responseData.error.fields);
            ApiUtil.showErrorMessageOnApiDataProcess(responseData, component);
        } else {
            ApiUtil.showErrorMessageOnApiDataProcess(responseData, component);
        }
    },

    sortAndPagination: (field: string, order: string) =>{
        let sort: { [key: string]: any } = {};
        if (field && order) {
            sort =  {
                order: {[field] : order}
            };
        }
        return sort;
    },
    getSortAndPaginationData: (state: TRComponentState) => {
        let sortAndPagination: { [key: string]: any } = {
            offset: state.itemOffset,
            max: state.maxItem,
            where: ApiUtil.sortAndPagination(state.orderBy, state.sortDirection)
        };
        if (state.queryCondition["search"]){
            sortAndPagination["where"]["or"] = {};
            sortAndPagination["where"]["or"]["like"] = state.queryCondition["search"]
        }
        return sortAndPagination;
    },

    resetSearchAndPagination: (component: any) => {
        component.state.queryCondition = {};
        component.state.pageOffset = 0;
        component.state.itemPerPage = SystemConfig.itemPerPage();
        component.state.itemOffset = 0;
    },

    paginationManager(component: any, loadAgain: any) {
        return {
            itemPerPage: component.state.maxItem,
            page: component.state.pageOffset,
            total: component.state.totalItem,
            itemPerPageDropdown: SystemConfig.itemPerPageDropdown(),
            trPaginationAction: {
                onChangeItemPerPage(event: any): void {
                    ApiUtil.resetSearchAndPagination(component);
                    component.setState(
                        {
                            maxItem: event.target.value,
                        }, () => {
                            loadAgain();
                        });
                },
                nextPrevious(event: any, offset: number): void {
                    component.setState({
                        itemOffset: component.state.maxItem * offset,
                        pageOffset: offset
                    }, () => {
                        loadAgain();
                    });
                }
            },
        }
    }

};