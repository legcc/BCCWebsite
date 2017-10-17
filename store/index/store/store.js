import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    //store/index.vue
    educatorProductList: [],
    learnerProductList: [],
    //store/orderInfo.vue
    countryAddressData: [],
    shopOrderData: [],
    orderDetailData: [],
    orderData: [],
    addressData: [],
    //store/shoppingCart
    shoppingCartData: [],
    //store/productDetail
    itemData: [],
    commentData: []
    
});
export const mutations = {
    //store/index.vue
    GET_PRODUCT_LIST(state, data){
        state.educatorProductList = data.educator_list;
        state.learnerProductList = data.learner_list;
    },
    //store/orderInfo.vue
    COUNTRY_ADDRESS_DATA(state, data){
        state.countryAddressData = data;
    },
    GET_SHOP_ORDER_DATA(state, data){
        state.shopOrderData = data;
    },
    GET_ORDER_DETAIL_DATA(state, data){
        state.orderDetailData = data;
    },
    GET_ORDER_DATA(state, data){
        state.orderData = data;
    },
    GET_ADDRESS_DATA(state, data){
        state.addressData = data;
    },
    //store/shoppingCart
    GET_SHOPPING_CART_DATA(state, data){
        state.shoppingCartData = data;
    },
    //store/productDetail
    GET_ITEM_DATA(state, data){
        state.itemData = data;
    },
    GET_COMMENT_DATA(state, data){
        state.commentData = data;
    }
};

export const actions = {
    //store/index.vue
    async getProductList({commit, rootState}){
        let res = await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/store/getItemList", []));
        commit("GET_PRODUCT_LIST", res.data.data)
    },
    //store/orderInfo.vue
    async countryAddressData({state, commit, rootState}){
        try {
            commit("COUNTRY_ADDRESS_DATA", (await axios.get(HTTP_PATH + "/api/getCountryAddress")).data.data);
        } catch (e) {
            console.error(e);
        }
    },
    async getShopOrderData({state, commit, rootState}, paramData){
        try {
            commit("GET_SHOP_ORDER_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/store/getConfirmShopInfo", 
                ['itemId', 'itemNum'], paramData))).data.data);
        } catch (e) {
            console.error(e);
        }
    },
    async getOrderDetailData({state, commit, rootState}, paramData){
        try {
            commit("GET_ORDER_DETAIL_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/order/getOrderDetail", 
                ['uid', 'orderId'], {uid: rootState.authUser.uid, ...paramData}))).data.data);
        } catch (e) {
            console.error(e);
        }
    },
    async getOrderData({state, commit, rootState}, paramData){
        try {
            commit("GET_ORDER_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/store/getConfirmCartInfo", [
                'uid', 'cartIds'], {uid: rootState.authUser.uid, ...paramData}))).data.data);
        } catch (e) {
            console.error(e);
        }
    },
    async getAddressData({state, commit, rootState}){
        try {
            commit("GET_ADDRESS_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/getCountryCity"))).data.data);
        } catch (e) {
            console.error(e);
        }
    },
    async searchAddress({state, commit}, selectArr){
        try {
            if (selectArr.length === 1) {
                state.addressData.forEach(async (item) => {
                    if (item.id === selectArr[0] && !item.children.length) {
                        //    当改项的children为0时
                        (async () => {
                            item.children = (await utils.sendAxiosGet('/api/getCountryCity', ['pid'], {pid: selectArr[0]})).data.data;
                            item.children.forEach(item => {
                                item.children = [];
                            });
                        })();

                    }
                })
            } else if (selectArr.length === 2) {
                state.addressData.forEach((item) => {
                    if (item.id === selectArr[0] && item.children.length) {
                        //当改项的children不为0时
                        item.children.forEach(async (child) => {
                            if (child.id === selectArr[1] && !child.children.length) {
                                child.children = (await utils.sendAxiosGet('/api/getCountryCity', ['pid'], {pid: selectArr[1]})).data.data;
                            }
                        })

                    }
                })
            }
        } catch (e) {
            console.error(e);
        }
    },
    //store/shoppingCart
    async getShoppingCartData({state, commit, rootState}, paramsData){
        try {
            commit("GET_SHOPPING_CART_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/store/getMyCart", 
                ['uid', 'session_id'], {uid: rootState.authUser.uid, ...paramsData}))).data.data);
        } catch (e) {
            console.error(e);
        }
    },
    //store/productDetail
    async getItemData({state, commit, rootState}, params){
        try {
            commit("GET_ITEM_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/store/getItemDetail", 
                ['itemId'], params))).data.data)
        } catch (e) {
            console.error(e);
        }
    },
    async getCommentData({state, commit, rootState}, params){
        try {
            commit("GET_COMMENT_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/store/getItemComment", 
                ['itemId'], params))).data.data)
        } catch (e) {
            console.error(e);
        }
    },
    async addToCart({state, commit, rootState}, params){
        try {
            commit("CART_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/store/addToCart",
                ['uid', 'itemId', 'itemNum'],
                {uid: rootState.authUser.uid, ...param}))).data.data)
        } catch (e) {
            console.error(e);
        }
    }
}