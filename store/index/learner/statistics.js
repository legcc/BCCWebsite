import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    dataOptions: {},
    levelOptions: [],
    lessonOptions: {}
});
export const mutations = {
    GET_DATA(state, data){
        state.dataOptions = data;
    },
    GET_SELECT(state, data){
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
    async getData({state, commit, rootState}, paramData){
        try {
            if (!Object.keys(state.dataOptions).length || !Object.keys(state.lessonOptions).length || !state.levelOptions.length || paramData) {
                let res = await Promise.all([
                    axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/progress/getLevelLessonProgress",
                        ['uid', 'levelId', 'lessonId'], {uid: rootState.authUser.uid, ...paramData})),
                    axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/study/getMyStudyLevel",
                        ['uid'], {uid: rootState.authUser.uid})),
                ]);
                commit("GET_DATA", res[0].data.data || {});
                commit("GET_SELECT", res[1].data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    },
    async searchData({state, commit, rootState}, paramData){
        try {
            commit("GET_DATA", (await utils.sendAxiosGet("/api/progress/getLevelLessonProgress", ['uid', 'levelId', 'lessonId'], {uid: rootState.authUser.uid, ...paramData})).data.data || 0);
        } catch (e) {
            console.error(e);
        }
    }
}