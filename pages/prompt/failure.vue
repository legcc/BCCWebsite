<template>
    <div class="container">
        <article class="content" v-loading.body="loading">
            <img :src="ICON_IMG" alt="tip" class="icon-img">
            <h2 class="tip-word">{{tip}}</h2>
            <p class="tip-sentence">
                {{sentence}}
            </p>
            <a @click.prevent="resendEmail" class="link-entry">{{forWardName}}</a>
        </article>
    </div>
</template>
<script>
    import Vue from 'vue';
    import utils from '~/plugins/utils';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'

    @Component({
        components: {},
        asyncData({query, isServer, redirect}){
            isServer && redirect("/");
            let data = {};
            switch (query.type) {
                //登录未激活
                case 1:
                    data = {
                        tip: "Your account is not activated",
                        sentence: "Please click the link below to send the activation email to your mailbox again.",
                        forWardName: "Resend Email",
                        forWardPath: {name: 'prompt-success', query: {type: 1}},
                        email: query.email,
                        uid: query.uid
                    }
                    break;
                case 2:
                    data = {
                        tip: "Password reset failed",
                        sentence: "Sorry, password reset failed. Please try again later!",
                        forWardName: "Resend Email",
                        forWardPath: {name: 'prompt-forgetPwd'},
                        email: query.email,
                        uid: query.uid
                    }
                    break;
            }
            return data;
        }
    })
    export default class active extends Vue {
        ICON_IMG = require('~/assets/img/home/failure.svg');
        tip = "";
        sentence = "";
        forWardName = "";
        forWardPath = {name: 'index'};
        email = "";
        uid = "";
        loading = false;

        async resendEmail() {
            try {
                this.loading = true;
                let res = await utils.sendAxiosGet("/api/user/sendActivationMail", ["uid", "email"], {
                    uid: this.uid,
                    email: this.email
                });
                this.loading = false;
                +res.data.status_code === 200 && (() => {
                    this.$message.success(res.data.message);
                    this.$router.push(this.forWardPath);
                })();
            } catch (e) {
                console.error(e);
                this.loading = false;
                this.$_error("send email error");
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/element/prompt";
</style>