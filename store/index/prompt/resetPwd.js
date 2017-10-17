import utils from '~/plugins/utils'
export const state = () => ({
    tokenStatus: {},
    userInfo: ""
});
export const mutations = {
    IS_REGISTER(state, data){
        state.tokenStatus = data;
    },
    SET_USER_INFO(state, data){
        state.userInfo = data;
    }
};
export const actions = {
    async isRegister({state, commit, rootState}, params){
        try {
            let data = (await utils.sendAxiosGet("/api/user/checkUrl", ['token'], params)).data;
            commit("IS_REGISTER", data["status_code"]);
            +data["status_code"] === 200 && commit("SET_USER_INFO", data["data"])
        } catch (e) {
            console.error(e);
            throw new Error("接口出错 页面跳转");
        }
    }
}