import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    classOptions: [],
    levelOptions: [],
    studentOptions: [],
    studentSelectOptions: [],
    totalStudentNum: 0
});
export const mutations = {
    GET_CLASS(state, data){
        state.classOptions = data;
    },
    SET_OPTIONS(state, data){
        let option = [];
        for (let key in data) {
            option.push({value: data[key].id, label: data[key].name});
        }
        state.levelOptions = option;
    },
    SET_STUDENT_OPTIONS(state, data){
        let option = [];
        for (let key in data) {
            option.push({value: data[key].id, label: data[key].name});
        }
        if(option.length == 0) {
            state.studentSelectOptions.push({value: "0", label: "None Class"});
        } else {
            state.studentSelectOptions = option;
        }
    },
    GET_STUDENT(state, data){
        state.studentOptions = data.data;
        if (data.status_code == 200) {
            state.totalStudentNum = data.meta.pagination.total;
        } else {
            state.totalStudentNum = 0;
        }
    }
};
export const actions = {
    async getClass({state, commit, rootState}, params){
        //此处为了防止每次点击加载我加了判断 如果非要重复加载来让点击排序生效的话取消判断
        // (!state.classOptions.length || params) && commit("GET_CLASS", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/educator/getMyClass", ['uid', 'levelId', 'page'], {uid: rootState.authUser.uid, ...params}))).data.data || [])
        commit("GET_CLASS", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/educator/getMyClass",
                ['uid', 'levelId', 'page'], {uid: rootState.authUser.uid, ...params}))).data.data || [])
    },
    async setOptions({state, commit, rootState}, paramData){
        state.levelOptions.length || commit("SET_OPTIONS", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/study/getMyStudyLevel",
            ['uid'], {uid: rootState.authUser.uid}))).data.data)
    },
    async setStudentOptions({state, commit, rootState}, paramData){
        commit("SET_STUDENT_OPTIONS", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/educator/getAllClasses",
            ['uid'], {uid: rootState.authUser.uid}))).data.data);
    },
    async getStudent({state, commit, rootState}, params){
        commit("GET_STUDENT", (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/educator/getMyStudents",
                ['uid', 'classId', 'page'], {uid: rootState.authUser.uid, ...params}))).data || [])
        params ? (params.cover ? params.cover.loading = false : void(0)) : void(0);
    }
}