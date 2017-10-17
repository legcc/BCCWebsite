import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    dataOptions: [],
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
            let res = await Promise.all([
                axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/progress/getSentenceProgress", ['uid', 'levelId', 'lessonId', 'page'], {uid: rootState.authUser.uid, ...paramData})),
                axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/study/getMyStudyLevel", ['uid'], {...rootState.authUser}))
            ]);
            commit("GET_DATA", res[0].data.data);
            commit("GET_SELECT", res[1].data.data);
        } catch (e) {
            console.error(e)
        }
    },
    async searchTable({state, commit, rootState}, paramData){
        try {
            commit("GET_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + `/api/progress/getSentenceProgress`, ['uid', 'levelId', 'lessonId', 'page'], {uid: rootState.authUser.uid, ...paramData}))).data.data || []);
        } catch (e) {
            console.error(e);
        }
    }
}