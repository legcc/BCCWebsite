<template>
    <div class="container">
        <article class="content" v-loading.body="loading">
            <template v-if="tokenStatus === 200">
                <img :src="SUCCESS_ICON_IMG" alt="tip" class="icon-img">
            </template>
            <template v-else>
                <img :src="FAILURE_ICON_IMG" alt="tip" class="icon-img">
            </template>
            <h2 class="tip-word">{{tip}}</h2>
            <p class="tip-sentence">
                {{sentence}}
            </p>
            <a v-show="tokenStatus === 10025" @click.prevent="resendEmail" class="link-entry">Resend Email</a>
            <nuxt-link v-show="tokenStatus === 200" class="link-entry" :to="LOGIN_PATH">Go Login</nuxt-link>
            <nuxt-link v-show="tokenStatus === 10012" class="link-entry" :to="HOME_PATH">Go Home</nuxt-link>
            <nuxt-link v-show="tokenStatus === 20022" class="link-entry" :to="LOGIN_PATH">Go Login</nuxt-link>
            <nuxt-link v-show="tokenStatus === 20023" class="link-entry" :to="LOGIN_PATH">Go Login</nuxt-link>
            <nuxt-link v-show="tokenStatus === 20024" class="link-entry" :to="LOGIN_PATH">Go Login</nuxt-link>
            <nuxt-link v-show="tokenStatus === 20025" class="link-entry" :to="REGIST_PATH">Go Regist</nuxt-link>
            <!--//10012//不存在 10025//失效 再发邮件 //200激活成功 去登录   //20022已经激活 去登录 //20023已经激活 去登录 //20024 账号已经被禁用  //20025 账号已经被删除 去重新注册-->
        </article>
    </div>
</template>
<script>
    import Vue from 'vue';
    import utils from '~/plugins/utils';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'

    @Component({
        async fetch({store, query, isServer, redirect}){
            try {
                query.token || redirect('/home/login');
                await store.dispatch("index/prompt/activate/isRegisterActivate", query);
            } catch (e) {
                redirect("/")
            }
        },
        computed: {
            ...mapState("index/prompt/activate", {
                tokenStatus: state => +state.tokenStatus,
                userInfo: state => state.userInfo
            }),
        },
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
                //无效激活链接
                case 10012:
                    data = {
                        tip: "Invalid activation link",
                        sentence: "Sorry, your activation link is invalid!",
                    };
                    break;
                //注册信息提交成功
                case 200:
                    data = {
                        tip: "Information submitted",
                        sentence: "Congratulations! Your account has been activated successfully!",
                    };
                    break;
                //激活链接失效
                case 10025:
                    data = {
                        tip: "Activation link Expired",
                        sentence: "Sorry, your activation link is expired!",
                    }
                    break;
                //该账号为激活状态(未完成注册)
                case 20022:
                    data = {
                        tip: "Operation Failure",
                        sentence: "Your account has already been activated!",
                    };
                    break;
                //该账号为激活状态
                case 20023:
                    data = {
                        tip: "Operation Failure",
                        sentence: "Your account has already been activated!",
                    };
                    break;
                //20024 账号已经被禁用
                case 20024:
                    data = {
                        tip: "Operation Failure",
                        sentence: "Your account has been disabled!",
                    };
                    break;
                //20025 账号已经被删除 去重新注册
                case 20025:
                    data = {
                        tip: "Operation Failure",
                        sentence: "Your account is not registered yet!",
                    };
                    break;
            }
            utils.extend(true, this, data);
        }

        async resendEmail() {
            try {
                this.loading = true;
                let res = await utils.sendAxiosGet("/api/user/sendActivationMail", ["uid", "email"], {
                    uid: this.userInfo.uid,
                    email: this.userInfo.email
                });
                this.loading = false;
                +res.data.status_code === 200 && (() => {
                    this.$message.success(res.data.message);
                    this.$router.push(this.forWardPath);
                })();
            } catch (e) {
                console.error(e);
                this.loading = false;
                this.$_error("Email send failure!");
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/element/prompt";
</style>