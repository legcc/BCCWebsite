<template>
    <div class="sky-container">
        <contentContainer :templates="templates" :tools="tools" @listenPage="activePage">
            <article slot="body">
                <nuxt/>
                <div class="course_right">
                    <ul class="right-fctn">
                        <li :class="tools.more ? 'rightActive' : ''" @click="skipMore(tools.backPage)">MORE</li>
                        <li :class="tools.tips ? 'rightActive' : ''" @click="skipTips(tools.backPage)">TIPS</li>
                        <li :class="tools.culture ? 'rightActive' : ''" @click="skipCulture(tools.backPage)">CULTURE
                        </li>
                    </ul>
                </div>
            </article>
            <aside slot="footer">
                <div class="practice_nav_box">
                    <div v-if="toolsParams.pageTurning">
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
                              @click="preventSubmit || nextPage()"></span>
                        <p class="practice_pagination">
                            <span>{{contentInfo.lessons.name}}-</span>
                            <span>Page:</span>
                            <span>
            <i class="practice_current_page">{{+curPageIndex + 1}}</i>/<i>{{totalPage}}</i></span>
                        </p>
                    </div>
                </div>
                <el-pagination
                        class="table-info-pagination"
                        layout="prev, pager, next"
                        :current-page.sync="pageNum"
                        :total="1"
                        v-if="toolsParams.toolsPage"
                >
                </el-pagination>
                <button class="tools-back" @click="forWardPage(tools.backPage)" v-if="toolsParams.backBtn">
                    Go Back
                </button>
            </aside>
        </contentContainer>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex';
    import axios from 'axios';
    import contentContainer from '~/components/course_3_header.vue';
    const nodePath = require('~/static/server.config').nodePath;
    export default {
        data () {
            return {
                nodePath,
                pageNum: 1,
                progress: 0,
                curPageIndex: 0,
                speakCountDown: 10,
                countDownToggle: false,
//                右下角的星星转动
                turn: false,
                loading: false,
                preventSubmit: false,
                oneProgress: true,
                tools: {
                    more: false,
                    tips: false,
                    culture: false,
                    backPage: null,
                },
            }
        },
        methods: {
            skipMore(backPage){
                let templatePathMatch = require('~/static/template_path_course');
                const TEMPLATE = this.templates[backPage];
                if (this.contentInfo.more) {
                    const MORE_TEMPLATE = templatePathMatch[this.templates[backPage].more[1]['template_no']];
                    this.$router.push({
                        name: `course-index-${MORE_TEMPLATE}`,
                        params: {lessonId: TEMPLATE.lesson, textId: TEMPLATE.pageNum}
                    });
                    this.toolsParams.backBtn = true;
                    this.toolsParams.pageTurning = false;
                    this.toolsParams.isTools = true;
                }
            },
            skipTips(backPage){
                let templatePathMatch = require('~/static/template_path_course');
                const TEMPLATE = this.templates[backPage];
                if (this.contentInfo.tips) {
                    const TIPS_TEMPLATE = templatePathMatch[this.templates[backPage].tips[1]['template_no']];
                    this.$router.push({
                        name: `course-index-${TIPS_TEMPLATE}`,
                        params: {lessonId: TEMPLATE.lesson, textId: TEMPLATE.pageNum}
                    });
                    this.toolsParams.backBtn = true;
                    this.toolsParams.pageTurning = false;
                    this.toolsParams.isTools = true;
                }
            },
            skipCulture(backPage){
                let templatePathMatch = require('~/static/template_path_course');
                const TEMPLATE = this.templates[backPage];
                if (this.contentInfo.culture) {
                    const CULTURE_TEMPLATE = templatePathMatch[this.templates[backPage].culture[1]['template_no']];
                    this.$router.push({
                        name: `course-index-${CULTURE_TEMPLATE}`,
                        params: {lessonId: TEMPLATE.lesson, textId: TEMPLATE.pageNum}
                    });
                    this.toolsParams.backBtn = true;
                    this.toolsParams.pageTurning = false;
                    this.toolsParams.isTools = true;
//                    this.setBackbtnState(true);
//                    this.setTurningState(false);
//                    this.setIsTools(true);
                }
            },
            prePage(){
                if (this.progress >= (1 / this.totalPage) * 100) {
                    this.forWardPage(--this.curPageIndex);
                    this.progress -= (1 / this.totalPage) * 100;
                }
                if (this.curPageIndex < 0) {
                    console.log("NO PRE PAGE");
                    window.location.reload();
//                    setTimeout(() => {
//                        window.location.reload();
//                    }, 1000);
                }
            },
            nextPage(){
                if (this.progress < 100) {
                    this.forWardPage(++this.curPageIndex);
                    this.progress += (1 / this.totalPage) * 100;
                }
                if (this.curPageIndex + 1 >= this.totalPage) {
                    console.log("NO NEXT PAGE");
//                    setTimeout(() => {
//                        window.location.reload();
//                    }, 1000);
                }
            },
            activePage(data){
                this.curPageIndex = data;
                this.progress = ++data * (1 / this.totalPage) * 100;
            },
            async  forWardPage(num){
                let templatePathMatch = require('~/static/template_path_course');
                const TEMPLATE = this.templates[num];
                const TOOLS_MORE = this.templates[num].more || "";
                const TOOLS_TIPS = this.templates[num].tips || "";
                const TOOLS_CULTURE = this.templates[num].culture || "";
                const ENTRY_PATH = templatePathMatch[TEMPLATE['template_no']];
                this.preventSubmit = true;
                this.tools.backPage = num;
                this.toolsParams.backBtn = false;
                this.toolsParams.pageTurning = true;
                this.toolsParams.toolsPage = false;
                this.toolsParams.isTools = false;
//                this.setBackbtnState(false);
//                this.setTurningState(true);
//                this.setToolsPage(false);
//                this.setIsTools(false);
                if (TOOLS_MORE) {
                    this.tools.more = true;
                } else {
                    this.tools.more = false;
                }
                if (TOOLS_TIPS) {
                    this.tools.tips = true;
                } else {
                    this.tools.tips = false;
                }
                if (TOOLS_CULTURE) {
                    this.tools.culture = true;
                } else {
                    this.tools.culture = false;
                }
//                console.log(this.contentInfo.texts.more);
//                如果下个路由不与当前路由相同
                if (this.$router.currentRoute.name !== `course-index-${ENTRY_PATH}`) {
                    this.setTemplateStyle(`style-${TEMPLATE.level}`);
//                    如果下个模板存在的话
                    if (ENTRY_PATH) {
                        this.$router.push({
                            name: `course-index-${ENTRY_PATH}`,
                            params: {lessonId: TEMPLATE.lesson, textId: TEMPLATE.pageNum}
                        })
                    } else {
                        this.preventSubmit = false;
                        console.log("该模板还没完成.");
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                } else {
//                    如果下个路由相同则直接更改数据
                    await this.setContentInfo({
                        lessonId: TEMPLATE.lesson,
                        textId: TEMPLATE.pageNum,
                        component: this
                    });
                    this.setTemplateStyle(`style-${TEMPLATE.level}`);
                }
            },
//            ...mapActions('index/course/index', ['setContentInfo', 'setTemplateStyle', 'setTurningState', 'setBackbtnState', 'setToolsPage', 'setIsTools']),
            ...mapActions('index/course/index', ['setContentInfo', 'setTemplateStyle']),
        },
        created(){
            this.forWardPage(this.curPageIndex);
            this.progress = (1 / this.totalPage) * 100;
            this.toolsParams.backBtn = false;
            this.toolsParams.pageTurning = true;
            this.toolsParams.toolsPage = false;
            this.toolsParams.isTools = false;
//            this.setBackbtnState(false);
//            this.setTurningState(true);
//            this.setToolsPage(false);
//            this.setIsTools(false);
        },
        computed: {
            ...mapState('index/course/index', {
                templates: state => state.templates
                , contentInfo: state => state.contentInfo
                , audioInfo: state => state.audioInfo
                , totalPage: state => state.totalPage
//                , pageTurning: state => state.pageTurning
//                , backBtn: state => state.backBtn
//                , toolsPage: state => state.toolsPage
//                , isTools: state => state.isTools
            }),
            ...mapGetters('index/course/index', [
                'toolsParams',
            ]),
            starArr(){
                const stars = ["", "", ""];
                for (let i = 0; i < +this.contentInfo.star; i++) {
                    stars[i] = "practice_grade_plus";
                }
                return stars;
            },
        },
        watch: {
            contentInfo(){
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

    .cn {
        font-family: KaiTi;
    }

    .en,py {
        font-family: Calibri;
    }
</style>
<style lang="less" scoped>
    .sky-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        min-height: 100%;
        background: url("~~assets/img/main_content/layouts/bg-orange.jpg") no-repeat;
        background-size: 100% 100%;
    }

    /*right*/
    .course_right {
        width: .85rem;
        height: 3rem;
        text-align: center;
        position: absolute;
        right: 0rem;
        top: 1.8rem;

        .right-fctn {
            background: url("~~assets/img/main_content/course/l3-lantern-active.png") center no-repeat;
            background-size: 100% 100%;
            height: 100%;
            li {
                border-radius: 0.2rem;
                cursor: pointer;
                color: #EB878C;
                font-size: 0.16rem;
                font-weight: 700;
                position: relative;
                line-height: 1.049rem;
                padding-top: 0.02rem;
                border-radius: 50%;
            }
            .rightActive {
                color: #FFB400;
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
        background: #222222;
    }

    .practice_nav_box .progress-bar {
        position: relative;
        background: repeating-linear-gradient(-60deg, #AC1C1C, #AC1C1C 0.1rem, #971617 0, #971617 0.2rem);
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
        background: #971617;
        cursor: pointer;
        box-sizing: border-box;
    }

    .practice_pagination {
        margin-top: 10px;
        margin-bottom: 0;
        color: black;
        font-weight: 700;
    }

    .practice_pagination span,
    .practice_pagination i {
        display: inline-block;
    }

</style>
