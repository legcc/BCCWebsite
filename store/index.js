import axios from 'axios'

export const state = () => ({
    //用户session
    authUser: "",
    exerciseLayout: "",
    courseLayout: '',
    curActiveEntry: 0
});

export const mutations = {
    SET_USER: function (state, user) {
        state.authUser = user
    },
    CHANGE_ENTRY_ACTIVE(state, path){
        state.curActiveEntry = path;
    },
    SET_LAYOUT(state, data) {
        state.exerciseLayout = data;
        state.courseLayout = data;
    }
};
export const actions = {
    // nuxtServerInit is called by Nuxt.js before server-rendering every page
    nuxtServerInit ({commit}, {req}) {
        if (req.session && req.session.authUser) {
            commit("SET_USER", req.session.authUser);
        }
        return void 0;
    },
    //建议把网络请求写在这里面 然后等网络请求完成再进行commit来修改state 页面中只需要展示数据
    changeEntryActive({commit}, path){
        commit('CHANGE_ENTRY_ACTIVE', path)
    },
    setLayout({commit}, param){
        commit('SET_LAYOUT', param);
    }
};