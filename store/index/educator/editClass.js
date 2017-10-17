import axios from 'axios'
import utils from '~/plugins/utils'
import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    dataOptions: {},
    authNum: 0,
    formData: {}
});
export const mutations = {
    SET_DATA_OPTIONS(state, data){
        state.dataOptions = data;
    },
    SET_AUTH_NUM(state, data){
        state.authNum = data;
    },
    SET_FORM_DATA(state, data){
        state.formData = data;
    }
};
export const getters = {
    status(state){
        return state.dataOptions.status
    },
    levelsOption(state){
        let option = [], data = state.dataOptions.levels;
        for (let key in data) {
            option.push({value: key, label: data[key]});
        }
        return option;
    },
    classAgeOption(state){
        let option = [], data = state.dataOptions.class_age;
        for (let key in data) {
            option.push({value: key, label: data[key]});
        }
        return option;
    },
    learningYearsOption(state){
        let option = [], data = state.dataOptions.learning_years;
        for (let key in data) {
            option.push({value: key, label: data[key]});
        }
        return option;
    },
    teachingWeekOption(state){
        let option = [], data = state.dataOptions.teaching_week;
        for (let key in data) {
            option.push({value: key, label: data[key]});
        }
        return option;
    },
    keyStageYear(state){
        let option = [], data = state.dataOptions.key_stage_year;
        for (let key in data) {
            option.push({value: key, label: data[key]});
        }
        return option;
    }
}

export const actions = {
    async getOptions({state, rootState, commit}){
        Object.keys(state.dataOptions).length || commit('SET_DATA_OPTIONS',
            (await axios.get(utils.changeParamsToUrl(`${HTTP_PATH}/api/educator/getMyActiveLevel`,
                ['uid'], {uid: rootState.authUser.uid}))).data.data);

    },
    async getEducatorAuthCodeNum({state, commit, rootState}){
        state.authNum || commit('SET_AUTH_NUM',
            (await utils.sendAxiosGet(`/api/educator/getEducatorAuthCodeNum`,
                ['uid'], {uid: rootState.authUser.uid})).data);
    },
    async getFormData({state, rootState, commit}, params){
        commit('SET_FORM_DATA', (await
            utils.sendAxiosPost('/api/educator/readOneClass', {
                uid: rootState.authUser.uid,
                'class_id': params['class_id']
            })).data.data)
    }
}