<template>
    <div class="container">
        <ul class="container-nav">
            <nuxt-link :to="{name:'index'}" tag="li">
                Home
            </nuxt-link>
            <nuxt-link :to="{name:'learner'}" tag="li">
                Learning Center
            </nuxt-link>
            <transition-group name="list">
                <nuxt-link tag="li" :class="index===currentPath.length-1&&'active'" :to="{name:path.url}"
                           :key="path.name" v-for="(path,index) in currentPath">
                    {{path.name}}
                </nuxt-link>
            </transition-group>
        </ul>
        <ul class="container-left-entries">
            <li :class="curActiveEntry==='myCourse'&&'entries-active'">
                <nuxt-link :to="myCourse" class="entries-container" tag="div">
                    <i class="icon-course"></i>
                    <em class="entries-name">My Course</em>
                </nuxt-link>
            </li>
            <li :class="curActiveEntry==='statistics'&&'entries-active'">
                <nuxt-link :to="statistics" class="entries-container" tag="div">
                    <i class="icon-statistics"></i>
                    <em class="entries-name">Performance</em>
                </nuxt-link>
            </li>
            <li :class="curActiveEntry==='tools'&&'entries-active'">
                <nuxt-link :to="tools" class="entries-container" tag="div">
                    <i class="icon-tools"></i>
                    <em class="entries-name">Tools</em>
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
            const defaultPage = `/learner/myCourse`;
            if (route.path === "/learner") {
                redirect(defaultPage);
            }
        },
        fetch({store}){
            const DEFAULT_ENTRY = "myCourse";
            store.dispatch('index/learner/learner/changeEntryActive', DEFAULT_ENTRY);
        },
        data () {
            return {
                myCourse: {name: 'learner-myCourse'},
                statistics: {name: 'learner-statistics'},
                tools: {name: 'learner-tools'},
            }
        },
        methods: {},
        created(){
        },
        computed: {
            ...mapState('index/learner/learner', {
                curActiveEntry: state => state.curActiveEntry,
                currentPath: state => state.currentPath
            })
        },
        components: {}
    }
</script>

<style lang="less" scoped>
    @import "~~assets/less/element/main_container";

    .main-content {
        width: 10.13rem;
        padding: .18rem .28rem;
        background: white;
        overflow: hidden;
    }

    .icon-course {
        width: 39.34px;
        height: 39px;
        background: url("~~assets/img/enties-icon/course.svg") no-repeat;
        background-size: 100% 100%;
    }

    .icon-statistics {
        width: 38px;
        height: 40px;
        background: url("~~assets/img/enties-icon/statistics.svg") no-repeat;
        background-size: 100% 100%;
    }

    .icon-tools {
        width: 37px;
        height: 40px;
        background: url("~~assets/img/enties-icon/tools.svg") no-repeat;
        background-size: 100% 100%;
    }

    .entries-name {
        font-family: GothamRounded-Book;
        position: absolute;
        display: inline-block;
        margin: 10% 0 0 0;
        color: #5A6572;
        font-size: 14px;
        width: 100%;
        text-align: center;
        left: 0;
    }

    /*选中状态*/
    .entries-active {
        background: #425d82;
        .icon-course {
            background-image: url("~~assets/img/enties-icon/course-active.svg");

        }
        .icon-statistics {
            background-image: url("~~assets/img/enties-icon/statistics-active.svg");
        }
        .icon-tools {
            background-image: url("~~assets/img/enties-icon/tools-active.svg");

        }
        div > em {
            color: #ffffff;
        }
    }
</style>
