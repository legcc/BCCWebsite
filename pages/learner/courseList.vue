<template>
    <div class="table-container">
        <nav class="resources-nav">
            <section class="nav-left-side">
                <em class="nav-legend ">Level</em>
                <el-select v-model="selectLevel" @change="changeCondition">
                    <el-option
                            v-for="(item,index) in levelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <em class="nav-legend ">Resource Type</em>
                <el-select v-model="selectType" @change="changeCondition">
                    <el-option
                            v-for="(item,index) in statusOptions[0]"
                            :key="index"
                            :label="item"
                            :value="index">
                    </el-option>
                </el-select>
                <em class="nav-legend ">Learning Status</em>
                <el-select v-model="selectStatus" @change="changeCondition">
                    <el-option
                            v-for="(item,index) in statusOptions[1]"
                            :key="index"
                            :label="item"
                            :value="index">
                    </el-option>
                </el-select>
            </section>
        </nav>
        <article class="content-table">
            <template v-if="courseOptions.length > 0">
                <ul class="content-lesson-list">
                    <li class="lesson-info" v-for="(info,index) in formatCourseData">
                        <nuxt-link :to="{
                            name:'learner-courseDetail',
                            query: {
                                levelId: selectLevel,
                                lessonId:info.id
                            }}"
                            v-if="(info.sourceId==1||info.sourceId==3||info.sourceId==5) 
                                && info.lock==0">
                            <div class="info-start">
                                <div :class="LEVEL_STYLE[info.levelId]">
                                    <em class="info-state">{{info.learningStatus}}</em>
                                    <div class="img-container">
                                        <img class="info-img" :src="IMGSET[info.levelId]" alt=""/>
                                    </div>
                                    <h1 class="info-title">L{{info.levelId}}-{{info.name}}</h1>
                                    <em class="info-introduce">{{info.sourceType}}</em>
                                </div>
                                <ul class="lesson-introduction">
                                    <li>Subject: <em>{{info.subject}}</em></li>
                                    <li>Topic: <em :class="info.topic.length>20&&'overflow'">{{info.topic}}</em></li>
                                    <li>
                                        <em>{{info.pageNum}} pages</em>
                                        <span class="aside">
			                        		<em>{{info.lessonPeriod}} min</em>
			                        	</span>
                                    </li>
                                </ul>
                            </div>
                        </nuxt-link>
                        <nuxt-link :to="{name:'store'}" target="_blank">
                            <div v-if="info.lock==1" class="info-start">
                                <div :class="LEVEL_STYLE[info.levelId]">
                                    <em class="info-state">{{info.learningStatus}}</em>
                                    <div class="img-container">
                                        <img class="info-img" :src="IMGSET[info.levelId]" alt=""/>
                                    </div>
                                    <h1 class="info-title">L{{info.levelId}}-{{info.name}}</h1>
                                    <em class="info-introduce">{{info.sourceType}}</em>
                                </div>
                                <ul class="lesson-introduction">
                                    <li>Subject: <em>{{info.subject}}</em></li>
                                    <li>Topic: <em :class="info.topic.length>20&&'overflow'">{{info.topic}}</em></li>
                                    <li>
                                        <em>{{info.pageNum}} pages</em>
                                        <span class="aside">
                                            <em>{{info.lessonPeriod}} min</em>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div v-if="info.lock==1" class="info-shade-lock" title="Please click here to purchase all other lessons of this level."></div>
                        </nuxt-link>
                    </li>
                </ul>
            </template>
            <template v-else>
                <div class="empty-notice">
                    <p class="tip-sentence">
                        You haven’t placed an order yet, Go to store to have a look!
                    </p>
                    <nuxt-link :to="{name: 'store'}" class="link-entry">Go to Store</nuxt-link>
                </div>
            </template>
        </article>
        <footer class="footer">
            <template v-if="courseOptions.length > 0">
                <el-pagination
                        class="table-info-pagination"
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :current-page.sync="pageNum"
                        :total="courseOptions?courseOptions.length:0">
                </el-pagination>
            </template>
        </footer>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex';
    export default {
        async fetch({isServer, store, query, redirect}){
            const home = "/learner";
            if (!query.levelId) {
                redirect(home);
                return void(0)
            }
            query.levelId ? store.dispatch("index/learner/locus/setLevelPath", query.levelId) : query.levelId = store.state.index.learner.locus.levelId;
            await Promise.all([
                store.dispatch("index/learner/courseList/getData", {levelId: query.levelId}),
                store.dispatch("index/learner/courseList/getLevelOption")
            ])
        },
        asyncData({query}){
            return {
                selectLevel: query.levelId || "0"
            }
        },
        data () {
            return {
                CURRENT_PATH: [{
                    name: "My Course",
                    url: "learner-myCourse"
                }, {
                    name: "Course List",
                    url: "learner-courseList"
                }],
                selectType: 0,
                selectStatus: 0,
                selectLevel: "0",
                pageNum: 1,
                //每页显示数量
                pageSize: 8,
                LEVEL_STYLE: [
                    '',
                    'lesson-card level1',
                    'lesson-card level2',
                    'lesson-card level3',
                    'lesson-card level4',
                    'lesson-card level5',
                    'lesson-card level6'
                ],
                IMGSET: [
                    "",
                    require("~/assets/img/bear_face_icon/level1.png"),
                    require("~/assets/img/bear_face_icon/level2.png"),
                    require("~/assets/img/bear_face_icon/level3.png"),
                    require("~/assets/img/bear_face_icon/level4.png"),
                    require("~/assets/img/bear_face_icon/level5.png"),
                    require("~/assets/img/bear_face_icon/level6.png")
                ]
            }
        },
        computed: {
            ...mapState("index/learner/courseList", {
                courseOptions: state => state.courseOptions,
                statusOptions: state => state.statusOptions,
                levelOptions: state => state.levelOptions,
            }),
            formatCourseData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count
                return this.courseOptions.slice(begin, count * pageNum);
            }
        },
        methods: {
            changeCondition(){
                this.searchData({
                    learningStatus: this.selectStatus,
                    levelId: this.selectLevel
                });
            },
            ...mapActions('index/learner/courseList', [
                'searchData'
            ]),
            ...mapActions('index/learner/learner', [
                'changeCurrentPath'
            ])
        },
        created(){
            this.changeCurrentPath(this.CURRENT_PATH);
        },
        components: {}
    }
</script>
<style lang="less">
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/element/content_table";
    @import "~~assets/less/element/tab_pagination";
    @import "~~assets/less/element/courseList";
</style>