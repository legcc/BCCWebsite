import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    dataOptions: [],
    levelOptions: [],
    lessonOptions: [],
    classOptions: [],
    studentOptions: {}
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
    },
    SET_CLASS_STUDENT_OPTIONS(state, data){
        let option = [];
        for (let key in data) {
            const item = {value: data[key].id, label: data[key].name};
            const students = data[key].student_info;
            const stuArr = [];
            for (let _key in students) {
                stuArr.push({value: students[_key].id, label: students[_key].user_name});
            }
            state.studentOptions[data[key].id] = stuArr;
            option.push(item);
        }
        state.classOptions = option;
    }
};

export const actions = {
    async getData({state, commit, rootState}, params){
        try {
            commit("GET_DATA", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + `/api/progress/getClassExerciseProgress`, ['uid', 'classId', 'studentId', 'levelId', 'lessonId', 'page'], {uid: rootState.authUser.uid, ...params}))).data.data || []);
        } catch (e) {
            console.error("---form resource searchTable");
        }
    },
    async setOptions({commit, rootState, state}, paramData){
        state.levelOptions.length || commit("SET_OPTIONS", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/study/getMyStudyLevel", ['uid'], {uid: rootState.authUser.uid}))).data.data)
        state.classOptions.length || commit("SET_CLASS_STUDENT_OPTIONS", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/educator/getMyClassSP", ['uid'], {uid: rootState.authUser.uid}))).data.data)
    },
}
