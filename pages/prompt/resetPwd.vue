<template>
    <div class="container">
        <!-- 200 用户信息获取成功 10012  Illegal request 20003 User does not exists 20024 Account has been disabled 20025 Account deleted 10025 Token expired. -->
        <template v-if="tokenStatus === 200">
            <article class="main">
                <div class="title-container"><h2 class="title">Reset Your Password</h2></div>
                <ul class="form-component" v-loading.body="loading">
                    <li class="question">
                        <label><em class="component-name">Email:</em>
                            <el-input class="component-input" name="email"
                                      v-model="userInfo.email" type="text"
                                      readonly>
                            </el-input>
                        </label>
                    </li>
                    <li class="question">
                        <label><em class="component-name">New Password:</em>
                            <el-input class="component-input" v-model="password" name="password"
                                      :class="passwordToggle&&!passwordValidate?'validateError':''"
                                      type="password" @focus="validate('passwordToggle')"
                                      placeholder="Please enter your password.">
                            </el-input>
                            <transition name="fade">
                                <em class="err-message"
                                    v-show="passwordToggle&&!passwordValidate">Your password must be between 6 - 20 characters, and must include a combination of letters and at least one number or symbol.</em>
                            </transition>
                        </label>
                    </li>
                    <li class="question">
                        <label><em class="component-name">Confirm Password:</em>
                            <el-input class="component-input"
                                      :class="confirmPasswordToggle&&password!==confirmPassword?'validateError':''"
                                      v-model="confirmPassword"
                                      type="password" @focus="validate('confirmPasswordToggle')"
                                      placeholder="Please confirm your password.">
                            </el-input>
                            <transition name="fade">
                                <em class="err-message" v-show="confirmPasswordToggle&&password!==confirmPassword">Make sure the password is entered twice.</em>
                            </transition>
                        </label>
                    </li>
                    <li>
                        <label>
                            <nuxt-link class="login-entry" :to="SIGN_IN_PATH">Back to Sign In?</nuxt-link>
                        </label>
                    </li>
                </ul>
                <button type="button" class="submit-btn" :disabled="preventSubmit" @click="preventSubmit || submit()">
                    Confirm Reset
                </button>
            </article>
        </template>
        <template v-else>
            <article class="content" v-loading.body="loading">
                <img :src="FAILURE_ICON_IMG" alt="tip" class="icon-img">
                <h2 class="tip-word">{{tip}}</h2>
                <p class="tip-sentence">
                    {{sentence}}
                </p>
                <nuxt-link v-show="tokenStatus === 10025" class="link-entry" :to="LOGIN_PATH">Go Login</nuxt-link>
                <nuxt-link v-show="tokenStatus === 10012" class="link-entry" :to="HOME_PATH">Go Home</nuxt-link>
                <nuxt-link v-show="tokenStatus === 20003" class="link-entry" :to="LOGIN_PATH">Go Login</nuxt-link>
                <nuxt-link v-show="tokenStatus === 20024" class="link-entry" :to="LOGIN_PATH">Go Login</nuxt-link>
                <nuxt-link v-show="tokenStatus === 20025" class="link-entry" :to="REGIST_PATH">Go Regist</nuxt-link>
            </article>
        </template>
    </div>
</template>
<script>
    import Vue from 'vue';
    import utils from '~/plugins/utils';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'
    import httpPath from "~/static/server.config.js";
    import axios from "axios";

    @Component({
        async fetch({store, query, isServer, redirect}){
            try {
                query.token || redirect('/home/login');
                await store.dispatch("index/prompt/resetPwd/isRegister", query);
            } catch (e) {
                redirect("/")
            }
        },
        data () {
            return {
                httpPath,
                preventSubmit: false,
                loading: false,
                SIGN_IN_PATH: {name: 'home-login'},
                passwordToggle: false,
                confirmPasswordToggle: false,
                email: "",
                password: "",
                confirmPassword: "",
                FORWARD_PATH: {name: 'prompt-success', query: {type: 5}},
                FORWARD_FAIL_PATH: {name: 'prompt-failure', query: {type: 2}},
                //接口回调地址
                httpRedirectPath: "/",
                validatePasswordError: false
            }
        },
        methods: {
            async submit(){
                if (this.passwordValidate && this.password === this.confirmPassword) {
                    this.preventSubmit = true;
                    this.loading = true;
                    try {
                        this.loading = true;
                        let res = await utils.sendAxiosGet("/api/user/resetPassword", ["uid", "email", "password"], {
                            uid: this.userInfo.uid,
                            email: this.userInfo.email,
                            password: this.password
                        });
                        this.loading = false;
                        if (+res.data.status_code === 200) {
                            this.$_success("Password Reset Successfully!");
                            setTimeout(() => {
                                this.$router.push(this.FORWARD_PATH);
                            }, 1500);
                        } else {
                            this.$router.push(this.FORWARD_FAIL_PATH);
                        }
                    } catch (e) {
                        this.preventSubmit = false;
                        this.loading = false;
                    }
                } else {
                    ["passwordToggle", "confirmPasswordToggle"].forEach(item =>
                        this[item] = true);
                    return void 0;
                }
            },
            validate(name){
                this[name] = true;
            },
        },
        computed: {
            ...mapState("index/prompt/resetPwd", {
                tokenStatus: state => +state.tokenStatus,
                userInfo: state => state.userInfo
            }),
            //校验输入内容
            passwordValidate() {
                return /^(\w){6,20}$/.test(this.password);
            },
            verificationCodeValidate(){
                return /^[a-zA-Z0-9]{4}$/.test(this.verificationCode);
            }
        },
        components: {}
    })
    export default class active extends Vue {
        HOME_PATH = {name: "index"};
        LOGIN_PATH = {name: "home-login"};
        REGIST_PATH = {name: "home-regist"};
        tip = "";
        SUCCESS_ICON_IMG = require('~/assets/img/home/success.svg');
        FAILURE_ICON_IMG = require('~/assets/img/home/failure.svg');
        forWardPath = {name: 'prompt-success', query: {type: 1}};
        email = "";
        uid = "";
        loading = false;
        sentence = "";

        created() {
            let data = {};
            switch (+this.tokenStatus) {
                //无效链接
                case 10012:
                    data = {
                        tip: "Invalid link",
                        sentence: "Sorry, your reset link is invalid!"
                    };
                    break;
                //链接失效
                case 10025:
                    data = {
                        tip: "Expired link",
                        sentence: "Sorry, your reset link is expired!"
                    }
                    break;
                //用户不存在
                case 20003:
                    data = {
                        tip: "Operation Failure",
                        sentence: "Your account is not registered yet!"
                    };
                    break;
                //20024 账号已经被禁用
                case 20024:
                    data = {
                        tip: "Operation Failure",
                        sentence: "Sorry, your reset link is invalid!"
                    };
                    break;
                //20025 账号已经被删除 去重新注册
                case 20025:
                    data = {
                        tip: "Operation Failure",
                        sentence: "Notice: Your account has not been registered yet!"
                    };
                    break;
            }
            utils.extend(true, this, data);
        }
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/element/prompt";

    .main {
        background: white;
        padding: 0 .2rem;
        float: right;
        box-shadow: 1px 1px 8px 2px #cccccc;
        left: 50%;
        top: 50%;
        width: 5.12rem;
        position: absolute;
        transform: translate(-50%, -50%);
    }

    .title-container {
        font-size: 20px;
        font-family: GothamRounded-Medium;
        text-align: center;
        margin: .5rem auto .38rem auto;
        width: 4.1rem;
        line-height: 1;
        height: .37rem;
        color: #607592;
        border-bottom: 2px solid #73A5C5;
        position: relative;
        &:after {
            content: "";
            display: block;
            position: absolute;
            bottom: -.13rem;
            border-left: .125rem solid transparent;
            border-right: .125rem solid transparent;
            border-top: .12rem solid #73A5C5;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    .form-component {
        width: 5.22rem;
        margin: 0 auto;
        display: block;
        .question {
            position: relative;
            &:after {
                position: absolute;
                display: block;
                transform: translateY(-55%);
                right: 10%;
                width: 16px;
                height: 16px;
                font-size: 14px;
                text-align: center;
                line-height: .16rem;
                top: 50%;
                border-radius: 50%;
                content: "?";
                color: #B8BDC4;
                border: 1px solid #B8BDC4;
                cursor: pointer;
            }
        }
    }

    .form-component > li {
        margin-top: .15rem;
        text-align: right;
        display: block;
        width: 100%;
        &:not(:last-child):before {
            content: "*";
            margin-right: .05rem;
            vertical-align: middle;
            color: red;
        }
        &:last-child {
            margin-top: .15rem;
        }
        .component-name {
            font-family: GothamRounded-Book;
            font-size: 14px;
            color: #7D8EA5;
            font-weight: bold;
            display: inline-block;
        }
        .component-input {
            width: 2.85rem;
            height: .4rem;
            margin-right: .86rem;
            border-radius: 5px;
            font-family: GothamRounded-Book;
            font-size: 14px;
            margin-left: .12rem;
            font-weight: bold;
            outline: none;
            color: lighten(black, 20%);
            &::-webkit-input-placeholder {
                color: #C2C7CE;
                text-indent: 4px;
            }
            &::-moz-placeholder {
                color: #C2C7CE;
                text-indent: 4px;
            }
            &:-ms-input-placeholder {
                color: #C2C7CE;
                text-indent: 4px;
            }
            &:-moz-placeholder {
                color: #C2C7CE;
                text-indent: 4px;
            }
        }
        .validateError {
            .el-input__inner {
                border: 1px solid lighten(red, 8%);
            }
        }
        .err-message {
            display: block;
            position: absolute;
            top: -.2rem;
            font-size: 12px;
            left: 1.52rem;
            color: red;
        }
        .code {
            width: 1.48rem;
            height: .4rem;
            margin-right: .08rem;
        }
        .vf-img {
            display: inline-block;
            vertical-align: top;
            width: 1.27rem;
            height: 34px;
            border: 1px solid lighten(#B8BDC4, 8%);
            margin-right: .86rem;
            border-radius: 5px;
            overflow: hidden;
            cursor: pointer;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .form-component :last-child {
        .login-entry {
            margin-right: .86rem;
            font-size: 14px;
            color: lighten(#8699C9, 10%);
            cursor: pointer;
            &:hover {
                color: lighten(#8699C9, -20%);
            }
        }
    }

    .submit-btn {
        margin: .3rem auto .4rem auto;
        width: 2.68rem;
        height: .4rem;
        font-family: GothamRounded-Medium;
        color: white;
        font-size: 16px;
        background: #607592;
        display: block;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-to {
        opacity: 0
    }
</style>