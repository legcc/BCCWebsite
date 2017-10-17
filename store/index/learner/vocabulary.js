import axios from 'axios';
import utils from '~/plugins/utils';
import HTTP_PATH from '~/static/server.config';
export const state = () => ({
    hskTableOptions: [],
    edcTableOptions: [],
    levelOptions: [],
    lessonOptions: {}
});
export const mutations = {
    GET_HSK_DATA(state, data){
        state.hskTableOptions = data;
    },
    GET_EDC_DATA(state, data){
        state.edcTableOptions = data;
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
                axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/progress/getVocabularyProgress", ['uid', 'levelId', 'lessonId', 'type', 'page'], {
                    uid: rootState.authUser.uid,
                    levelId: paramData.levelId,
                    lessonId: paramData.lessonId,
                    type: 1,
                    page: paramData.page
                })),
                axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/progress/getVocabularyProgress", ['uid', 'levelId', 'lessonId', 'type', 'page'], {
                    uid: rootState.authUser.uid,
                    levelId: paramData.levelId,
                    lessonId: paramData.lessonId,
                    type: 2,
                    page: paramData.page
                })),
                axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/study/getMyStudyLevel",
                    ['uid'], {uid: rootState.authUser.uid}))
            ]);
            commit("GET_HSK_DATA", res[0].data.data || []);
            commit("GET_EDC_DATA", res[1].data.data || []);
            commit("GET_SELECT", res[2].data.data || []);
        } catch (e) {
            console.error(e);
        }
    },
    async searchTable({state, commit, rootState}, paramData){
        try {
            commit("GET_HSK_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + `/api/progress/getVocabularyProgress`, ['uid', 'levelId', 'lessonId', 'type', 'page'], {
                    uid: rootState.authUser.uid,
                    levelId: paramData.levelId,
                    lessonId: paramData.lessonId,
                    type: 1,
                    page: paramData.page
                }))).data.data || []);
            commit("GET_EDC_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + `/api/progress/getVocabularyProgress`, ['uid', 'levelId', 'lessonId', 'type', 'page'], {
                    uid: rootState.authUser.uid,
                    levelId: paramData.levelId,
                    lessonId: paramData.lessonId,
                    type: 2,
                    page: paramData.page
                }))).data.data || []);
        } catch (e) {
            console.error(e);
        }
    }
}