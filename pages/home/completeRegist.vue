<template>
    <div class="container">
        <div class="plan">
            <img src="~assets/img/home/login_img.png" alt="">
        </div>
        <article class="register">
            <h2 class="title">Please complete the information below</h2>
            <ul class="register-list" v-loading.body="loading">
                <li>
                    <label>
                        Inviter Educator:
                        <el-input class="register-input" name="educatorName"
                                  v-model="educatorName" type="text"
                                  readonly>
                        </el-input>
                    </label>
                </li>
                <li>
                    <label>
                        Class Name:
                        <el-input class="register-input" name="className"
                                  v-model="className" type="text"
                                  readonly>
                        </el-input>
                    </label>
                </li>
                <li>
                    <label>
                        Email:
                        <el-input class="register-input" @focus="validate('emailToggle')" name="email"
                                  v-model="email" type="text"
                                  :class="emailToggle&&!emailValidate?'validateError':''"
                                  placeholder="Please enter your email.">
                        </el-input>
                        <transition name="fade">
                            <em class="err-message" v-show="emailToggle&&!emailValidate">Please enter a valid email address.</em>
                        </transition>
                    </label>
                    <el-tooltip class="item" effect="dark" placement="top">
                        <div slot="content"><span v-html="accountTips"></span></div>
                        <div class="hint">?</div>
                    </el-tooltip>
                </li>
                <li>
                    <label>
                        New Password:
                        <el-input class="register-input" v-model="password" name="password"
                                  :class="passwordToggle&&!passwordValidate?'validateError':''"
                                  type="password" @focus="validate('passwordToggle')"
                                  placeholder="Please enter your password.">
                        </el-input>
                        <transition name="fade">
                            <em class="err-message" v-show="passwordToggle&&passwordValidate">Password must be between 6 - 20 characters.</em>
                        </transition>
                    </label>
                    <el-tooltip class="item" effect="dark" placement="top">
                        <div slot="content"><span v-html="passwordTips"></span></div>
                        <div class="hint">?</div>
                    </el-tooltip>
                </li>
                <li>
                    <label>
                        Confirm Password:
                        <el-input class="register-input"
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
                    <label class="checkbox-label">
                        <input type="checkbox" @click="agreeCheckbox=!agreeCheckbox"
                               class="checkbox">
                        <em class="checkbox-legend">I agree 
                            <nuxt-link :to="{name: 'terms'}" target="_blank">Terms of Use</nuxt-link>
                        </em>
                    </label>
                </li>
                <li>
                    <button class="sign-btn" type="button" :disabled="!agreeCheckbox"
                            @click="preventSubmit || submitForm()">
                        Submit
                    </button>
                </li>
            </ul>
        </article>
    </div>
</template>
<script>
    import httpPath from "~/static/server.config.js";
    import axios from "axios";
    export default {
        asyncData({isServer, query, route, redirect}){
            if (!query.uid) {
                isServer && redirect('/home/login');
            }
            return {
                uid: query.uid,
                className: query.className,
                educatorName: query.educatorName
            }
        },
        data () {
            return {
                httpPath,
                preventSubmit: false,
                accountTips: "Your email address",
                passwordTips: "Your password must be between 6 - 20 characters, <br/>and must include a combination of letters <br/>and at least one number or symbol.",
                passwordToggle: false,
                confirmPasswordToggle: false,
                agreeCheckbox: false,
                loading: false,
                emailToggle: false,
                uid: "",
                email: "",
                password: "",
                confirmPassword: "",
                FORWARD_PATH: {name: 'prompt-success', query: {type: 1}},
                //接口回调地址
                httpRedirectPath: "/"
            }
        },
        methods: {
            async submitForm(){
                if (this.emailValidate && this.passwordValidate && this.password === this.confirmPassword) {
                    this.preventSubmit = true;
                    this.loading = true;
                    try {
                        let res = await  axios({
                            url: `${this.httpPath}/api/user/save`,
                            method: 'post',
                            data: {uid: this.uid, username: this.email, password: this.password},
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
                        const data = res.data;
                        const error = res.data.error;
                        if (data["status_code"] && +data["status_code"] === 200) {
                            this.$_success("Submitted successfully, go to your mailbox to activate your account!");
                            this.preventSubmit = false;
                            this.loading = false;
                            setTimeout(() => {
                                this.$router.push(this.FORWARD_PATH);
                            }, 1500);
                        } else if (data["status_code"] && +data["status_code"] === 20008) {
                            this.$_message("The user email address already exists.");
                            this.preventSubmit = false;
                            this.loading = false;
                        } else if (data["status_code"] && +data["status_code"] === 20012) {
                            this.$_message("Failed to update the information, please try again later.");
                            this.preventSubmit = false;
                            this.loading = false;
                        } else if (Object.keys(error).length) {
                            for (let key in data.error) {
                                setTimeout(() => {
                                    this.$notify.error({
                                        title: 'error',
                                        message: data.error[key][0],
                                    });
                                })
                            }
                            this.preventSubmit = false;
                            this.loading = false;
                        }
                    } catch (e) {
                        this.preventSubmit = false;
                        this.loading = false;

                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                } else {
                    //如果没校验成功 显示所有错误信息
                    ["emailToggle", "passwordToggle", "confirmPasswordToggle"].forEach(item =>
                        this[item] = true);
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
            }
        },
        components: {}
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/element/home";
</style>