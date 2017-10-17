<template>
    <div class="change-password-container">
        <header class="header">
            <h2 class="title">{{title}}</h2>
        </header>
        <article class="article" v-if="moduleName==='password'">
            <aside class="tips">
                <em class="tips-legend">Recommended you change the password periodically to protect account security.</em>
                <em class="tips-legend">Your password must be between 6 - 20 characters, and must include a combination of letters and at least one number or symbol.</em>
            </aside>
            <form class="change-password-form" v-loading="newPasswordLoading">
                <ul>
                    <li><label><em class="option-name">Original Password:</em>
                        <span class="option-component">
                            <input type="password"
                                   @focus="oldPasswordToggle=true"
                                   class="component-input-inner" v-model="oldPassword"></span>
                        <transition name="fade">
                            <em class="err-message"
                                v-show="oldPasswordToggle&&!oldPasswordValidate">Please enter a valid password.</em>
                        </transition>
                    </label>
                    </li>
                    <li><label><em class="option-name">New Password:</em>
                        <span class="option-component">
                            <input type="password"
                                   @focus="passwordToggle=true"
                                   class="component-input-inner" v-model="password"></span>
                        <transition name="fade">
                            <em class="err-message"
                                v-show="passwordToggle&&!passwordValidate">Please enter a valid password.</em>
                        </transition>
                    </label></li>
                    <li><label><em class="option-name">Confirm News Password:</em>
                        <span class="option-component">
                            <input type="password"
                                   @focus="confirmPasswordToggle=true"
                                   class="component-input-inner" v-model="confirmPassword"></span>
                        <transition name="fade">
                            <em class="err-message"
                                v-show="confirmPasswordToggle&&!confirmPasswordValidate">Make sure to match the password entry.</em>
                        </transition>
                    </label>
                    </li>
                </ul>
                <section class="button-section">
                    <button type="button" class="confirm-button" @click="changePassword">Confirm</button>
                    <nuxt-link :to="BACK_PAGE" tag="button" class="cancel-button">Cancel</nuxt-link>
                </section>
            </form>
        </article>
        <!--email-->
        <article class="article" v-if="moduleName==='email'">
            <aside class="tips">
                <em class="tips-legend">Recommended you change the email periodically to protect account security.</em>
            </aside>
            <!--验证新邮箱-->
            <form class="change-email-form" v-if="changeEmail" v-loading="newEmailLoading">
                <ul>
                    <li><label><em class="option-name">Current Email:</em>
                        <span class="option-component">
                                <input type="text"
                                       class="component-input-inner" v-model="userInfo.email" disabled></span>
                    </label>
                    </li>
                    <li><label><em class="option-name">New Email:</em>
                        <span class="option-component">
                                 <input type="email"
                                        @focus="emailToggle=true"
                                        class="component-input-inner" v-model="email"></span>
                        <transition name="fade">
                            <em class="err-message"
                                v-show="emailToggle&&!emailValidate">Please enter a valid email.</em>
                        </transition>
                        <button class="send-active-code" :class="cooling||'disabled'" type="button"
                                @click="cooling && sendEmailCode('new')">
                            {{activeCodeText}}
                        </button>
                    </label></li>
                    <li><label><em class="option-name">New Email Activate Code:</em>
                        <span class="option-component">
                                <input type="text"
                                       class="component-input-inner" v-model="newEmailVFCode"></span>
                    </label>
                    </li>
                </ul>
                <section class="button-section">
                    <button type="button" class="confirm-button" @click="submit">Confirm</button>
                    <nuxt-link :to="BACK_PAGE" tag="button" class="cancel-button">Cancel</nuxt-link>
                </section>
            </form>
            <!--验证当前邮箱-->
            <form class="change-email-form" v-if="!changeEmail" v-loading="loading">
                <ul>
                    <li><label><em class="option-name">Current Email:</em>
                        <span class="option-email">
                                {{userInfo.email}}
                            </span>
                        <button type="button" class="send-active-code" :class="cooling||'disabled'"
                                @click="cooling && sendEmailCode('old')">
                            {{activeCodeText}}
                        </button>
                    </label>
                    </li>
                    <li><label>
                        <em class="option-name">Email Verify Code:</em>
                        <span class="option-component">
                                <input type="text"
                                       class="component-input-inner" v-model="oldEmailVFCode"></span>
                    </label></li>
                </ul>
                <section class="button-section">
                    <button type="button" class="confirm-button" @click="checkVFCode">Confirm</button>
                    <nuxt-link :to="BACK_PAGE" tag="button" class="cancel-button">Cancel</nuxt-link>
                </section>
            </form>

        </article>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapActions} from 'vuex';
    import utils from '~/plugins/utils';
    export default {
        asyncData({isServer, query, redirect}){
            const indexEntryName = "/myBCC";
            isServer && redirect(indexEntryName);
            if (query.module) {
                return {
                    moduleName: query.module
                }
            }
        },
        data () {
            return {
                moduleName: "",
                loading: false,
                CURRENT_PATH: [{
                    name: "Security Center",
                    url: "myBCC-userSetting"
                }],
                newEmailLoading: false,
                newPasswordLoading: false,
                activeCodeText: 'Send Verify Code',
                //显示更换新邮箱页面  默认是隐藏的 先显示验证老邮箱页面
                changeEmail: false,
                emailToggle: false,
                //送验证码的冷却
                cooling: true,
                //冷却时间
                coolNum: 120,
                email: "",
                oldEmailVFCode: "",
                newEmailVFCode: "",
                oldPassword: '',
                password: '',
                confirmPassword: '',
                oldPasswordToggle: false,
                passwordToggle: false,
                confirmPasswordToggle: false,
                BACK_PAGE: {name: 'myBCC-userSetting', query: {moduleName: 'security'}},
                NEW_EMAIL_PATH: {name: 'myBCC-securityCenter', query: {module: 'newEmail'}},
                FOR_WARD_PATH: {name: 'prompt-success', query: {type: 3}}
            }
        },
        methods: {
            async changePassword(){
                if (this.oldPasswordValidate && this.passwordValidate && this.confirmPasswordValidate) {
                    this.newPasswordLoading = true;
                    let res = await utils.sendAxiosPost("/api/user/changePassword", {
                        uid: this.userInfo.uid,
                        oldpassword: this.oldPassword,
                        password: this.password
                    });
                    this.newPasswordLoading = false;
                    if (res.status === 200 && res.data.status_code === 200) {
                        this.$_message('Password changed successfully!');
                        setTimeout(() => {
                            this.$router.push(this.BACK_PAGE);
                        }, 1500);
                    } else if (res.status === 200 && res.data.status_code === 10013) {
                        this.$_message('Password change failed!');
                    } else if (res.status === 200 && res.data.status_code === 20003) {
                        this.$_message('User information error, please login again!');
                    } else if (res.status === 200 && res.data.status_code === 20016) {
                        this.$_message('Your current password is not correct!');
                    } else {
                        this.$_message('Password changed failed!');
                    }
                } else {
                    this.$_message('Please input your password as instructed!');
                }
            },
            async submit(){
                try {
                    this.newEmailLoading = true;
                    if (this.emailValidate && this.newEmailVFCode) {
                        let res = await utils.sendAxiosPost("/api/user/changeEmail", {
                            uid: this.userInfo.uid,
                            email: this.email,
                            code: this.newEmailVFCode
                        });
                        this.newEmailLoading = false;
                        if (res.data.status_code === 200) {
                            this.$_success('Mailbox modification successful ！');
                            setTimeout(() => {
                                this.$router.push(this.FOR_WARD_PATH);
                            }, 1000)
                        } else {
                            this.$_error('New mailbox validation failed');
                        }
                    } else {
                        this.$_warning('Please fill in the correct form information');
                    }
                } catch (e) {
                    this.newEmailLoading = false;
                    console.error(e)
                }
            },
            async checkVFCode(){
                let data;
                try {
                    this.loading = true;
                    this.oldEmailVFCode ? data = (await utils.sendAxiosGet('/api/user/checkEmailCode', ['uid', 'code'], {
                        ...this.userInfo,
                        code: this.oldEmailVFCode
                    })).data : void(0);
                    this.loading = false;
                    if (data.status_code === 200) {
                        this.changeEmail = true;
                        this.coolNum = 0;
                        this.$_message("Verify successful. Please set up a new mailbox.")
                    } else {
                        this.$_error("Validation failure");
                    }
                } catch (e) {
                    this.loading = false;
                    this.$router.push(this.BACK_PAGE);
                    this.$_error("server error");
                    console.error(e);
                }
            },
            async sendEmailCode(status){
                try {
                    //冷却按钮
                    if (status === 'new') {
                        this.newEmailLoading = true;
                        if (this.emailValidate) {
                            setTimeout(() => {
                                this.cooling = false;
                                const text = this.activeCodeText;
                                const num = this.coolNum;
                                const timer = setInterval(() => {
                                    if (this.coolNum === 0) {
                                        clearInterval(timer);
                                        this.activeCodeText = text;
                                        this.cooling = true;
                                        this.coolNum = num;

                                    } else {
                                        this.coolNum--;
                                        this.activeCodeText = `waiting(${this.coolNum}s)`;
                                    }
                                }, 1000);
                            });
                            let res = await utils.sendAxiosGet('/api/user/mailVerify', ['uid', 'email', 'type'], {
                                uid: this.userInfo.uid,
                                email: this.email,
                                type: 0
                            })
                            if (res.data.status_code === 200) {
                                this.$_success("Please go to the mailbox for verification code!");
                            } else if (res.data.status_code === 20008) {
                                this.$_error('The user mailbox already exists!');
                                this.cooling = false;
                            } else if (res.data.status_code === 20009) {
                                this.$_error('The user mailbox already exists!');
                                this.cooling = false;
                            } else {
                                this.$_error('Verification code send failed!');
                                this.cooling = false;
                            }
                        } else {
                            this.emailToggle = true;
                            this.$_warning("Please enter a valid mailbox");
                        }
                        this.newEmailLoading = false;
                    } else {
                        //send old email
                        this.loading = true;
                        setTimeout(() => {
                            this.cooling = false;
                            const text = this.activeCodeText;
                            const num = this.coolNum;
                            const timer = setInterval(() => {
                                if (this.coolNum === 0) {
                                    clearInterval(timer);
                                    this.activeCodeText = text;
                                    this.cooling = true;
                                    this.coolNum = num;

                                } else {
                                    this.coolNum--;
                                    this.activeCodeText = `waiting(${this.coolNum}s)`;
                                }
                            }, 1000);
                        });
                        let res = await utils.sendAxiosGet('/api/user/mailVerify', ['uid', 'email', 'type'], {
                            uid: this.userInfo.uid,
                            email: this.userInfo.email,
                            type: 1
                        })
                        this.loading = false;
                        if (res.data.status_code === 200) {
                            this.$_success("Please go to the mailbox for verification code!");
                        } else if (res.data.status_code === 20008) {
                            this.$_error('The user mailbox already exists!');
                            this.cooling = false;
                        } else if (res.data.status_code === 20009) {
                            this.$_error('The user mailbox already exists!');
                            this.cooling = false;
                        } else {
                            this.$_error('Verification code send failed!');
                            this.cooling = false;
                        }
                        this.loading = false;
                    }
                } catch (e) {
                    console.error(e);
                    this.loading = false;
                }
            },
            ...mapActions('index/myBCC/myBCC', [
                'changeCurrentPath'
            ])
        },
        created(){
            this.changeCurrentPath(this.CURRENT_PATH);
        },
        computed: {
            userInfo(){
                return this.$store.state.authUser
            },
            title(){
                return this.moduleName === 'password' ? 'Change Password' : 'Change Email'
            },
            CURRENT_PATH(){
                const basePath = ["Security Center"];
                return this.moduleName === 'password' ? [...basePath, "Change Password"] : [...basePath, "Change Email"]
            },
            oldPasswordValidate() {
                return /^(\w){6,20}$/.test(this.oldPassword);
            },
            passwordValidate(){
                return /^(\w){6,20}$/.test(this.password);
            },
            confirmPasswordValidate(){
                return this.password === this.confirmPassword;
            },
            emailValidate(){
                return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this.email);
            }
        },
        components: {}
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/myBCC/securityCenter";
</style>