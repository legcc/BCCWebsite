import axios from 'axios';
import utils from '~/plugins/utils';

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    levelOptions: [],
    lessonOptions: {},
    //tools.vue
    gridTemplateList: []
});
export const mutations = {
    GET_MY_STUDY_LEVEL(state, data){
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
    },
    //tools.vue
    GET_GRID_TEMPLATE_LIST(state, data){
        state.gridTemplateList = data;
    }
};

export const actions = {
    async getMyStudyLevel({state, commit, rootState}, paramData){
        try {
            let res = await Promise.all([
                axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/study/getMyStudyLevel", 
                    ['uid'], {uid: rootState.authUser.uid}))
            ]);
            commit("GET_MY_STUDY_LEVEL", res[0].data.data);
        } catch (e) {
            console.error(e);
        }
    },
    //tools.vue
    async getGridTemplateList({state, commit, rootState}, paramData){
        try {
            commit("GET_GRID_TEMPLATE_LIST", (await axios.get(utils.changeParamsToUrl(HTTP_PATH 
                + `/api/tools/getTinWordTemplate`, ['uid', 'levelId', 'lessonId', 'page'], 
                {uid: rootState.authUser.uid, ...paramData}))).data.data || []);
        } catch (e) {
            console.error(e);
        }
    }
}