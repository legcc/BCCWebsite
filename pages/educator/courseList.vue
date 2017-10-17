<template>
    <div class="table-container">
        <nav class="resources-nav">
            <section class="nav-left-side">
                <em class="nav-legend ">Learning Status</em>
                <el-select v-model="selectStatus" @change="changeCondition">
                    <el-option
                            v-for="item in selectOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </section>
        </nav>
        <article class="content-table">
            <template v-if="dataOptions.length > 0">
                <ul class="content-lesson-list">
                    <li class="lesson-info" v-for="(info,index) in formatData">
                        <nuxt-link :to="{name:'educator-courseDetail',query:{levelId,classId,lessonId:info.id}}"
                        v-if="info.lock==0">
                            <div class="lesson-info-start">
                                <div :class="LEVEL_BG[info.levelId]">
                                    <em class="info-state">{{info.learningStatus}}</em>
                                    <div class="img-container">
                                        <img class="info-img" :src="IMGSET[info.levelId]" alt=""/>
                                    </div>
                                    <h1 class="info-title">L{{info.levelId}}-{{info.name}}</h1>
                                    <em class="info-introduce">{{info.sourceType}}</em>
                                </div>
                                <ul class="lesson-introduction">
                                    <li>{{info.subject}}</li>
                                    <li>Topic: <em>{{info.topic}}</em></li>
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
                                <div :class="LEVEL_BG[info.levelId]">
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
        </article>
        <footer class="footer">
            <template v-if="dataOptions.length > 0">
                <el-pagination
                        class="table-info-pagination"
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :current-page.sync="pageNum"
                        :total="dataOptions?dataOptions.length:0">
                </el-pagination>
            </template>
        </footer>
    </div>
</template>
<script>
    import axios from 'axios';
    import utils from '~/plugins/utils'
    import {mapState, mapActions} from 'vuex';
    export default {
        async fetch({store, query, redirect}){
            const defaultPath = "/educator";
            query.levelId ? await store.dispatch("index/educator/courseList/getClass", {
                levelId: query.levelId || 0,
                classId: query.classId || 0
            }) :
                redirect(defaultPath);
            await  store.dispatch("index/educator/courseList/setOption")
        },
        asyncData({query}){
            return {
                levelId: query.levelId || 0,
                classId: query.classId || 0
            }
        },
        data () {
            return {
                CURRENT_PATH: [{
                    name: "My Class",
                    url: "educator-myClass"
                }, {
                    name: "Course List",
                    url: "educator-courseList"
                }],
                //每页数量
                pageSize: 8,
                pageNum: 1,
                selectStatus: "0",
                LEVEL_BG: [
                    '',
                    'lesson-card level1',
                    'lesson-card level2',
                    'lesson-card level3',
                    'lesson-card level4',
                    'lesson-card level5',
                    'lesson-card level6'
                ],
                IMGSET: [
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
            ...mapState("index/educator/courseList", {
                dataOptions: state => state.dataOptions,
                selectOptions: state => state.selectOptions,
            }),
            formatData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count
                return (this.dataOptions || []).slice(begin, count * pageNum);
            }
        },
        created(){
            this.changeCurrentPath(this.CURRENT_PATH);
        },
        methods: {
            changeCondition(){
                this.getClass({
                    learningStatus: this.selectStatus,
                    levelId: this.levelId,
                    classId: this.classId
                });
            },
            ...mapActions('index/educator/courseList', [
                'getClass'
            ]),
            ...mapActions('index/educator/educator', [
                'changeCurrentPath',
                'changeEntryActive'
            ])
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
