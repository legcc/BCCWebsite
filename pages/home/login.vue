<template>
    <div class="container">
        <div class="plan">
            <img src="~assets/img/home/login_img.png" alt="">
        </div>
        <article class="login">
            <h2 class="title">Login BCC Mandarin</h2>
            <div class="content">
                <form ref="loginForm" @submit.prevent v-loading.body="loading">
                    <div class="shell">
                        <label class="option">
                            <span class="option-name"><em>*</em> Account:</span>
                            <el-input name="username" v-model="username" class="option-input" type="text"
                                      @focus="usernameValidateToggle=true"
                                      :class="usernameValidateToggle&&validateUserName&&'validateError'"
                                      placeholder="Enter your email or user name.">
                            </el-input>
                            <transition name="fade">
                                <em class="err-message" v-show="usernameValidateToggle&&validateUserName">
                                    Please enter the correct format of the account.</em>
                            </transition>
                        </label>
                        <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content"><span v-html="accountTips"></span></div>
                            <div class="hint">?</div>
                        </el-tooltip>
                    </div>
                    <div class="shell">
                        <label class="option">
                            <span class="option-name"><em>*</em> Password:</span>
                            <el-input name="password" v-model="password" class="option-input"
                                      type="password"
                                      @focus="passwordValidateToggle=true"
                                      :class="passwordValidateToggle&&validatePassword&&'validateError'"
                                      placeholder="Please enter your password.">
                            </el-input>
                            <transition name="fade">
                                <em class="err-message" v-show="passwordValidateToggle&&validatePassword">Password must be between 6 - 20 characters.</em>
                            </transition>
                        </label>
                        <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content"><span v-html="passwordTips"></span></div>
                            <div class="hint">?</div>
                        </el-tooltip>
                    </div>
                    <aside class="login-aside">
                        <label>
                            <input type="checkbox" class="aside-checkbox">
                            <em class="checkbox-legend">Remember Me</em>
                        </label>
                        <nuxt-link :to="FORGET_PASSWORD_PATH" class="link-entry">Forgot password?
                        </nuxt-link>
                    </aside>
                    <button class="sign-btn" type="submit" :disabled="!submitPrevent"
                            @click="submitPrevent && submitForm()">Sign In
                    </button>
                </form>

            </div>
        </article>
    </div>
</template>
<script>
    import utils from '~/plugins/utils';
    import axios from 'axios';
    export default {
        data () {
            return {
                usernameValidateToggle: false,
                passwordValidateToggle: false,
                loading: false,
                accountTips: "Email or username.",
                passwordTips: "Your password must be between 6 - 20 characters, <br/>and must include a combination of letters <br/>and at least one number or symbol.",
                username: "",
                password: "",
                submitPrevent: true,
                FORGET_PASSWORD_PATH: {name: 'home-forgetPwd'}
            }
        },
        methods: {
            async submitForm(){
                if (this.validateUserName && this.validatePassword) {
                    this.usernameValidateToggle = true;
                    this.passwordValidateToggle = true;
                    return;
                }
                this.submitPrevent = false;
                this.loading = true;
                try {
                    let res = await axios.post(this.httpPath.replace("/proxy", "") + "/api/login", {data: JSON.parse(utils.serialize(this.$refs.loginForm))});
                    let message = "";
                    let success = "";
                    let isActive = true;
                    let unRegist = false;
                    //20017,用户未完成注册信息，去完成注册信息页面；
                    switch (+res.data.status_code) {
                        case 20017 :
                            unRegist = true;
                            break;
                        case 20007 :
                            message = "Account not activated.";
                            isActive = false;
                            break;
                        case 20018 :
                            message = "Account disabled."
                            break;
                        case 20019 :
                            message = "Your account has been deleted."
                            break;
                        case 20006 :
                            message = "Your password do not match the account."
                            break;
                        case 20003 :
                            message = "User does not exists."
                            break;
                        case 500 :
                            message = "Login failed. Please try later!"
                            break;
                        case 200 :
                            success = "Welcome to BCC Mandarin!"
                            break;
                    }
                    this.loading = false;
                    message && this.$_message(message);
                    message ? this.submitPrevent = true : void(0);
                    message ? this.loading = false : void(0);
                    success && this.$_success(success);
                    let FORWARD_PATH = "/";
                    //如果未激活
                    if (!isActive) {
                        const data = res.data.data;
                        FORWARD_PATH = {
                            name: 'prompt-failure',
                            query: {
                                type: 1,
                                uid: data.uid,
                                email: data.email
                            }
                        };
                        setTimeout(() => {
                            this.$router.push(FORWARD_PATH);
                        }, 1000);
                    } else if (unRegist) {
                        const data = res.data.data;
                        FORWARD_PATH = {
                            name: 'home-completeRegist',
                            query: {
                                uid: data.uid,
                                className: data.className,
                                educatorName: data.educatorName
                            }
                        };
                        this.$router.push(FORWARD_PATH);
                    } else {
                        //如果已激活
                        success && setTimeout(() => {
                            const data = res.data.data;
                            switch (+data.customerType) {
                                case 1:
                                    FORWARD_PATH = "/learner";
                                    break;
                                case 2:
                                    FORWARD_PATH = "/educator";
                                    break;
                                default:
                                    break;
                            }
                            window.location.href = `http://${window.location.host}${FORWARD_PATH}`;
                        }, 1000);
                    }
                } catch (e) {
                    this.submitPrevent = true;
                    this.loading = false;
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            }
        },
        created(){
        },
        computed: {
            validateUserName(){
                return !(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this.username) || /^\w{6,}$/.test(this.username))
            }, validatePassword(){
                return !/^\w{5,17}$/.test(this.password);
            }
        },
        components: {}
    }
</script>
<style lang="less">
    @import "~~assets/less/element/home";
</style>