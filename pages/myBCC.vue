<template>
    <div class="container">
        <ul class="container-nav">
            <nuxt-link :to="{name:'index'}" tag="li">
                Home
            </nuxt-link>
            <nuxt-link :to="{name:'myBCC'}" tag="li">
                My BCC
            </nuxt-link>
            <transition-group name="list">
                <nuxt-link tag="li" :class="index===currentPath.length-1&&'active'" :to="{name:path.url}"
                           :key="path.name" v-for="(path,index) in currentPath">
                    {{path.name}}
                </nuxt-link>
            </transition-group>
        </ul>
        <ul class="container-left-entries">
            <li :class="curActiveEntry==='userSetting'&&'entries-active'">
                <nuxt-link :to="userSetting" class="entries-container" tag="div">
                    <i class="icon-setting"></i><em class="entries-name">User Setting</em>
                </nuxt-link>
            </li>
            <li :class="curActiveEntry==='order'&&'entries-active'">
                <nuxt-link :to="order" class="entries-container" tag="div">
                    <i class="icon-order"></i><em class="entries-name">Order</em>
                </nuxt-link>
            </li>
            <li :class="curActiveEntry==='resources'&&'entries-active'">
                <nuxt-link :to="resources" class="entries-container" tag="div">
                    <i class="icon-resources"></i><em class="entries-name">Resources</em>
                </nuxt-link>
            </li>
            <li :class="curActiveEntry==='message'&&'entries-active'">
                <nuxt-link :to="message" tag="div" class="entries-container">
                    <i class="icon-message"></i><em class="entries-name">Message</em>
                </nuxt-link>
            </li>
        </ul>
        <article class="container-main">
            <nuxt-child></nuxt-child>
        </article>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        asyncData({route, redirect}){
            //默认页面
            const defaultPage = `/myBCC/userSetting`;
            if (route.path === "/myBCC") {
                redirect(defaultPage);
            }
        },
        fetch({store}){
            //默认选中入口
            const DEFAULT_ENTRY = "userSetting";
            store.dispatch('index/myBCC/myBCC/changeEntryActive', DEFAULT_ENTRY);
        },
        data () {
            return {
                userSetting: {name: 'myBCC-userSetting'},
                order: {name: 'myBCC-order'},
                resources: {name: 'myBCC-resources'},
                message: {name: 'myBCC-message'},
            }
        },
        methods: {},
        created(){
        },
        computed: {
            ...mapState('index/myBCC/myBCC', {
                curActiveEntry: state => state.curActiveEntry,
                currentPath: state => state.currentPath
            })
        },
        components: {}
    }
</script>

<style lang="less" scoped>
    @import "~~assets/less/element/main_container";
    @import "~~assets/less/myBCC/myBCC";
</style>
