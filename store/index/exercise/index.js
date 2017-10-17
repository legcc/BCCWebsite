import utils from '~/plugins/utils'
import Maybe from '~/plugins/Maybe'
import R from 'ramda'

export const state = () => ({
    contentInfo: {},
    templates: [],
    templateStyle: "",
    audioStyle: "",
    totalPage: 0,
    statisticsInfo: {
        correct: [],
    },
    successPrompt: false,
    answer: false,
    errorMsg: "",
    successMsg: "",
    totalStar: 0,
    exerciseInfo: 0,
    exerciseModuleName: "",
    audioUrl: "",
    compare: false,
    noCheck: false,
    showCompare: true,
});

export const mutations = {
    SET_CONTENT_INFO(state, data) {
        state.contentInfo = data;
        //    设置模板样式
    }, SET_TEMPLATE_STYLE(state, data) {
        state.templateStyle = data;
        //    设置当前模块需要的所有模板
    }, SET_TEMPLATES(state, data) {
        state.templates = data;
        //    设置音频信息
    }, SET_AUDIO_INFO(state, data) {
        state.audioStyle = data;
    },
    SET_SUCCESS_MSG(state, data) {
        state.successMsg = data;
    }, SET_SUCCESS_PROMPT(state, data) {
        state.successPrompt = data;
    },
    SET_TOTAL_PAGE(state, data) {
        state.totalPage = data;
    },
    SET_ANSWER(state, data) {
        state.answer = data;
    }, SET_ERROR_MSG(state, data) {
        state.errorMsg = data;
    }, SET_IS_CHECK(state, data) {
        state.noCheck = data || false;
    }, SET_TOTAL_STAR(state, data) {
        state.totalStar = data;
    }, SET_EXERCISE_INFO(state, data) {
        state.exerciseInfo = data;
    }, SET_EXERCISE_MODULE_NAME(state, data) {
        state.exerciseModuleName = data;
    }, SET_AUDIO_URL(state, data) {
        state.audioUrl = data;
    }, COMPARE(state, data) {
        state.compare = data;
    }
    //统计信息
    , Correct(state, data) {
        state.statisticsInfo.correct[data.pageNum] = data.isCorrect;
    }, InitStatisticsInfo(state, data) {
        state.statisticsInfo = {
            correct: [],
        }
    }
    //控制compare是否显示
    , CompareControl(state, flag) {
        state.showCompare = flag;
    },
    //初始化音频样式
    INIT_AUDIO_INFO(state, data) {
        state.audioStyle = "";
    }
};
export const getters = {};
export const actions = {
    async setContentInfo({state, commit, rootState}, params) {

        let res = await utils.sendAxiosGet("/api/study/getExercisePage",
            ['uid', 'lessonId', 'exerciseId', 'textId'],
            {
                uid: rootState.authUser.uid,
                ...params
            });
        try {
            res.data.data.content = R.map(JSON.parse, Maybe.of(res.data.data.content));
        } catch (e) {
            window && void function () {
                window.alert(`数据解析失败错误 json:${res.data.data.content}`);
                // setTimeout(_ => {
                //     window.location.href = `https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1
                //     &rsv_idx=1&tn=baidu&wd=砍死同事判刑几年`;
                // })
            }()
        }
        commit('SET_CONTENT_INFO', res.data.data);
        //                临时使用模板长度作为总页码 因为后端获取的总页码不对
        // commit('SET_TOTAL_PAGE', res.data.data.totalPage);
    },
    setTemplateStyle({state, commit}, params) {
        commit('SET_TEMPLATE_STYLE', params)

    },
    setExerciseTemplates({state, commit}, params) {

        commit('SET_TEMPLATES', params || [])

    }, setExerciseTotalPage({state, commit}, params) {

        commit('SET_TOTAL_PAGE', params || 0)

    },
    setAudioInfo({commit}, params) {
        commit('SET_AUDIO_INFO', params)
    }, setTotalStar({commit}, params) {
        commit('SET_TOTAL_STAR', params)
    },
    setAnswer({commit}, params) {
        commit('SET_ANSWER', params.answer);
        commit('SET_ERROR_MSG', params.msg);
        commit('SET_SUCCESS_MSG', params.promptMsg || '');
        commit('SET_SUCCESS_PROMPT', !!params.prompt || false);
        commit('SET_IS_CHECK', !!params.noCheck || false);
    }, setExerciseInfo({commit}, params) {
        commit('SET_EXERCISE_INFO', params);
    },
    setExerciseModuleName({commit}, param) {
        commit("SET_EXERCISE_MODULE_NAME", param);
    }, setAudioUrl({commit}, param) {
        commit("SET_AUDIO_URL", param);
    },
};