<template>
    <div class="table-container">
        <nav class="resources-nav">
            <section class="nav-left-side">
                <em class="nav-legend level">Level</em>
                <el-select v-model="selectLevel" @change="changeCondition" placeholder="All Level">
                    <el-option
                            v-for="item in levelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <em class="nav-legend ">Lesson</em>
                <el-select v-model="selectLesson" @change="changeCondition" placeholder="All Lesson">
                    <el-option
                            v-for="item in lessonOptions[selectLevel]?lessonOptions[selectLevel]:[]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </section>
        </nav>
        <article class="content-table">
            <template v-if="dataOptions.length > 0">
                <el-table
                        :stripe="true"
                        :data="formatTableData"
                        border
                        class="el-table-div"
                        @cell-mouse-enter="checkRow"
                        :default-sort="{prop: 'date', order: 'descending'}">
                    <el-table-column
                            prop="level"
                            label="Level"
                            align="center"
                            width="85"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="lesson"
                            label="Lesson"
                            align="center"
                            width="85"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="exerciseType"
                            label="Exercise Type"
                            align="center"
                            width="110"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="totalNum"
                            label="Total Exercises"
                            align="center"
                            width="120"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="learningNum"
                            label="Finish Exercises"
                            align="center"
                            width="120"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="costTime"
                            label="Cost Mins"
                            align="center"

                    >
                    </el-table-column>
                    <el-table-column
                            prop="earnedStar"
                            label="Rate of Earned Stars"
                            align="center"

                    >
                    </el-table-column>
                    <el-table-column
                            label="Action"
                            align="center"
                    >
                        <template scope="scope">
                            <nuxt-link :to="{name:'learner-exercisesRecords',
                                query:{
                                    proId:selectId, 
                                    levelId: rowLevelId, 
                                    lessonId: rowLessonId
                                }}"
                                       tag="button"
                                       @click="(row)"
                                       type="text" size="small">View
                            </nuxt-link>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </article>
        <footer class="footer">
            <template v-if="dataOptions.length > 0">
                <el-pagination
                        class="table-info-pagination"
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :current-page.sync="pageNum"
                        :total="dataOptions.length">
                </el-pagination>
                <!-- Mark By Allen -->
                <button class="right-btn" @click="downLoadProgress">Download Exercise Progress</button>
            </template>
        </footer>
    </div>
</template>

<script>
    import axios from 'axios';
    import utils from '~/plugins/utils';
    import {mapState, mapActions} from 'vuex';
    const backEndImgPath = require('~/static/server.config.js').backEndImgPath;
    export default {
        async fetch({store, query, isServer, redirect}){
            await store.dispatch("index/learner/exercisesProgress/getData", {
                levelId: query.levelId || "0",
                lessonId: query.lessonId || "0"
            });
        },
        asyncData({query}){
            if (Object.keys(query).length) {
                return {
                    selectLevel: (query.levelId || "0") + "",
                    selectLesson: (query.lessonId || "0") + ""
                };
            }
        },
        data () {
            return {
                backEndImgPath,
                pageNum: 1,
                //每页显示数量
                pageSize: 10,
                selectId: "0",
                rowLevelId: "0",
                rowLessonId: "0",
                selectLevel: "0",
                selectLesson: "0",
                CURRENT_PATH: [{
                    name: "Performance",
                    url: "learner-statistics"
                }, {
                    name: "Exercises Progress",
                    url: "learner-exercisesProgress"
                }]
            }
        },
        methods: {
            checkRow(row, cell){
                this.selectId = row.id;
                this.rowLevelId = row.levelId;
                this.rowLessonId = row.lessonId;
            },
            ...mapActions('index/learner/exercisesProgress', [
                'searchTable'
            ]),
            ...mapActions('index/learner/learner', [
                'changeCurrentPath'
            ]),
            changeCondition() {
                this.searchTable({
                    levelId: this.selectLevel,
                    lessonId: this.selectLesson
                });
            },
        },
        created () {
            this.changeCurrentPath(this.CURRENT_PATH);
        },
        computed: {
            ...mapState("index/learner/exercisesProgress", {
                dataOptions: state => state.dataOptions,
                levelOptions: state => state.levelOptions,
                lessonOptions: state => state.lessonOptions,
            }),
            formatTableData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count
                return this.dataOptions.slice(begin, count * pageNum);
            },
            async downLoadProgress(){
                let res = await utils.sendAxiosPost('/api/progress/getDownLoadProgress', {uid:this.$store.state.authUser.uid,levelId: this.selectLevel,lessonId: this.selectLesson,classId:0,proType:0});
                if (res.status && res.data.status_code === 200) {
                    window.location.href = res.data.data["download_url"];
                }else{
                    this.$_error('Download failed!');
                }
            },
        },
        components: {}
    }
</script>

<style lang="less">
    @import "~~assets/less/element/content_table";
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/element/tab_pagination";
</style>
