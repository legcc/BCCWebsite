import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    dataOptions: [],
    levelOptions: [],
    lessonOptions: {},

});
export const mutations = {
    GET_DATA(state, data){
        state.dataOptions = data;
    },
    SET_OPTIONS(state, data){
        let option = [];
        for (let key in data) {
            const item = {value: data[key].id, label: data[key].name};
            const lesson = data[key].lessons;
            const lessonArr = [];
            for (let _key in lesson) {
                lessonArr.push({value: lesson[_key].id, label: lesson[_key].name});
            }
            state.lessonOptions[data[key].id] = lessonArr;
            option.push(item);
        }
        state.levelOptions = option;
    }
};

export const actions = {
    async getData({state, commit, rootState}, params){
        try {
            commit("GET_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/progress/getCourseRecord",
                    ['uid', 'proId', 'levelId', 'lessonId', 'page'],
                    {uid: rootState.authUser.uid, ...params}))).data.data || []);
        } catch (e) {
            console.error(e);
        }
    },
    async setOptions({commit, rootState, state}, paramData){
        state.levelOptions.length || commit("SET_OPTIONS", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/study/getMyStudyLevel", ['uid'], {uid: rootState.authUser.uid}))).data.data)
    }
}