import axios from 'axios'
import R from 'ramda'
import utils from '~/plugins/utils'
import HTTP_PATH from '~/static/server.config'

export const state = () => ({
    contentInfo: {},
    //课程拓展
    courseExtendInfo: "",
    templates: [],
    templateStyle: "",
    audioInfo: {},
    totalPage: 0,
    answer: false,
    errorMsg: "",
    exerciseInfo: 0,
    practice: false,
    haveJudge: false,
    dataIsComplete: true,
    pinyinSwitch: true,
    nextLesson: 0,
    bindStyle: "",
    compare: false,
    toolsInfo: {
        pageTurning: "",
        backBtn: "",
        toolsPage: "",
        isTools: ""
    },
    // pageTurning: "",
    // backBtn: "",
    // toolsPage:"",
    // isTools:""
});
export const getters = {
    toolsParams(state) {
        return state.toolsInfo;
    },
};
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
        state.audioInfo = data;
    },
    SET_TOTAL_PAGE(state, data) {
        state.totalPage = data;
    },
    SET_ANSWER(state, data) {
        state.answer = data;
    },
    SET_ERROR_MSG(state, data) {
        state.errorMsg = data;
    },
    SET_EXERCISE_INFO(state, data) {
        state.exerciseInfo = data;
    }, SET_COURSE_EXTEND_INFO(state, data) {
        state.courseExtendInfo = data;
    },
    SET_PRACTICE(state, data) {
        state.practice = data;
    },
    SET_JUDGE(state, data) {
        state.haveJudge = data;
    },
    SET_DATAISCOMPLETE(state, data) {
        state.dataIsComplete = data;
    },
    SET_PINYINSWITCH(state, data) {
        state.pinyinSwitch = data;
    },
    SET_BINDSTYLE(state, data) {
        state.bindStyle = data;
    },
    SET_NEXT_LESSON(state, data) {
        state.nextLesson = data;
    },
    COMPARE(state, data) {
        state.compare = data;
    }
}
export const actions = {
    async setContentInfo({state, commit, rootState}, params) {
        try {
            let resData = (await utils.sendAxiosGet("/api/study/getCoursePage", ['uid', 'lessonId', 'textId'], {
                uid: rootState.authUser.uid,
                ...params
            })).data.data || {};
            resData.texts.content = JSON.parse(resData.texts.content);
            const extendOptions = ["more", "culture", "tips"];
            extendOptions.forEach(option => {
                resData.texts[option] ? resData.texts[option] = R.map(item =>
                    R.assoc("content", JSON.parse(item.content), item)
                )(resData.texts[option]) : '';
            });
            commit('SET_CONTENT_INFO', resData.texts);
            commit('SET_TOTAL_PAGE', resData.countPage);
            commit('SET_NEXT_LESSON', resData.nextLesson);
        } catch (e) {
        }
    },
    setTemplateStyle({state, commit}, params) {
        commit('SET_TEMPLATE_STYLE', params)
    },
    setCourseTemplates({state, commit}, params) {
        commit('SET_TEMPLATES', params || [])
    },
    setAudioInfo({commit}, params) {
        commit('SET_AUDIO_INFO', params)
    },
    setAnswer({commit}, params) {
        commit('SET_ANSWER', params.answer);
        commit('SET_ERROR_MSG', params.msg)
    },
    setJudge({commit}, params) {
        commit('SET_PRACTICE', params.practice);
        commit('SET_JUDGE', params.haveJudge);
    },
    setExerciseInfo({commit}, params) {
        commit('SET_EXERCISE_INFO', params);
    },
    setDataIsComplete({commit}, params) {
        commit('SET_DATAISCOMPLETE', params.dataIsComplete);
    },
    setPinyinSwitch({commit}, params) {
        commit('SET_PINYINSWITCH', params.pinyinSwitch);
        commit('SET_BINDSTYLE', params.bindStyle);
    },
};
