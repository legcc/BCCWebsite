<template>
    <div class="detail-container" v-loading.body="loading">
        <header class="header">
            <h2 class="title">Resource Detail</h2>
        </header>
        <article class="article">
            <ul>
                <li v-for="info in resourceDetail">
                    <template v-if="info.value != null && info.value != '' 
                        && info.name != 'id' && info.value !=0 && info.value != '0'">
                        <strong class="info-key">{{optionKeys[info.name] ? optionKeys[info.name] + ' :' : info.name + ' :'}}</strong>
                        <em class="info-value">{{info.value}}</em>
                    </template>
                </li>
            </ul>
            <div class="button-list">
                <template v-if="resourceDetailStatus == 'Not Activate'">
                    <button class="back-btn-l back-btn-left" type="button" :disabled="!submitPrevent"
                            @click="submitPrevent && activateResource()">Activate
                    </button>
                </template>
                <nuxt-link :to="{name:'myBCC-resources'}">
                    <button type="button" class="back-btn-l">Back</button>
                </nuxt-link>
            </div>
        </article>
    </div>
</template>
<script>
    import Vue from 'vue';
    import utils from '~/plugins/utils';
    import {mapState, mapActions} from 'vuex';
    import axios from 'axios';
    export default {
        async fetch({store, query}) {
            if (query.resourceId) {
                this.resourceId = query.resourceId;
                await store.dispatch("index/myBCC/myBCC/setResourceDetail", {
                    resourceId: query.resourceId
                });
            }
        },
        asyncData({query, redirect}){
            if (Object.keys(query).length) {
                let obj = {};
                obj.moduleName = "resourceDetail";
                obj.CURRENT_PATH = [{
                    name: "Resources",
                    url: "myBCC-resources"
                }, {
                    name: "Resource Detail",
                    url: "myBCC-resourceDetail"
                }];
                return obj;
            } else {
                redirect("/myBcc/resources");
            }
        },
        data () {
            return {
                loading: false,
                submitPrevent: true,
                optionKeys: {
                    sourceType: "Resource Source",
                    resourceType: "Resourece Type",
                    orderNo: "Order No",
                    orderTime: "Order Time",
                    classname: "Class Name",
                    authCode: "Auth Code",
                    authNum: "Auth Num",
                    useAuthNum: "Already Use Auth Num",
                    username: "Create By",
                    levelInfo: "Level Info",
                    lessonInfo: "Lesson Info",
                    exerciseInfo: "Exercise Info",
                    activateTime: "Activate Time",
                    expiredTime: "Expired Time",
                    periodDate: "Period Date",
                    createTime: "Create Time",
                    status: "Activate Status"
                }
            }
        },
        methods: {
            ...mapActions('index/myBCC/myBCC', [
                'changeCurrentPath'
            ]),
            async activateResource(){
                this.submitPrevent = false;
                this.loading = true;
                try {
                    let res = await utils.sendAxiosGet('/api/resource/activeCurrentResource', ['uid', 'resourceId'], {
                        uid: this.$store.state.authUser.uid,
                        resourceId: this.resourceDetailId
                    });
                    if (res.status && res.data.status_code === 200) {
                        this.$_success("Resource activation successful!");
                        this.loading = false;
                        this.$router.push({name: 'myBCC-resources'});
                    } else if (res.status && res.data.status_code === 20501) {
                        this.$_message('The resource has been activated!');
                        this.loading = false;
                    } else {
                        this.$_error('Resource activation failed!');
                        this.loading = false;
                    }
                } catch (e) {

                }
            }
        },
        created(){
            this.changeCurrentPath(this.CURRENT_PATH)
        },
        computed: {
            resourceDetail(){
                return this.resourceDetail;
            },
            ...mapState('index/myBCC/myBCC', {
                resourceDetail: state => state.resourceDetail,
                resourceDetailId: state => state.resourceDetailId,
                resourceDetailStatus: state => state.resourceDetailStatus
            })
        },
        components: {}
    }
</script>
<style lang="less" scoped>
    @import "~element-ui/lib/theme-default/icon.css";
    @import "~~assets/less/myBCC/detail";
</style>
