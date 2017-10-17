import axios from 'axios'
import utils from '~/plugins/utils'
import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    dataOptions: {},
    authNum: 0
});
export const mutations = {
    SET_DATA_OPTIONS(state, data){
        state.dataOptions = data;
    },
    SET_AUTH_NUM(state, data){
        state.authNum = data;
    }
};
export const getters = {
    hasResource(state){
        return state.dataOptions.hasResource
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
    },
    resourceOption(state){
        let option = [], data = state.dataOptions.resource || [];
        data.forEach(item => {
            option.push({value: item["id"], label: item["name"]});
        });
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
            (await axios.get(utils.changeParamsToUrl(`${HTTP_PATH}/api/educator/getEducatorAuthCodeNum`,
                ['uid'], {uid: rootState.authUser.uid}))).data);
    },
    removeResourceOption({state}, params){
        state.dataOptions.resource.forEach((item, index) => {
            if (item.id === params.id) {
                state.dataOptions.resource.splice(index, 1);
            }
        })
    }
}