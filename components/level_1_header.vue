<template>
    <div class="container">
        <div class="header">
            <div class="head-logo">
                <i class="logo-bd" @click="backHome"></i>
            </div>
            <div class="head-tool">
                <div class="icon-container">
                    <i class="setting-icon" :class="dropDown && 'active'" @click="dropDown=!dropDown"><img
                            src="~assets/img/main_content/layouts/header/coursepage-setup.png"
                            alt=""></i>
                    <i class="head-icon" :class="headOptionDropDown && 'active'"
                       @click="headOptionDropDown=!headOptionDropDown"><img
                            src="~assets/img/main_content/layouts/header/userHead-icon.png"
                            alt=""></i>
                </div>
                <transition name="el-zoom-in-top">
                    <ul class="setting-drop-down" v-show="dropDown">
                        <nuxt-link :to="item.path" :key="index"
                                   v-for="(item,index) in setUpOptions">
                            <li class="list">
                                {{item.label}}
                            </li>
                        </nuxt-link>
                        <li class="list" @click="downLoadTemplate">Download Word Template</li>
                    </ul>
                </transition>
            </div>
            <div class="head-content">
                <h1 class="title" v-if="!isEndpage">
                    <img :src="headIcon" class="icon">
                    <em class="title-text"
                        :class="contentInfo.page_title&&contentInfo.page_title.length>30&&'overflow'">{{contentInfo.page_title}}</em>
                </h1>
                <h1 class="title" v-else>
                    <em class="title-text">Consequence</em>
                </h1>
                <transition name="el-zoom-in-top">
                    <ul class="head-drop-down" v-show="headOptionDropDown">
                        <nuxt-link :to="item.path" :key="index"
                                   v-for="(item,index) in headOptions">
                            <li class="list">
                                {{item.label}}
                            </li>
                        </nuxt-link>
                    </ul>
                </transition>
            </div>
        </div>


        <div id="container-wrap" @click="hiddenPrompt">
            <slot name="body"></slot>
        </div>


        <div class="footer">
            <!--底部-->
            <slot name="footer"></slot>

        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import utils from '~/plugins/utils';

    export default {
        props:{
            isEndpage:Boolean
        },
        data () {
            let centerLabel = "";
            let centerName = "";
            if(this.$store.state.authUser && this.$store.state.authUser.customerType == 1) {
                centerLabel = "Learning Center";
                centerName = "learner";
            } else {
                centerLabel = "Teaching Center";
                centerName = "educator";
            }
            return {
                setUpOptions: [
                    {label: centerLabel, path: {name: centerName}},
                ],
                headOptions: [
                    {label: 'User Setting', path: {name: 'myBCC-userSetting'}},
                    {label: 'Order', path: {name: 'myBCC-order'}},
                    {label: 'Resources', path: {name: 'myBCC-resources'}},
                    {label: 'Message', path: {name: 'myBCC-message'}}
                ],
                dropDown: false,
                headOptionDropDown: false,
            }
        },
        methods: {
            backHome(){
                this.$router.replace({
                    name: 'learner-courseList', query: {
                        ...this.exerciseInfo
                    }
                });
            }, hiddenPrompt(){
                this.dropDown = false;
                this.headOptionDropDown = false;
            },
            async downLoadTemplate(){
                const res = (await utils.sendAxiosGet('/api/tools/getDownLoadTemplate', ['levelId', 'lessonId'], {...this.exerciseInfo})).data;
                window.location.href = res.data["download_url"];
            }
        },
        created(){
        },
        computed: {
            ...mapState('index/exercise/index', {
                contentInfo: state => state.contentInfo
                , exerciseInfo: state => state.exerciseInfo
                , exerciseModuleName: state => state.exerciseModuleName
            }),
            headIcon(){
                let icon = "";
                switch (this.exerciseModuleName) {
                    case "Listening":
                        icon = require("~/assets/img/layout/listen-icon.png");
                        break;
                    case "Speaking":
                        icon = require("~/assets/img/layout/speak-icon.png");
                        break;
                    case "Reading":
                        icon = require("~/assets/img/layout/read-icon.png");
                        break;
                    case "Writing":
                        icon = require("~/assets/img/layout/write-icon.png");

                        break;
                }
                return icon;
            },
        },
        components: {}
    }
</script>

<style lang="less" scoped>
    .container {
        min-height: 6.38rem;
        position: relative;
    }

    .header {
        width: 100%;
        height: .76rem;
        background: linear-gradient(180deg, #4888d5, #4e94e6, #4889d6);
        position: absolute;
        top: 0;
        left: 0;
        @sideWidth: 18%;
        .head-logo {
            float: left;
            height: 100%;
            font-size: 28px;
            width: @sideWidth;
            position: relative;
            a {
                display: inline-block;
                color: #f7f8fd;
            }
            .logo-bd {
                cursor: pointer;
                min-width: .6rem;
                min-height: .6rem;
                margin: auto 0 auto 48%;
                background-color: #717f8c;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: url("~~assets/img/logo.svg") no-repeat;
                background-size: contain;
            }
        }
        .setting-drop-down {
            padding: .05rem .02rem .1rem .02rem;
            position: absolute;
            right: 1.6rem;
            top: .76rem;
            z-index: 9999;
            margin-top: .05rem;
            width: 3rem;
            border-radius: 5px;
            box-shadow: 0 4px 12px 4px #7F8CA0;
            background: white;
            &:before {
                content: "";
                display: block;
                border-bottom: 12px solid white;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                position: absolute;
                top: -12px;
                right: 16%;
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
            padding: .05rem .02rem .1rem .02rem;
            position: absolute;
            right: -1.7rem;
            top: .76rem;
            z-index: 9999;
            margin-top: .05rem;
            width: 2rem;
            border-radius: 5px;
            box-shadow: 0 4px 12px 4px #7F8CA0;
            background: white;
            &:before {
                content: "";
                display: block;
                border-bottom: 12px solid white;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                position: absolute;
                top: -12px;
                right: 16%;
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
                cursor: pointer;
                float: left;
                &.active {
                    transition: all .1s ease-in;
                    filter: drop-shadow(2px 2px 2px black);
                }
            }
            .head-icon {
                display: inline-block;
                min-width: 30px;
                min-height: 30px;
                border-radius: 50%;
                float: right;
                cursor: pointer;
                &.active {
                    transition: all .1s ease-in;
                    filter: drop-shadow(2px 2px 2px black);
                }
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
                font-family: GothamRounded-Medium;
                text-shadow: 1px 1px 4px black;
                vertical-align: middle;
                .overflow {
                    font-size: 30px;
                }
                .icon {
                    width: 50px;
                    vertical-align: middle;
                    margin: 0 40px 10px -40px;
                }
            }
        }
    }

    #container-wrap {
        height: 100%;
        padding: .76rem 0 1rem 0;
        box-sizing: border-box;
    }

    .footer {
        width: 100%;
        min-height: 1rem;
        margin-bottom: -50px;
        position: absolute;
        bottom: 0;
        left:0;
    }
</style>
