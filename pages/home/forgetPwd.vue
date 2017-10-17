<template>
    <div class="container">
        <article class="main">
            <div class="title-container"><h2 class="title">Forget Password</h2></div>
            <ul class="form-component" v-loading.body="loading">
                <li class="question">
                    <label>
                        <em class="component-name">Email:</em>
                        <el-input class="component-input" @focus="validate('emailToggle')" name="email"
                                  v-model="email" type="text"
                                  :class="emailToggle&&!emailValidate?'validateError':''"
                                  placeholder="Please enter your email.">
                        </el-input>
                        <transition name="fade">
                            <em class="err-message" v-show="emailToggle&&!emailValidate">Please enter a valid email address.</em>
                        </transition>
                    </label>
                </li>
                <li>
                    <label>
                        <em class="component-name">Verification Code:</em>
                        <el-input type="text" v-model="vfCode" class="component-input code" placeholder="Enter Code.">
                        </el-input>
                    </label>
                    <div class="vf-img">
                        <img ref="vfCode" @click="changeVFCode($event)" :src="VF_CODE_PATH" alt="">
                    </div>
                </li>
                <li>
                    <label>
                        <nuxt-link class="login-entry" :to="SIGN_IN_PATH">Back to Sign In?</nuxt-link>
                    </label>
                </li>
            </ul>
            <button type="button" class="submit-btn" :disabled="preventSubmit" @click="preventSubmit || submit()">
                Send Reset Email
            </button>
        </article>
    </div>
</template>
<script>
    import httpPath from "~/static/server.config.js";
    import axios from "axios";
    export default {
        data () {
            return {
                httpPath,
                preventSubmit: false,
                loading: false,
                SIGN_IN_PATH: {name: 'home-login'},
                VF_CODE_PATH: `${httpPath}/api/captcha_img?${Math.random()}`,
                emailToggle: false,
                email: "",
                FORWARD_PATH: {name: 'prompt-success', query: {type: 2}},
                vfCode: "",
                //接口回调地址
                httpRedirectPath: "/"
            }
        },
        methods: {
            changeVFCode(event){
                this.$refs.vfCode.src = this.$refs.vfCode.src + "?" + Math.random();
            },
            async submit(){
                if (this.emailValidate && this.vfCode) {
                    this.preventSubmit = true;
                    this.loading = true;
                    try {
                        let res = await  axios({
                            url: this.httpPath + "/api/user/forgotPassword",
                            method: 'post',
                            data: {
                                email: this.email,
                                captcha: this.vfCode,
                                redirect_url: this.httpRedirectPath
                            },
                            transformRequest: [
                                function (data) {
                                    let ret = '';
                                    for (let it in data) {
                                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                                    }
                                    return ret;
                                }
                            ],
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        });
                        this.preventSubmit = false;
                        this.loading = false;
                        const data = res.data;
                        const error = res.data.error;
                        console.log(data.status_code);
                        if (data.status_code && data.status_code === 200) {
                            this.$_success("Submitted successfully!");
                            setTimeout(() => {
                                this.preventSubmit = false;
                                this.loading = false;
                                this.$router.push(this.FORWARD_PATH);
                            }, 1500);
                        } else if (data.status_code && data.status_code === 20009) {
                            this.$_message("The email address is not a exist user account.");
                            this.preventSubmit = false;
                            this.loading = false;
                        } else if (Object.keys(error).length) {
                            for (let key in error) {
                                setTimeout(() => {
                                    this.$notify.error({
                                        title: 'error',
                                        message: error[key][0],
                                    });
                                })
                            }
                            this.changeVFCode();
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
                    this.emailToggle = true;
                }
            },
            validate(name){
                this[name] = true;
            }
        },
        created(){
        },
        computed: {
            emailValidate(){
                return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this.email);
            }
        },
        components: {}
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/element/home";
</style>