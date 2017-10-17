import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    statusOptions: []
});
export const mutations = {
    GET_LEVEL(state, data){
        state.statusOptions = data;
    }
};

export const actions = {
    async getLevel({state, commit, rootState}){
        try {
            state.statusOptions.length || commit("GET_LEVEL",
                (await axios.get(utils.changeParamsToUrl(HTTP_PATH + "/api/learner/getMyLevel", ['uid'], {uid: rootState.authUser.uid}))).data.data || []);
        } catch (e) {
            console.error(e);
        }
    }
}