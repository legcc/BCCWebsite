import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    dataOptions: [],
    selectOptions: []
});
export const mutations = {
    GET_CLASS(state, data){
        state.dataOptions = data;
    },
    SET_OPTIONS(state, data){
        const option = [];
        for (let key in data) {
            option.push({value: key, label: data[key]});
        }
        state.selectOptions = option;
    }
};

export const actions = {
    async getClass({commit, rootState}, params){
        let res = await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/study/getMyCourse",
            ['uid', 'resourceType', 'learningStatus', 'levelId', 'classId', 'page'],
            {uid: rootState.authUser.uid, ...params}));
        commit("GET_CLASS", res.data.data)
    },
    async setOption({commit}){
        let res = await axios.get(HTTP_PATH + "/api/study/getLearnerOption");
        commit("SET_OPTIONS", res.data.data.learning_status)
    }
}