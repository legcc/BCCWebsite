<template>
    <container>
        <div class="container">
            <article class="main">
                <div class="title-container">
                    <h2 class="title">Page not found</h2>
                </div>
                <div class="desc-container">
                    <h2>{{error.statusCode }}</h2>
                    <br/>
                    <h2>{{error.message }}</h2>
                </div>
                <button type="button" class="submit-btn" @click="submit">
                    Back to BCC
                </button>
            </article>
        </div>
    </container>
</template>
<script>
    import axios from "axios";
    import utils from "~/plugins/utils";
    import container from "~/functional/container";
    const visitServerPath = require('~/static/server.config.js').nodePath;
    import {mapState} from 'vuex';
    export default {
        props: ['error'],
        async fetch({store}) {
        },
        asyncData({query, store}){
            /*return {
                myUserInfo: {}
            }*/
        },
        data () {
            return {
                FORWARD_PATH: {name: 'index'}
            }
        },
        methods: {
            async submit() {
                let userInfo = {};
                if(this.myUserInfo) {
                    userInfo = {
                        userId: this.myUserInfo.uid || "",
                        customerNo: this.myUserInfo.customerNo || "",
                        email: this.myUserInfo.email || "",
                        nickName: this.myUserInfo.nickName || "",
                        firstName: this.myUserInfo.firstName || "",
                        lastName: this.myUserInfo.lastName || "",
                        visitPath: this.visitServerPath || ""
                    };
                }
                let res = await utils.sendAxiosPost('/api/sendErrorMessage', {
                    userData: JSON.stringify(userInfo),
                    errorCode: this.error.statusCode,
                    errorMessage: this.error.message
                });
                this.$router.push(this.FORWARD_PATH);
            }
        },
        created(){
            //发送邮件给开发人员
            console.log("需要发送邮件给开发人员！");
            this.submit();
        },
        computed: {
            myUserInfo() {
                return this.$store.state.authUser;
            },
        },
        components: {}
    }
</script>
<style lang="less" scoped>
    @import "~assets/less/element/home";
</style>