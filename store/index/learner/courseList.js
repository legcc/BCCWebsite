import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    courseOptions: [],
    statusOptions: [],
    levelOptions: []

});
export const mutations = {
    GET_COURSE(state, data){
        state.courseOptions = data;
    },
    GET_STATUS(state, data){
        let option = [];
        for (let key in data) {
            option.push(data[key]);
        }
        state.statusOptions = option;
    },
    SET_LEVEL_OPTIONS(state, data){
        let option = [];
        for (let key in data) {
            const item = {value: data[key].id, label: data[key].name};
            option.push(item);
        }
        state.levelOptions = option;
    }
};

export const actions = {
    async getData({state, commit, rootState}, paramData){
        try {
            let res = await Promise.all([
                axios.get(HTTP_PATH + "/api/study/getLearnerOption"),
                axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/study/getMyCourse", 
                    ['uid', 'resourceType', 'learningStatus', 'levelId', 'classId', 'page'], 
                    {uid: rootState.authUser.uid, ...paramData}))
            ]);
            commit("GET_COURSE", res[1].data.data || []);
            commit("GET_STATUS", res[0].data.data || []);
        } catch (e) {
            console.error(e);
        }
    },
    async searchData({state, commit, rootState}, paramData){
        try {
            commit("GET_COURSE", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + `/api/study/getMyCourse`,
                    ['uid', 'resourceType', 'learningStatus', 'levelId', 'classId', 'page'],
                    {uid: rootState.authUser.uid, ...paramData}))).data.data || []);
        } catch (e) {
            console.error(e);
        }
    },
    async getLevelOption({state, commit, rootState}){
        state.levelOptions.length || commit("SET_LEVEL_OPTIONS", (await utils.sendAxiosGet("/api/study/getMyStudyLevel",
                ['uid'], {uid: rootState.authUser.uid})).data.data || [])
    }
}