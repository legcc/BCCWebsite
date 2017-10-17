import axios from 'axios'

export const state = () => ({
    //选中入口
    curActiveEntry: 0,
    currentPath: []
});

export const mutations = {
    CHANGE_ENTRY_ACTIVE(state, path){
        state.curActiveEntry = path;
    },
    CHANGE_CURRENT_PATH(state, path){
        state.currentPath = path;
    }
};

export const actions = {
    changeEntryActive({commit}, path){
        commit('CHANGE_ENTRY_ACTIVE', path)
    },
    changeCurrentPath({commit}, path){
        commit('CHANGE_CURRENT_PATH', path);
    }
};