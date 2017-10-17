import axios from 'axios'
import utils from '~/plugins/utils'

import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    excelData: []
});
export const mutations = {
    GET_DATA(state, data){
        state.excelData = data;
    },
    DELETE_DATA(state, index) {
        state.excelData.splice(index, 1);
    }
};
export const actions = {
    setExcelData({commit, rootState}, params){
        commit('GET_DATA', params);
    },
    deleteExcelData({commit, rootState}, index) {
        commit('DELETE_DATA', index);
    }
}