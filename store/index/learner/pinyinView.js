import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    dataOptions: []
});
export const mutations = {
    GET_DATA(state, data){
        state.dataOptions = data;
    }
};

export const actions = {
    async getData({state, commit, rootState}, paramData){
        try {
            let res = await Promise.all([
                axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/progress/getPinyinProgress",
                    ['uid', 'levelId', 'lessonId'], {uid: rootState.authUser.uid, ...paramData}))
            ]);
            commit("GET_DATA", res[0].data.data);
        } catch (e) {
            console.error(e);
            console.error("---form resource setOptions");
        }
    }
}