import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    dataOptions: [],
    exerciseTemplate: [],
    courseTemplate: []
});
export const mutations = {
    GET_DATA(state, data){
        state.dataOptions = data;
    },
    SET_EXERCISE_TEMPLATE(state, data){
        state.exerciseTemplate = data;
    },
    SET_COURSE_TEMPLATE(state, data){
        state.courseTemplate = data;
    }
};
export const actions = {
    async getData({state, commit, rootState}, param){
        try {
            state.dataOptions.length || commit("GET_DATA",
                (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/study/getMyStudyDetail",
                    ['uid', 'lessonId', 'classId'], {uid: rootState.authUser.uid, ...param}))).data.data)
        } catch (e) {
            console.error(e);
        }
    },
    async getExerciseTemplate({state, commit, rootState}, param){
        commit("SET_EXERCISE_TEMPLATE", (await utils.sendAxiosGet("/api/study/getExerciseTemplate",
            ['uid', 'lessonId'], {uid: rootState.authUser.uid, ...param})).data.data);
    },
    async getCourseTemplate({state, commit, rootState}, param){
        commit("SET_COURSE_TEMPLATE", (await axios.get(
            utils.changeParamsToUrl(HTTP_PATH + "/api/study/getCourseTemplate", ['uid', 'lessonId'],
                {uid: rootState.authUser.uid, ...param}))).data.data);
    },
}