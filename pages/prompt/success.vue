<template>
    <div class="container">
        <article class="content">
            <img :src="ICON_IMG" alt="tip" class="icon-img">
            <h2 class="tip-word">{{tip}}</h2>
            <p class="tip-sentence">
                {{sentence}}
            </p>
            <nuxt-link :to="forWardPath" class="link-entry">{{forWardName}}</nuxt-link>
        </article>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'

    @Component({
        components: {},
        asyncData({query, isServer, redirect}){
            isServer && redirect("/");
            let data = {};
            switch (query.type) {
                //注册信息提交成功
                case 1:
                    data = {
                        tip: "Information Submitted Successfully",
                        sentence: "Please go to your mailbox to activate your account.",
                        forWardName: "Go Sign In",
                        forWardPath: {name: 'home-login'},
                    };
                    break;
                //忘记密码邮件发送成功
                case 2:
                    data = {
                        tip: "Email Sent",
                        sentence: "Please go to your mailbox and follow the instructions to change your password.",
                        forWardName: "Go Sign In",
                        forWardPath: {name: 'home-login'},
                    };
                    break;
                //更改邮箱邮件发送成功
                case 3:
                    data = {
                        tip: "Email Changed Successfully",
                        sentence: "Your email has been changed successfully.",
                        forWardName: "My Bcc",
                        forWardPath: {name: 'myBCC'},
                    };
                    break;
                //注册激活成功
                case 4:
                    data = {
                        tip: "Registered Successfully",
                        sentence: "Congratulations, your username has been registered successfully!",
                        forWardName: "Go Sign In",
                        forWardPath: {name: 'home-login'},
                    };
                    break;
                //密码重置成功
                case 5:
                    data = {
                        tip: "Password Reset Successfully",
                        sentence: "Congratulations, your password has been reset successfully!",
                        forWardName: "Go Sign In",
                        forWardPath: {name: 'home-login'},
                    };
                    break;
                //学生添加成功
                case 6:
                    data = {
                        tip: "Students Added Successfully",
                        sentence: "Congratulations. You have added more students!",
                        forWardName: "Go Back",
                        forWardPath: {name: 'educator-myClass'},
                    };
                    break;
                //订单支付成功
                case 9:
                    data = {
                        tip: "Payment Succeed!",
                        sentence: "Order No:" + query.order_no,
                        forWardName: "Go Back",
                        forWardPath: {name: 'myBCC-order'},
                    };
                    break;
            }
            return data;
        }
    })
    export default class active extends Vue {
        ICON_IMG = require('~/assets/img/home/success.svg');
        tip = "";
        sentence = "";
        forWardName = "";
        forWardPath = {name: 'index'};
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/element/prompt";
</style>