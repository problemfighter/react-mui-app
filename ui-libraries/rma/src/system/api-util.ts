import SystemConfig from "./system-config";
import {AppConstant} from "./app-constant";
import TRHTTResponse from "tm-react/src/artifacts/processor/http/tr-http-response";
import {AppMessage} from "./app-message";
import TrLoadDataPrams from "../../../tm-react/src/artifacts/component/tr-load-data-prams";


export const ApiUtil = {

    getResponseData: (response: any) => {
        const {isSuccess, responseData} = response;
        if (responseData && isSuccess) {
            return responseData
        }
        return undefined
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

    processApiErrorResponse: (response: TRHTTResponse, component: any) => {
        if (!response) {
            component.showErrorFlash("Opps! something went wrong.");
        } else if (response && response.status === AppConstant.STATUS_ERROR && response.error.message) {
            component.showErrorFlash(response.error.message);
        } else {
            let message = AppMessage.unableToCommunicate;
            if (response.responseData && response.responseData.message) {
                let data = response.responseData.message;
                if (typeof data === 'string' || data instanceof String) {
                    message = response.responseData.message;
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

    processApiResponseAndShowError: (response: TRHTTResponse, component: any) => {
        let apiResponse = ApiUtil.processApiResponse(response, component);
        if (apiResponse.status === AppConstant.STATUS_ERROR && apiResponse.error && apiResponse.error.message) {
            component.showErrorFlash(apiResponse.error.message);
            return null;
        } else if (apiResponse.status === AppConstant.STATUS_ERROR && apiResponse.message) {
            component.showErrorFlash(apiResponse.message);
            return null;
        } else {
            return apiResponse;
        }
    },
    showErrorMessageOnApiDataProcess(responseData: any, component: any){
        if (responseData && responseData.status == AppConstant.STATUS_ERROR && responseData.message) {
            component.showErrorFlash(responseData.message)
        }
    },
    processApiResponseError: (responseData: any, component: any) => {
        if (responseData && responseData.status == AppConstant.STATUS_ERROR && responseData.error && responseData.error.length !== 0) {
            component.validateApiResponseData(responseData.error);
            ApiUtil.showErrorMessageOnApiDataProcess(responseData, component);
        } else {
            ApiUtil.showErrorMessageOnApiDataProcess(responseData, component);
        }
    },

    getSearchSortAndPaginationData: (parentState: any, dataParams: TrLoadDataPrams = new TrLoadDataPrams()) => {
        let state = parentState.state;
        if (dataParams.isReset) {
            ApiUtil.resetSearchAndPagination(parentState)
            return null
        }
        let sortAndPagination: { [key: string]: any } = {
            page: state.itemOffset,
            'per-page': state.maxItem,
            'sort-order': state.sortDirection,
            'sort-field': state.orderBy
        };
        if (state.search) {
            sortAndPagination["search"] = state.search;
        }
        return sortAndPagination;
    },

    resetSearchAndPagination: (component: any) => {
        component.state.queryCondition = {};
        component.state.pageOffset = 0;
        component.state.itemPerPage = SystemConfig.itemPerPage();
        component.state.itemOffset = 0;
        component.setState({search: null})
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
                        itemOffset: offset + 1,
                        pageOffset: offset
                    }, () => {
                        loadAgain();
                    });
                }
            },
        }
    }

};