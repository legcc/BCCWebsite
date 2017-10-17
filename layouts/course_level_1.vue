<template>
    <div id="cor-1-container">
        <!--系统提示音频-->
        <audio ref="wrong" style="display: none;">
            <source :src="addPrefixHost('tools/audio/click-wrong.wav')"/>
        </audio>
        <audio ref="success" style="display: none;">
            <source :src="addPrefixHost('tools/audio/click-right.wav')"/>
        </audio>
        <contentContainer :templates="templates" :notEntered="notEntered" :tools="tools"
                          v-loading="!dataIsComplete" @listenPage="activePage" @getIscroll="getIscroll">
            <article slot="body">
                <div class="prompt-container" v-show="alert">
                    <div class="container">
                        <div class="reverseRotate">
                            <div class="animation-container">
                                <aside class="prompt-success" v-show="answer&&!practice">
                                    <ul>
                                        <li class="err-msg-container"><h2 class="message">you are great!</h2></li>
                                        <li>
                                            <button class="prompt-btn"
                                                    @click="notEntered?turnOff($event,true):nextExtendPage(true)">ok
                                            </button>
                                        </li>
                                    </ul>
                                </aside>
                                <aside class="prompt-practice" v-show="practice">
                                    <ul>
                                        <li class="err-msg-container"><h2 class="message">good practice!</h2></li>
                                        <li>
                                            <button class="prompt-btn"
                                                    @click="notEntered?turnOff($event,true):nextExtendPage(true)">ok
                                            </button>
                                        </li>
                                    </ul>
                                </aside>
                                <aside class="prompt-error" v-show="!answer&&!practice">
                                    <ul>
                                        <li class="err-msg-container">
                                            <h2 class="label">answer:</h2>
                                            <strong class="message" v-html="promptMsg"></strong>
                                        </li>
                                        <li>
                                            <button class="prompt-btn"
                                                    @click="notEntered?turnOff($event,true):nextExtendPage(true)">ok
                                            </button>
                                        </li>
                                    </ul>
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
                <nuxt/>
                <div class="course_right">
                    <div class="right-line"></div>
                    <ul class="right-fctn">
                        <!--<li @click="backCourse(tools.backPage)" v-show="!notEntered"-->
                        <!--class='exist'>BACK-->
                        <!--</li>-->
                        <li @click="tools.more&&notEntered&&enterExtendModule('more')"
                            :class="tools.more&&'exist'">MORE
                        </li>
                        <li @click="tools.tips&&notEntered&&enterExtendModule('tips')"
                            :class="tools.tips&&'exist'">TIPS
                        </li>
                        <li @click="tools.culture&&notEntered&&enterExtendModule('culture')"
                            :class="tools.culture&&'exist'">CULTURE
                        </li>

                    </ul>
                </div>
            </article>
            <aside slot="footer">
                <div class="practice_nav_box">
                    <div v-if="notExtends">
                    <span class="practice_nav_prev" :class="preventSubmit && 'wait'"
                          @click="preventSubmit || prePage()"></span>
                        <div class="progress">
                            <div class="progress-bar progress-bar-info" role="progressbar"
                                 :style="'width:'+progress+'%'">
                                <p class="nav_progress_step_box">
                                    <span class="nav_progress_step"></span>
                                </p>
                            </div>
                        </div>
                        <span class="practice_nav_next" :class="preventSubmit && 'wait'"
                              @click="preventSubmit||nextPage($event,true)"></span>
                        <p class="practice_pagination">
                            <span style="margin-right: 10px">{{contentInfo.lessons && contentInfo.lessons.name}}</span>
                            <span>Page:</span>
                            <span>
            <i class="practice_current_page">{{+curPageIndex + 1}}</i>/<i>{{totalPage}}</i></span>
                        </p>
                    </div>
                    <div v-else>
                                <span class="practice_nav_prev"
                                      @click="preExtendPage()"></span>
                        <div class="progress">
                            <div class="progress-bar progress-bar-info" role="progressbar"
                                 :style="'width:'+extendProgress+'%'">
                                <p class="nav_progress_step_box">
                                    <span class="nav_progress_step"></span>
                                </p>
                            </div>
                        </div>
                        <span class="practice_nav_next"
                              @click="nextExtendPage(true)"></span>
                        <p class="practice_pagination">
                            <span style="margin-right: 10px">{{contentInfo.lessons && contentInfo.lessons.name}}</span>
                            <span>Page:</span>
                            <span>
            <i class="practice_current_page">{{curExtendPageIndex + 1}}</i>/<i>{{(contentInfo.more || contentInfo.tips || contentInfo.culture).length}}</i></span>
                        </p>
                    </div>
                </div>
                <button class="tools-back" @click="backCourse(tools.backPage)" v-show="!notEntered">
                    Go Back
                </button>
            </aside>
        </contentContainer>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
    import utils from '~/plugins/utils';
    import axios from 'axios';
    import R from 'ramda';
    import contentContainer from '~/components/course_1_header.vue';

    const nodePath = require('~/static/server.config').nodePath;
    import recorder from '~/plugins/gumadapter';
    import MediaStreamRecorder from '~/plugins/MediaStreamRecorder';
    import VIscroll from 'viscroll';
    import Vue from 'vue';

    export default {
        data() {
            Vue.use(VIscroll, {
                mouseWheel: true,
                scrollbars: true,
                interactiveScrollbars: true,
                fadeScrollbars: false
            });
            return {
                alert: false,
                nodePath,
                pageNum: 1,
                /*拓展模块*/
//                拓展页码
                curExtendPageIndex: 0,
//                拓展的模块名称
                extendOptionName: "",
//                未进入拓展模块
                notEntered: true,
//                不调用拓展模块功能
                notExtends: true,
                /*拓展模块*/
                progress: 0,
                curPageIndex: 0,
                preventSubmit: false,
                oneProgress: true,
                beginTime: Date.now(),
                JudgeArr: ["K06", "K07", "K09", "K10", "K12", "K13", "K15", "K16", "K21", "K22", "K24", "K27", "K29", "K32", "K33", "K37", "K38", "K39", "K40", "K41", "K42"],
                tools: {
                    more: false,
                    tips: false,
                    culture: false,
                    backPage: null,
                    isEndpage: false
                },
            }
        },
        methods: {
            ...mapMutations('index/course/index', ["SET_COURSE_EXTEND_INFO"]),
            getIscroll(iscroll) {
                if (iscroll) {
                    iscroll.on('scrollStart', function () {
                    })
                }
            },
            turnOff() {
                if (this.alert) {
                    this.alert = false;
                    this.setJudge({practice: false, haveJudge: false});
//                    this.haveJudge = false;
                }
                if (this.progress < 100) {
                    this.forWardPage(++this.curPageIndex);
                    this.progress += (1 / this.totalPage) * 100;
                }
                this.setAnswer({answer: false, msg: ""});
            },
            prePage() {
                this.tools.isEndpage = false;
                this.setAnswer({answer: false, msg: ""});
                this.setJudge({practice: false, haveJudge: false});
                if (this.progress >= (1 / this.totalPage) * 100) {
                    this.forWardPage(--this.curPageIndex);
                    this.progress -= (1 / this.totalPage) * 100;
                    this.setDataIsComplete({dataIsComplete: false});
                }
                if (this.curPageIndex < 0) {
                    console.log("NO PRE PAGE");
                    window.location.reload();
                }
            },
            nextPage(e, pass) {
                if (pass) {
//                    this.dataIsComplete = false;
                    if (this.progress < 100) {
                        this.submitAnswer();
                        if (this.haveJudge) {
                            this.alert = true;
                            this.practice || this.answer ? this.$refs.success.play() : this.$refs.wrong.play();
                        } else {
                            this.forWardPage(++this.curPageIndex);
                            this.progress += (1 / this.totalPage) * 100;
                            this.setDataIsComplete({dataIsComplete: false});
                        }
                    }
                    if (this.curPageIndex + 1 === this.totalPage) {
                        this.tools.isEndpage = true;
                        this.$router.replace({
                            name: "course-index-endPage-level1"
                        });
                        this.setDataIsComplete({dataIsComplete: true});
                    } else if (this.curPageIndex + 1 > this.totalPage) {
                        console.log("NO NEXT PAGE");
                        window.location.reload();
                    }

                }
            },
            activePage(data) {
                this.tools.isEndpage = false;
//                this.contentInfo.page_title = "";
                this.setDataIsComplete({dataIsComplete: false});
                const TEMPLATE = this.templates[data];
                this.curPageIndex = data;
                this.progress = ++data * (1 / this.totalPage) * 100;
                this.setAnswer({answer: false, msg: ""});
                this.setJudge({practice: false, haveJudge: false});
                this.JudgeArr.forEach((item) => {
                    if (TEMPLATE['template_no'] === item) {
                        this.setJudge({practice: false, haveJudge: true});
                    }
                });
            },
            async forWardPage(num) {
                let templatePathMatch = require('~/static/template_path_course');
                const TEMPLATE = this.templates[num];
                const ENTRY_PATH = TEMPLATE && templatePathMatch[TEMPLATE['template_no']];
                this.preventSubmit = true;
                this.tools.more = TEMPLATE && TEMPLATE.more ? true : false;
                this.tools.tips = TEMPLATE && TEMPLATE.tips ? true : false;
                this.tools.culture = TEMPLATE && TEMPLATE.culture ? true : false;
                this.JudgeArr.forEach((item) => {
                    if (TEMPLATE && TEMPLATE['template_no'] === item) {
                        this.setJudge({practice: false, haveJudge: true});
                    }
                });
                this.tools.backPage = num;
                if (this.$router.currentRoute.name !== `course-index-${ENTRY_PATH}`) {
                    this.setTemplateStyle(`style-${TEMPLATE && TEMPLATE.level}`);
//                    如果下个模板存在的话
                    if (ENTRY_PATH) {
                        this.$router.replace({
                            name: `course-index-${ENTRY_PATH}`,
                            params: {lessonId: TEMPLATE && TEMPLATE.lesson, textId: TEMPLATE && TEMPLATE.pageNum}
                        })
                    } else {
                        this.preventSubmit = false;
                    }
                } else {
//                    如果下个路由相同则直接更改数据
                    await this.setContentInfo({
                        lessonId: TEMPLATE && TEMPLATE.lesson,
                        textId: TEMPLATE && TEMPLATE.pageNum,
                        component: this
                    });
                    this.setTemplateStyle(`style-${TEMPLATE && TEMPLATE.level}`);
                }
            },
            async submitAnswer(isTrue) {
                const endTime = Date.now() - this.beginTime;
                this.beginTime = Date.now();
                let res = await utils.sendAxiosPost('/api/study/completeCourse', {
                    uid: this.userInfo.uid,
                    customerType: this.userInfo.customerType,
                    lessonPageId: this.contentInfo.id,
                    levelId: this.exerciseInfo.levelId,
                    lessonId: this.exerciseInfo.lessonId,
                    classId: this.exerciseInfo.classId,
                    costTime: endTime,
                });

            },
            ...mapActions('index/course/index', ['setContentInfo', 'setTemplateStyle', 'setAnswer', 'setJudge', 'setDataIsComplete', 'setPinyinSwitch']),
            /*拓展模块*/
//            进入模块函数
            enterExtendModule(optionName) {
                this.extendOptionName = optionName;
                this.forWardExtendPage(0);
                this.notEntered = false;
                this.notExtends = false;
            },
//            返回课程函数
            backCourse(backPageNum) {
//                切换配置项
                this.notEntered = true;
                this.notExtends = true;
                this["SET_COURSE_EXTEND_INFO"]("");
                this.forWardPage(backPageNum);
                this.curExtendPageIndex = 0;
            },
//            拓展页翻页
            preExtendPage() {
                this.setAnswer({answer: false, msg: ""});
                this.setJudge({practice: false, haveJudge: false});
                const totalLen = this.contentInfo[this.extendOptionName].length - 1;
                if (totalLen && this.extendProgress >= (1 / this.extendTotalPage) * 100) {
                    this.forWardExtendPage(--this.curExtendPageIndex);
                } else {
                    this.$message.error("no more ...");
                }
            },
//            拓展模块翻页
            nextExtendPage(pass) {
//                this.alert = !this.alert;
//                this.haveJudge=false;
//                this.submitAnswer();
                if (pass) {
                    this.setAnswer({answer: false, msg: ""});
                    this.setJudge({practice: false, haveJudge: false});
                    const successHandler = _ => {
                        this.forWardExtendPage(++this.curExtendPageIndex);
                    };
                    const errorHandler = _ => {
                        this.$message.error("no more ...");
                    };
                    const condition = R.multiply(100)(1 / this.extendTotalPage);
                    R.ifElse(R.lt)(successHandler, errorHandler)(this.extendProgress)(100 - condition);
                }
            },
//            拓展模块跳页
            forWardExtendPage(num) {
                let templatePathMatch = require('~/static/template_path_course');
                if (this.contentInfo[this.extendOptionName]) {
                    const MORE_TEMPLATE = templatePathMatch[this.contentInfo[this.extendOptionName][num]['template_no']];
                    if (this.$router.currentRoute.name !== `course-index-${MORE_TEMPLATE}`) {
                        this.$router.replace({
                            name: `course-index-${MORE_TEMPLATE}`,
                            params: {extendData: this.contentInfo[this.extendOptionName][num].content}
                        });
                        this["SET_COURSE_EXTEND_INFO"]("");
                    } else {
                        this["SET_COURSE_EXTEND_INFO"](this.contentInfo[this.extendOptionName][num].content);
                    }
                }
            },
            /*拓展模块*/
        },
        created() {
            this.forWardPage(this.curPageIndex);
            this.progress = (1 / this.totalPage) * 100;
            this.setJudge({practice: false, haveJudge: false});
            this.setPinyinSwitch({pinyinSwitch: true,bindStyle: ""});
//            this.contentInfo.page_title = "";
        },
        computed: {
            ...mapState('index/course/index', {
                templates: state => state.templates
                , contentInfo: state => state.contentInfo
                , audioInfo: state => state.audioInfo
                , totalPages: state => state.totalPage
                , answer: state => state.answer
                , errorMsg: state => state.errorMsg
                , haveJudge: state => state.haveJudge
                , practice: state => state.practice
                , dataIsComplete: state => state.dataIsComplete
            }),
            ...mapState('index/exercise/index', {
                exerciseInfo: state => state.exerciseInfo
            }),
            ...mapGetters('index/course/index', [
                'toolsParams',
            ]),
            totalPage() {
                const page = this.totalPages;
                return parseInt(page) + 1;
            },
            promptMsg() {
                const msg = this.errorMsg;
                return msg;
            },
            userInfo() {
                return this.$store.state.authUser;
            },
            /*拓展模块*/
//            拓展页进度条
            extendProgress() {
                const totalLen = this.contentInfo[this.extendOptionName].length - 1;
                return totalLen ? (this.curExtendPageIndex) / totalLen * 100 : 100;
            },
//            拓展页总页数
            extendTotalPage() {
                return this.contentInfo[this.extendOptionName].length;
            }
            /*拓展模块*/
        },
        watch: {
            contentInfo() {
                this.setDataIsComplete({dataIsComplete: true});
                //进度条初始化
                this.preventSubmit = false;
                if (this.oneProgress) {
                    this.progress = (1 / this.totalPage) * 100;
                    this.oneProgress = false;
                }
            },
        },
        components: {
            contentContainer
        }
    }
</script>
<style lang="less">
    @import "~~assets/less/element/tab_pagination";

    #cor-1-container {

        .page-enter-active, .page-enter {
            transition: all .2s ease-in
        }

        .page-enter {
            transform-origin: left;
            transform: scaleX(.4);
            opacity: 0;
        }

        .page-leave {
            display: none;
        }

    }

    .el-loading-mask {
        background-color: transparent;
    }


</style>
<style lang="less" scoped>
    .el-loading-mask {
        background-color: transparent;
    }

    @keyframes rotate {
        0% {
            transform: rotateX(0deg) rotateZ(0deg);
        }
        50% {
            transform: rotateX(20deg) rotateZ(180deg);
        }
        100% {
            transform: rotateX(0deg) rotateZ(360deg);
        }
    }

    @keyframes reverseRotate {
        to {
            transform: rotate(-360deg);
        }
    }

    .prompt-container {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .5);
        z-index: 9999;
        font-family: GothamRounded-Medium;

        .container {
            position: absolute;
            width: 630px;
            height: 600px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            transform-style: preserve-3d;
            perspective: 1000px;
        }

        .reverseRotate {
            position: absolute;
            width: 630px;
            height: 600px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            animation: reverseRotate 5s linear infinite reverse;
        }

        .animation-container {
            position: absolute;
            width: 630px;
            height: 600px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            animation: rotate 5s linear infinite reverse;
        }

        .prompt-success, .prompt-error, .prompt-practice {
            position: absolute;
            width: 430px;
            height: 400px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            background-color: white;
            border-radius: 12px;
            border: 1px solid #cccccc;
            text-align: center;
            background-repeat: no-repeat;

            .prompt-btn {
                width: 230px;
                height: 40px;
                background-color: #009eb0;
                border-radius: 22px;
                position: absolute;
                left: 0;
                font-size: 28px;
                color: white;
                right: 0;
                bottom: 10px;
                margin: auto;
            }

        }
        .prompt-success, .prompt-practice {
            background-size: 100% 100%;
            background-position: left bottom -50px;

            .err-msg-container {
                word-wrap: break-word;
            }

            .message {
                margin: .05rem 20px 0 20px;
                width: 100%;
                font-size: 35px;
                color: #FF4658;
                text-shadow: 3px 3px 0 #ccc, 5px 5px 0 #eee;
            }

        }
        .prompt-success {
            background-image: url("~~assets/img/exercise/popup_practice.gif");
        }
        .prompt-practice {
            background-image: url("~~assets/img/exercise/popup_good.gif");
        }
        .prompt-error {
            background-image: url("~~assets/img/exercise/popup_error.gif");
            background-size: 100% 89%;
            background-position: left bottom -.4rem;
            height: 430px;

            .err-msg-container {
                word-wrap: break-word;
            }

            .label, .message {
                margin-top: 5px;
                font-size: 28px;
                color: #FF4658;
            }

        }
    }

    #cor-1-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        background: url("~~assets/img/main_content/layouts/blueSky-bg.jpg") center no-repeat;
        background-size: cover;

        /*right*/
        .course_right {
            width: 170px;
            text-align: center;
            position: absolute;
            right: .6rem;
            top: 76px;

            .right-line {
                width: 10px;
                height: 500px;
                background: #002D32;
                position: absolute;
                left: 50%;
                border-radius: 10px;
            }

            .right-fctn {

                .moreActive {
                    color: #FBCF2A;
                }

                .tipsActive {
                    color: #EE6273;
                }

                .cultureActive {
                    color: #3695DF;
                }

                .exist {
                    color: #FBCF2A;
                }

                li {
                    width: 170px;
                    height: 80px;
                    line-height: 80px;
                    border-radius: 10px;
                    background: #002D32;
                    -webkit-transform: rotate(-25deg);
                    -ms-transform: rotate(-25deg);
                    transform: rotate(-25deg);
                    cursor: pointer;
                    font-family: 'Showcard Gothic Bold', 'Showcard Gothic Normal', 'Showcard Gothic';
                    color: #999999;
                    font-size: 22px;
                    margin-top: 60px;
                }

            }

        }

        /*footer*/
        .tools-back {
            background: slategrey;
            width: 1.4rem;
            height: 0.4rem;
            line-height: 0.4rem;
            font-size: 0.18rem;
            color: white;
            box-shadow: 2px 2px 2px black;
            position: absolute;
            top: -5%;
            left: 50%;
            transform: translateX(-50%);
        }

        .practice_nav_box {
            width: 100%;
            max-width: 650px;
            padding-top: .4rem;
            display: block;
            position: absolute;
            margin: auto;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            text-align: center;
        }

        .practice_nav_prev,
        .practice_nav_next {
            vertical-align: middle;
            *zoom: 1;
            *display: inline;
            width: 28px;
            height: 20px;
            display: inline-block;
            background-size: 100% 100% !important;
            background-position: center center !important;
            cursor: pointer;

        }

        .practice_nav_prev {
            background: url("~~assets/img/main_content/layouts/footer/course_1_pre.png") no-repeat;
            margin-right: 25px;
        }

        .practice_nav_next {
            background: url("~~assets/img/main_content/layouts/footer/course_1_next.png") no-repeat;
            margin-left: 25px;
        }

        .practice_nav_box .progress {
            vertical-align: middle;
            *zoom: 1;
            *display: inline;
            width: 75%;
            margin: 0;
            height: 18px;
            display: inline-block;
            /*-webkit-box-shadow: 2px 2px 2px #888888 inset;*/
            /*box-shadow: 2px 2px 2px #888888 inset;*/
            border-radius: 3px;
            overflow: visible;
            background: black;
        }

        .practice_nav_box .progress-bar {
            position: relative;
            background: repeating-linear-gradient(-60deg, #003442, #003442 0.1rem, #00DDF8 0, #00DDF8 0.2rem);
            background-size: 100% 100%;
            border-radius: 3px;
        }

        .progress-bar {
            height: 100%;
            transition: all .5s linear;
        }

        .practice_nav_box .nav_progress_step_box {
            display: block;
            position: absolute;
            right: -2px;
            bottom: -6px;
            margin: 0;
        }

        .practice_nav_box .nav_progress_step_box .nav_progress_step {
            width: 15px;
            height: 30px;
            display: block;
            border: 2px solid black;
            border-radius: 5px;
            background: #003141;
            cursor: pointer;
            box-sizing: border-box;
        }

        .practice_pagination {
            margin-top: 10px;
            margin-bottom: 0;
            color: #17436A;
            font-weight: 700;
        }

        .practice_pagination span,
        .practice_pagination i {
            display: inline-block;
        }

    }

</style>
