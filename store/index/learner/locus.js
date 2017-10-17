import axios from 'axios'
import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    levelId: "",
    lessonId: "",
    pageNum: "",
});

export const mutations = {
    SET_LEVEL_ID(state, data){
        state.levelId = data;
    },
    SET_LESSON_ID(state, data){
        state.lessonId = data;
    },
    SET_PAGE_NUM(state, data){
        state.pageNum = data;
    }
};

export const actions = {
    setLevelPath({commit}, data){
        commit('SET_LEVEL_ID', data)
    },
    setLessonPath({commit}, data){
        commit('SET_LESSON_ID', data)
    },
    setPagePath({commit}, data){
        commit('SET_PAGE_NUM', data)
    }

};