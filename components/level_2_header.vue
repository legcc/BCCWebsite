<template>
    <div class="container">
        <div class="header">
            <div class="head-logo">
                <i class="logo-bd" @click="backHome"></i>
            </div>
            <div class="head-tool">
                <div class="icon-container">
                    <i class="setting-icon" @click="dropDown=!dropDown"><img
                            src="~assets/img/main_content/layouts/header/coursepage-setup.png"
                            alt=""></i>
                    <i class="head-icon"><img src="~assets/img/main_content/layouts/header/userHead-icon.png"
                                              alt=""></i>
                </div>
                <transition name="el-zoom-in-top">
                    <ul class="head-drop-down" v-show="dropDown">
                        <nuxt-link :to="item.path" :key="index"
                                   v-for="(item,index) in setUpOptions">
                            <li class="list">
                                {{item.label}}
                            </li>
                        </nuxt-link>
                    </ul>
                </transition>
            </div>
            <div class="head-content">
                <h1 class="title">
                    <img :src="headIcon" class="icon">
                    <em class="title-text">{{contentInfo.page_title}}</em></h1>
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
    import {mapState} from 'vuex';

    export default {
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
                    {label: 'Pinyin off', path: {name: 'index'}},
                    {label: 'Download Word Template', path: {name: 'myBCC-message'}}
                ],
                dropDown: false,
            }
        },
        methods: {
            backHome(){
                this.$router.replace({
                    name: 'learner-courseList', query: {
                        ...this.exerciseInfo
                    }
                });
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
        background: linear-gradient(180deg, #092506, #0e3413, #061804);
        position: absolute;
        top: 0;
        @sideWidth: 18%;
        .head-drop-down {
            padding: .05rem .02rem .1rem .02rem;
            position: absolute;
            right: 1.6rem;
            top: .76rem;
            z-index: 9999;
            margin-top: .05rem;
            width: 3rem;
            min-height: 1.49rem;
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
                cursor: pointer;
                display: inline-block;
                min-width: 30px;
                min-height: 30px;
                border-radius: 50%;
                float: left;
            }
            .head-icon {
                display: inline-block;
                min-width: 30px;
                min-height: 30px;
                border-radius: 50%;
                float: right;
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
                .icon {
                    width: 50px;
                    vertical-align: middle;
                    margin: 0 40px 10px -40px;
                }
                .title-text {
                    vertical-align: middle;
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

    }
</style>
