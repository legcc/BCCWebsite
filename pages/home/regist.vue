<template>
    <div class="container">
        <div class="plan">
            <img src="~assets/img/home/login_img.png" alt="">
        </div>
        <article class="register">
            <form ref="registerForm" v-loading.body="loading">
                <div class="role-radio">
                    <label class="option" :class="titleHeightLight?'height-light':''"
                           @click="movePointer('Educator',$event)">Learner
                        <input type="radio" checked name="customerType" value="1" class="radio">
                    </label>
                    <label class="option" :class="!titleHeightLight?'height-light':''"
                           @click="movePointer('Learner',$event)">Educator
                        <input type="radio" name="customerType" value="2" class="radio">
                    </label>
                    <i class="pointer" :class="pointerToggle?'learner':'educator'" ref="pointer"></i>
                </div>
                <ul class="register-list">
                    <li>
                        <label>Email:
                            <el-input class="register-input" @focus="validate('emailToggle')" name="email"
                                      v-model="email" type="text"
                                      :class="emailToggle&&!emailValidate?'validateError':''"
                                      placeholder="Please enter your email.">
                            </el-input>
                            <transition name="fade">
                                <em class="err-message"
                                    v-show="emailToggle&&!emailValidate">Please enter a valid email address.</em>
                            </transition>
                        </label>
                        <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content"><span v-html="accountTips"></span></div>
                            <div class="hint">?</div>
                        </el-tooltip>
                    </li>
                    <li>
                        <label>Password:
                            <el-input v-model="password" name="password"
                                      @focus="validate('passwordToggle')"
                                      :class="passwordToggle&&!passwordValidate?'validateError':''"
                                      class="register-input" type="password"
                                      placeholder="Please enter your password.">
                            </el-input>
                            <transition name="fade">
                                <em class="err-message"
                                    v-show="passwordToggle&&!passwordValidate">Password must be between 6 - 20 characters.</em>
                            </transition>
                        </label>
                        <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content"><span v-html="passwordTips"></span></div>
                            <div class="hint">?</div>
                        </el-tooltip>
                    </li>
                    <li>
                        <label>Confirm Password:
                            <el-input
                                    :class="confirmPasswordToggle&&password!==confirmPassword?'validateError':''"
                                    v-model="confirmPassword" class="register-input"
                                    type="password" @focus="validate('confirmPasswordToggle')"
                                    placeholder="Please confirm your password.">
                            </el-input>
                            <transition name="fade">
                                <em class="err-message" v-show="confirmPasswordToggle&&password!==confirmPassword">Password must be between 6 - 20 characters.</em>
                            </transition>
                        </label>
                    </li>
                    <li><label>Verification code:
                        <el-input name="captcha"
                                  :class="verificationCodeToggle&&!verificationCodeValidate?'validateError':''"
                                  @focus="validate('verificationCodeToggle')"
                                  v-model="verificationCode" type="text"
                                  class="register-input vf-code"
                                  placeholder="Enter Code.">
                        </el-input>
                    </label>
                        <!--
                         <img class="vf-img" @click="changeVFCode" ref="vfCode" src="" alt="">
                       	-->
                        <img class="vf-img" @click="changeVFCode" ref="vfCode"
                             :src="VF_CODE_PATH" alt="">
                        <transition name="fade">
                            <em class="err-message"
                                v-show="verificationCodeToggle&&!verificationCodeValidate">Please enter the correct two-dimensional code.</em>
                        </transition>
                    </li>
                    <li>
                        <label class="checkbox-label">
                            <input type="checkbox" @click="agreeCheckbox=!agreeCheckbox" class="checkbox">
                            <em class="checkbox-legend">I agree
                                <nuxt-link :to="{name: 'terms'}" target="_blank">Terms of Use</nuxt-link>
                            </em>
                        </label>
                    </li>
                    <li>
                        <button class="sign-btn" type="button" :disabled="!agreeCheckbox"
                                @click="preventSubmit || submitForm()">
                            Sign Up
                        </button>
                    </li>
                </ul>
            </form>
        </article>
    </div>
</template>
<script>
    import axios from 'axios';
    import utils from '~/plugins/utils';
    import httpPath from "~/static/server.config.js";
    export default {
        data () {
            return {
                pointerToggle:false,
                VF_CODE_PATH: `${httpPath}/api/captcha_img?${Math.random()}`,
                FORWARD_PATH: {name: 'prompt-success', query: {type: 1}},
                accountTips: "Email or username.",
                passwordTips: "Your password must be between 6 - 20 characters, <br/>and must include a combination of letters <br/>and at least one number or symbol.",
                emailToggle: false,
                passwordToggle: false,
                confirmPasswordToggle: false,
                verificationCodeToggle: false,
                agreeCheckbox: false,
                titleHeightLight: true,
                preventSubmit: false,
                loading: false,
                email: "",
                password: "",
                confirmPassword: "",
                verificationCode: "",
                validatePasswordError: false
            }
        },
        methods: {
            movePointer(name, event){
                const dom = this.$refs.pointer;
                switch (name) {
                    case "Learner" :
                        this.titleHeightLight = false;
                        this.pointerToggle = true;
                        break;
                    case "Educator" :
                        this.titleHeightLight = true;
                        this.pointerToggle = false;
                        break;
                }
            },
            changeVFCode(){
                this.$refs.vfCode.src = this.$refs.vfCode.src + "?" + Math.random();
            },
            async submitForm(){
                //如果全都校验成功
                if (this.emailValidate && this.passwordValidate && this.password === this.confirmPassword && this.verificationCode) {
                    this.preventSubmit = true;
                    this.loading = true;
                    try {
                        let res = await axios({
                            url: `${this.httpPath}/api/user/register`,
                            method: 'post',
                            data: JSON.parse(utils.serialize(this.$refs.registerForm)),
                            transformRequest: [function (data) {
                                // Do whatever you want to transform the data
                                let ret = ''
                                for (let it in data) {
                                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                                }
                                return ret
                            }],
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        });
                        let data = res.data;
                        this.preventSubmit = false;
                        this.loading = false;
                        if (data["status_code"] && +data["status_code"] === 200) {
                            this.$_success("Submitted successfully, please go to your email and follow the instructions.");
                            setTimeout(() => {
                                this.$router.push(this.FORWARD_PATH);
                            }, 1500);
                        } else if (Object.keys(data.error).length) {
                            for (let key in data.error) {
                                setTimeout(() => {
                                    this.$notify.error({
                                        title: 'error',
                                        message: data.error[key][0],
                                    });
                                })
                            }
                            this.changeVFCode();
                            this.preventSubmit = false;
                            this.loading = false;
                        } else {
                            setTimeout(() => {
                                //Mark By Allen
                                //window.location.reload();
                            }, 1000);
                            this.changeVFCode();
                            this.preventSubmit = false;
                            this.loading = false;
                        }
                    } catch (e) {
                        this.preventSubmit = false;
                        this.loading = false;
                        this.changeVFCode();
                        console.error(e);
                    }
                } else {
                    //如果没校验成功 显示所有错误信息
                    ["emailToggle", "passwordToggle", "confirmPasswordToggle",
                        "verificationCodeToggle"].forEach(item =>
                        this[item] = true);
                    //return void 0;
                    this.changeVFCode();
                    this.preventSubmit = false;
                    this.loading = false;
                }
            },
            validate(name){
                this[name] = true;
            }
        },
        created(){
        },
        computed: {
            //校验输入内容
            emailValidate(){
                return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this.email);
            }, passwordValidate() {
                return /^(\w){6,20}$/.test(this.password);
            }, verificationCodeValidate() {
                return /^[a-zA-Z0-9]{4}$/.test(this.verificationCode);
            }
        },
        components: {}
    }
</script>
<style lang="less">
    @import "~~assets/less/element/home";
</style>