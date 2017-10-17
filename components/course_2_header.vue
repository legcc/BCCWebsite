<template>
    <div class="container">
        <div class="header">
            <div class="head-left">
                <div class="left-container">
                    <div class="head-logo">
                        <nuxt-link :to="HEAD_PATH" class="logo-bd"></nuxt-link>
                    </div>
                    <div class="select-page" @click="notEntered&&select()">
                        Page
                        <i class="el-icon-caret-bottom el-icon--right">
                        </i>
                    </div>
                </div>
                <transition name="el-zoom-in-top">
                    <div class="select-scroll" v-iscroll="scroll" v-show="selectPage">
                        <ul ref="container">
                            <li v-for="(item,index) in templates" @click="notEntered&&sendPage(index)">Page{{index + 1}}
                            </li>
                        </ul>
                    </div>
                </transition>
            </div>
            <div class="head-tool">
                <div class="icon-container">
                    <i class="setting-icon" @click="settingList"><img
                            src="~assets/img/main_content/layouts/header/coursepage-setup.png"
                            alt=""></i>
                    <i class="head-icon" @click="showList"><img
                            src="~assets/img/main_content/layouts/header/userHead-icon.png"
                            alt=""></i>
                </div>
                <transition name="el-zoom-in-top">
                    <ul class="head-setting-down" v-show="settingDown">
                        <nuxt-link class="list" :to="item.path" tag="li" :key="index"
                                   v-for="(item,index) in settingOptions">{{item.label}}
                        </nuxt-link>
                        <li class="list" :class="pinyinSwitch&&'active'" @click="pinyinSet">
                            {{pinyinSwitch ? 'PINYIN off' : 'PINYIN on'}}
                        </li>
                        <li class="list" @click="downLoadTemplate">Download Word Template</li>
                    </ul>
                </transition>
                <transition name="el-zoom-in-top">
                    <ul class="head-drop-down" v-show="dropDown">
                        <nuxt-link class="list" :to="item.path" tag="li" :key="index"
                                   v-for="(item,index) in setUpOptions">{{item.label}}
                        </nuxt-link>
                    </ul>
                </transition>
            </div>
            <div class="head-content">
                <h1 class="title" v-if="!tools.isEndpage">{{contentInfo.page_title}}</h1>
                <h1 class="title" v-if="tools.isEndpage">see you soon!</h1>
            </div>
        </div>
        <div id="container-wrap">
            <slot name="body"></slot>
        </div>
        <div class="footer">
            <!--底部-->
            <slot name="footer"></slot>

        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex';
    import utils from '~/plugins/utils';

    export default {
        props: {
            templates: {
                type: Array,
            },
            tools: {
                type: Object,
            },
            notEntered: Boolean
        },
        data() {
            let centerLabel = "";
            let centerName = "";
            if (this.$store.state.authUser && this.$store.state.authUser.customerType == 1) {
                centerLabel = "Learning Center";
                centerName = "learner";
            } else {
                centerLabel = "Teaching Center";
                centerName = "educator";
            }
            return {
                dropDown: false,
                settingDown: false,
                selectPage: false,
//                myScroll:"",
                setUpOptions: [
                    {label: 'User Setting', path: {name: 'myBCC-userSetting'}},
                    {label: 'Order', path: {name: 'myBCC-order'}},
                    {label: 'Resources', path: {name: 'myBCC-resources'}},
                    {label: 'Message', path: {name: 'myBCC-message'}},
                ],
                settingOptions: [
                    {label: centerLabel, path: {name: centerName}},
//                    {label: 'PINYIN off', path: {name: 'myBCC-order'}},
                ],
                HEAD_PATH: "/learner",
            }
        },
        methods: {
            scroll() {
                this.$emit('getIscroll');
            },
            showList() {
                this.dropDown = !this.dropDown;
                this.settingDown = false;
                this.selectPage = false;
                const wrap = document.querySelector("#container-wrap");
                const removeEvent = () => {
                    this.dropDown = false;
                    wrap.removeEventListener('click', removeEvent);
                };
                wrap.addEventListener('click', removeEvent, false);
            },
            async downLoadTemplate() {
                const res = (await utils.sendAxiosGet('/api/tools/getDownLoadTemplate', ['levelId', 'lessonId'], {...this.exerciseInfo})).data;
                window.location.href = res.data["download_url"];
            },
            pinyinSet() {
                this.pinyinSwitch ? this.setPinyinSwitch({
                    pinyinSwitch: false,
                    bindStyle: "style='display:none'"
                }) : this.setPinyinSwitch({pinyinSwitch: true, bindStyle: ""});
            },
            settingList() {
                this.dropDown = false;
                this.selectPage = false;
                this.settingDown = !this.settingDown;
                const wrap = document.querySelector("#container-wrap");
                const removeEvent = () => {
                    this.settingDown = false;
                    wrap.removeEventListener('click', removeEvent);
                };
                wrap.addEventListener('click', removeEvent, false);
            },
            select() {
                this.selectPage = !this.selectPage;
                this.dropDown = false;
                this.settingDown = false;
                const wrap = document.querySelector("#container-wrap");
                const removeEvent = () => {
                    this.selectPage = false;
                    wrap.removeEventListener('click', removeEvent);
                };
                wrap.addEventListener('click', removeEvent, false);
            },
            sendPage(index) {
                this.$emit("listenPage", index);
                this.forWardPage(index);
                this.tools.backPage = index;
            },
            async forWardPage(num) {
                let templatePathMatch = require('~/static/template_path_course');
                const TEMPLATE = this.templates[num];
                const ENTRY_PATH = TEMPLATE && templatePathMatch[TEMPLATE['template_no']];
                this.tools.more = TEMPLATE && TEMPLATE.more ? true : false;
                this.tools.tips = TEMPLATE && TEMPLATE.tips ? true : false;
                this.tools.culture = TEMPLATE && TEMPLATE.culture ? true : false;
//                如果下个路由不与当前路由相同
                if (this.$router.currentRoute.name !== `course-index-${ENTRY_PATH}`) {
                    this.setTemplateStyle(`style-${TEMPLATE.level}`);
//                    如果下个模板存在的话
                    if (ENTRY_PATH) {
                        this.$router.replace({
                            name: `course-index-${ENTRY_PATH}`,
                            params: {lessonId: TEMPLATE.lesson, textId: TEMPLATE.pageNum}
                        })
                    } else {
                        this.$_error("该模板还没完成.");
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
            ...mapActions('index/course/index', ['setContentInfo', 'setTemplateStyle', 'setPinyinSwitch']),
        },
        created() {
        },
        computed: {
            ...mapState('index/course/index', {
                contentInfo: state => state.contentInfo
                , pinyinSwitch: state => state.pinyinSwitch
                , bindStyle: state => state.bindStyle
            }),
            ...mapGetters('index/course/index', [
                'toolsParams',
            ]),
            ...mapState('index/exercise/index', {
                exerciseInfo: state => state.exerciseInfo
                , exerciseModuleName: state => state.exerciseModuleName
            }),
        },
        components: {}
    }
</script>
<style lang="less" scoped>
    .container {
        height: 100%;
        min-height: 6.38rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .list {
        float: none;
        font-size: 16px;
        color: #4c607a;
        padding: 0 .2rem;
        text-align: left;
        vertical-align: middle;
        height: .4rem;
        line-height: .4rem;
        font-family: GothamRounded-Book;
        cursor: pointer;
        transition: background-color .1s linear;
        &:before {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            vertical-align: middle;
            margin-bottom: 2px;
            margin-right: .2rem;
            content: "";
            background: #cccccc;
        }
        &:hover {
            background-color: #e4e8f1;
        }
    }

    .head-setting-down {
        padding: .1rem .02rem 0.1rem .02rem;
        position: absolute;
        right: 60%;
        top: .76rem;
        z-index: 9999;
        margin-top: .05rem;
        min-width: 2.8rem;
        /* min-height: 1.69rem; */
        border-radius: 5px;
        -webkit-box-shadow: 0 4px 12px 4px black;
        box-shadow: 0 4px 12px 4px black;
        background: white;
        &:before {
            content: "";
            display: block;
            border-bottom: 12px solid white;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            position: absolute;
            top: -12px;
            right: 25%;
        }
        .list {
            float: none;
            font-size: 16px;
            color: #4c607a;
            padding: 0 .2rem;
            text-align: left;
            vertical-align: middle;
            height: .4rem;
            line-height: .4rem;
            font-family: GothamRounded-Book;
            cursor: pointer;
            transition: background-color .1s linear;
            &:before {
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                vertical-align: middle;
                margin-bottom: 2px;
                margin-right: .2rem;
                content: "";
                background: #cccccc;
            }
            &:hover {
                background-color: #e4e8f1;
            }
        }
    }

    .head-drop-down {
        padding: .1rem .02rem 0rem .02rem;
        position: absolute;
        right: 35%;
        top: .76rem;
        z-index: 9999;
        margin-top: .05rem;
        min-width: 1.69rem;
        min-height: 1.69rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px 4px black;
        background: white;
        &:before {
            content: "";
            display: block;
            border-bottom: 12px solid white;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            position: absolute;
            top: -12px;
            right: 25%;
        }
        .list {
            float: none;
            font-size: 16px;
            color: #4c607a;
            padding: 0 .2rem;
            text-align: left;
            vertical-align: middle;
            height: .4rem;
            line-height: .4rem;
            font-family: GothamRounded-Book;
            cursor: pointer;
            transition: background-color .1s linear;
            &:before {
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                vertical-align: middle;
                margin-bottom: 2px;
                margin-right: .2rem;
                content: "";
                background: #cccccc;
            }
            &:hover {
                background-color: #e4e8f1;
            }
        }
    }

    .select-scroll {
        position: absolute;
        width: 150px;
        border-radius: 5px;
        background: #005C31;
        overflow: hidden;
        height: 5.25rem;
        top: 101%;
        left: 33%;
        padding: 0 2px;
        z-index: 99;
        li {
            display: block;
            width: 130px;
            /* padding: 0 10px; */
            height: 45px;
            border-radius: 3px;
            background: white;
            line-height: 45px;
            text-align: center;
            font-size: 22px;
            margin: 0.093rem auto;
            cursor: pointer;
        }
        li:hover {
            background: #78DB4D;
            color: white;
        }
    }

    .header {
        width: 100%;
        height: .76rem;
        background: linear-gradient(lighten(#00371D, 10%) 0, #00371D 90%);
        position: absolute;
        top: 0;
        @sideWidth: 18%;
        .head-left {
            float: left;
            position: relative;
            height: 100%;
            width: @sideWidth;
            .left-container {
                position: absolute;
                top: 50%;
                right: 0;
                -webkit-transform: translateY(-50%);
                -ms-transform: translateY(-50%);
                transform: translateY(-50%);
                width: 67%;
                /* width: 55%; */
                /* height: 100%; */
            }
        }
        .head-logo {
            display: inline-block;
            /* float: left; */
            height: 100%;
            font-size: 28px;
            /* width: 18%; */
            /* position: absolute; */
            /* top: 50%; */
            /* -webkit-transform: translateY(-50%); */
            -ms-transform: translateY(-50%);
            /* transform: translateY(-50%); */
            a {
                display: inline-block;
                color: #f7f8fd;
            }
            .logo-bd {
                min-width: .6rem;
                min-height: .6rem;
                /* margin: auto 0 auto 48%; */
                background-color: #717f8c;
                /* position: absolute; */
                vertical-align: middle;
                /* top: 50%; */
                /* -webkit-transform: translateY(-50%); */
                -ms-transform: translateY(-50%);
                /* transform: translateY(-50%); */
                background: url("~~assets/img/logo.svg") no-repeat;
                background-size: contain;
            }
        }
        .select-page {
            font-size: 25px;
            color: white;
            cursor: pointer;
            display: inline-block;
            /* position: absolute; */
            margin-left: .05rem;
            /* top: 50%; */
            /* right: 0; */
            /* -webkit-transform: translateY(-50%); */
            -ms-transform: translateY(-50%);
            /* transform: translateY(-50%); */
        }
        .head-tool {
            float: right;
            height: 100%;
            width: @sideWidth;
            position: relative;
            .icon-container {
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                width: 50%;
            }
            .setting-icon {
                display: inline-block;
                min-width: 30px;
                min-height: 30px;
                border-radius: 50%;
                float: left;
                cursor: pointer;
            }
            .head-icon {
                display: inline-block;
                min-width: 30px;
                min-height: 30px;
                border-radius: 50%;
                float: right;
                cursor: pointer;
            }
        }

        .head-content {
            height: 100%;
            margin: 0 @sideWidth;
            text-align: center;
            position: relative;
            .title {
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                transform: translateY(-55%);
                display: inline-block;
                color: white;
                font-size: 40px;
                font-family: Calibri;
                vertical-align: middle;
                font-weight: 700;
            }
        }
    }

    #container-wrap {
        box-sizing: border-box;
        font-family: Calibri,KaiTi;
    }

    .footer {
        width: 100%;
        min-height: 1rem;
        position: absolute;
        bottom: 0;

    }
</style>
