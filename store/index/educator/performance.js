import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    levelOptions: [],
    dataOptions: []
});
export const mutations = {
    SET_OPTIONS(state, data){
        let option = [];
        for (let key in data) {
            option.push({value: data[key].id, label: data[key].name});
        }
        state.levelOptions = option;
    },
    GET_DATA(state, data){
        state.dataOptions = data;
    }
};
export const actions = {
    async setOptions({commit, rootState, state}, paramData){
        state.levelOptions.length || commit("SET_OPTIONS",
            (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/study/getMyStudyLevel", 
                ['uid'], {uid: rootState.authUser.uid}))).data.data || [])
    },
    async getData({state, commit, rootState}, params){
        (!state.dataOptions.length || params) && commit("GET_DATA",
            (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/educator/getMyClass", 
                ['uid', 'levelId', 'page'], {uid: rootState.authUser.uid, ...params}))).data.data || [])
    },
}