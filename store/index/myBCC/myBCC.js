import axios from 'axios';
import utils from '~/plugins/utils';
import HTTP_PATH from '~/static/server.config';

//My BCC模块数据源
export const state = () => ({
    //myBCC.vue
    curActiveEntry: 0,
    currentPath: [],
    levelOptions: [],
    //userSetting.vue
    currentAuthUser: {},
    userSettingOptions: {
        motivationOptions: [],
        learnYearOptions: []
    },
    addressOptions: [],
    //order.vue
    orderStatusOptions: [],
    orderTableData: [],
    orderDetail: [],
    //message.vue
    messageStatusOptions: [],
    messageTableData: [],
    messageDetail: null,
    //resource.vue
    resourceStatusOptions: [],
    resourceTableData: [],
    resourceDetail: null,
    resourceDetailStatus: null,
    resourceDetailId: null
});
export const mutations = {
    //myBCC.vue
    CHANGE_ENTRY_ACTIVE(state, path){
        state.curActiveEntry = path;
    },
    CHANGE_CURRENT_PATH(state, path){
        state.currentPath = path;
    },
    UPDATE_AUTH_USER(state, user) {
        state.currentAuthUser = user;
    },
    SET_LEVEL_OPTIONS(state, data) {
        let option = [];
        for (let key in data) {
            const item = {value: data[key].id, label: data[key].name};
            option.push(item);
        }
        state.levelOptions = option;
    },
    //userSetting.vue
    SET_USERSETTING_OPTIONS(state, data){
        state.userSettingOptions = data;
    },
    SET_ADDRESS(state, data){
        try {
            state.addressOptions = [...data];

        } catch (e) {

        }
    },
    //order.vue
    SET_ORDER_OPTIONS(state, data){
        let option = [];
        for (let key in data) {
            option.push({value: key, label: data[key]});
        }
        state.orderStatusOptions = option;
    },
    SET_ORDER_TABLE_DATA(state, data){
        state.orderTableData = data;
    },
    SET_ORDER_DETAIL(state, data){
        /*let option = [];
         let keys = ['order_no'];
         keys.forEach(item => {
         option.push({name: item, value: data[item]});
         });*/
        state.orderDetail = data;
    },
    //message.vue
    SET_MESSAGE_OPTIONS(state, data){
        let option = [];
        option.push({value: 0, label: 'All Message'})
        for (let key in data) {
            option.push({value: key, label: data[key]});
        }
        state.messageStatusOptions = option;
    },
    SET_MESSAGE_TABLE_DATA(state, data){
        state.messageTableData = data;
    },
    SET_MESSAGE_DETAIL(state, data){
        let option = [];
        let keys = ['messageType', 'title', 'sendTime', "readStatus"];
        keys.forEach(item => {
            option.push({name: item, value: data[item]});
        });
        state.messageDetail = option;
    },
    //resource.vue
    SET_RESOURCE_STATUS_OPTIONS(state, data){
        let option = [];
        for (let key in data) {
            option.push({value: key, label: data[key]});
        }
        state.resourceStatusOptions = option;
    },
    SET_RESOURCE_TABLE_DATA(state, data){
        state.resourceTableData = data;
    },
    SET_RESOURCE_DETAIL(state, data){
        let option = [];
        let keys = ['id', 'sourceType', 'resourceType', 'classname', 'authCode', 
            'authNum', 'useAuthNum', 'username', 'orderNo', 'orderTime', 
            'levelInfo', 'lessonInfo', 'exerciseInfo', 'activateTime', 
            'expiredTime', 'periodDate','createTime', 'status'];
        keys.forEach(item => {
            option.push({name: item, value: data[item]});
            if (item == 'id') {
                state.resourceDetailId = data[item];
            }
            if (item == 'status') {
                state.resouceDetailStatus = data[item];
            }
        });
        state.resourceDetailId = data['id'];
        state.resourceDetailStatus = data['status'];
        state.resourceDetail = option;
    }
};
export const getters = {
    addressOptions(state){
        return state.addressOptions;
    }
};
export const actions = {
    //myBCC.vue
    changeEntryActive({commit}, path){
        commit('CHANGE_ENTRY_ACTIVE', path)
    },
    changeCurrentPath({commit}, path){
        commit('CHANGE_CURRENT_PATH', path);
    },
    async setLevelOptions({state, commit, rootState}) {
        let url = utils.changeParamsToUrl(HTTP_PATH + `/api/study/getMyStudyLevel`, 
            ['uid'], {uid: rootState.authUser.uid});
        try {
            commit("SET_LEVEL_OPTIONS", (await axios.get(url)).data.data || [])
        } catch (e) {
            console.error(e);
        }
    },
    async updateAuthUser ({state, commit}, authUser) {
        let authU = (await utils.sendAxiosGet('/api/user/getUserInfo', ['uid'], {
            uid: authUser.uid
        })).data.data;
        commit('UPDATE_AUTH_USER', authU);
    },
    //userSetting.vue
    async setUserSettingOptions({state, commit}){
        try {
            if (!(state.userSettingOptions.motivationOptions.length 
                    && state.userSettingOptions.learnYearOptions.length 
                    && state.userSettingOptions.addressOptions.length)) {
                const userSettingOptions = {
                    motivationOptions: [],
                    learnYearOptions: [],
                    addressOptions: []
                };
                let res;
                res = await Promise.all([axios.get(HTTP_PATH + "/api/user/getFormOption"), 
                        axios.get(HTTP_PATH + "/api/getCountryCity")]);
                const motivation = res[0].data.data.motivation;
                const learningYears = res[0].data.data.learning_years;
                for (let key in motivation) {
                    userSettingOptions.motivationOptions.push({label: motivation[key], value: key});
                }
                for (let key in learningYears) {
                    userSettingOptions.learnYearOptions.push({label: learningYears[key], value: key});
                }
                res[1].data.data.forEach(item => {
                    item.children = [];
                });
                commit('SET_ADDRESS', res[1].data.data);
                commit("SET_USERSETTING_OPTIONS", userSettingOptions);
            }
        } catch (e) {
            console.error(e);
        }
    },
    searchAddress({state, commit}, selectArr){
        try {
            if (selectArr.length === 1) {
                const arr = utils.extend(true, [], state.addressOptions);
                arr.forEach(async (item) => {
                    if (item.id === selectArr[0] && !item.children.length) {
                        //当改项的children为0时
                        item.children = (await utils.sendAxiosGet('/api/getCountryCity', ['pid'],
                            {pid: selectArr[0]})).data.data;
                        item.children.forEach(item => {
                            item.child ? item.children = [] : '';
                        });
                        commit('SET_ADDRESS', arr);
                    }
                });
            } else if (selectArr.length === 2) {
                const arr = utils.extend(true, [], state.addressOptions);
                arr.forEach((item) => {
                    if (item.id === selectArr[0] && item.children.length) {
                        //当改项的children不为0时
                        item.children.forEach(async (child) => {
                            if (child.id === selectArr[1] && !child.children.length) {
                                child.children =
                                    (await utils.sendAxiosGet('/api/getCountryCity',
                                        ['pid'], {pid: selectArr[1]})).data.data;
                                commit('SET_ADDRESS', arr);
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.error(e);
        }
    },
    //order.vue
    async setOrderOptions({state, commit}){
        try {
            state.orderStatusOptions.length || commit("SET_ORDER_OPTIONS", 
                (await axios.get(HTTP_PATH + "/api/order/getOrderOption")).data.data.my_order_status)
        } catch (e) {
            console.error(e);
        }
    },
    async searchOrderTable({state, commit, rootState}, paramData){
        let url = utils.changeParamsToUrl(HTTP_PATH + `/api/order/getMyOrder`, 
            ['uid', 'keywords', 'startTime', 'endTime', 'status', 'page'], {uid: rootState.authUser.uid, ...paramData});
        try {
            commit("SET_ORDER_TABLE_DATA", (await axios.get(url)).data.data || [])
        } catch (e) {
            console.error(e);
        }
    },
    async setOrderDetail({commit, state, rootState}, orderId){
        try {
            let orderDetail = (await axios.get(utils.changeParamsToUrl(HTTP_PATH + '/api/order/getOrderDetail', 
                ['uid', 'orderId'], {uid: rootState.authUser.uid, ...orderId}))).data;
            commit("SET_ORDER_DETAIL", orderDetail.data);
        } catch (e) {
            console.error(e);
        }
    },
    //message.vue
    async setMessageOptions({state, commit}){
        try {
            state.messageStatusOptions.length || commit("SET_MESSAGE_OPTIONS", 
                (await axios.get(HTTP_PATH + "/api/message/getMessageOption")).data.data.read_status)
        } catch (e) {
            console.error(e);
        }
    },
    async searchMessageTable({state, commit, rootState}, paramData){
        try {
            let data = (await axios.get(utils.changeParamsToUrl(HTTP_PATH + `/api/message/getMyMessage`, 
                ['uid', 'keywords', 'status', 'page'], {uid: rootState.authUser.uid, ...paramData}))).data.data || [];
            commit("SET_MESSAGE_TABLE_DATA", data);
        } catch (e) {
            console.error(e);
        }
    },
    async setMessageDetail({commit, state, rootState}, messageId){
        try {
            let messageDetail = (await axios.get(utils.changeParamsToUrl(HTTP_PATH + '/api/message/getMessageDetail', 
                ['uid', 'messageId'], {uid: rootState.authUser.uid, ...messageId}))).data;
            commit("SET_MESSAGE_DETAIL", messageDetail.data);
        } catch (e) {
            console.error(e);
        }
    },
    //resource.vue
    async setResourceStatusOptions({state, commit, rootState}, paramData){
        try {
            state.resourceStatusOptions.length || commit("SET_RESOURCE_STATUS_OPTIONS", 
                (await axios.get(HTTP_PATH + "/api/resource/getResourceOption")).data.data.resource_status)
        } catch (e) {
            console.error(e);
        }
    },
    async searchResourceTable({state, commit, rootState}, paramData){
        try {
            commit("SET_RESOURCE_TABLE_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/resource/getMyResource",
                    ['uid', 'levelId', 'status', 'page'],
                    {uid: rootState.authUser.uid, ...paramData}))).data.data || []);
        } catch (e) {
            console.error(e);
        }
    },
    async setResourceDetail({commit, state, rootState}, resourceId){
        try {
            let resourceDetail = (await axios.get(utils.changeParamsToUrl(HTTP_PATH + '/api/resource/getResourceDetail', 
                ['uid', 'resourceId'], {uid: rootState.authUser.uid, ...resourceId}))).data;
            commit("SET_RESOURCE_DETAIL", resourceDetail.data);
        } catch (e) {
            console.error(e);
        }
    }
};