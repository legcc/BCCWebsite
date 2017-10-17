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
                        :default-sort="{prop: 'date', order: 'descending'}">
                    <el-table-column
                            prop="level"
                            label="Level"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="lesson"
                            label="Lesson"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="page"
                            label="Page"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="costTime"
                            label="Cost Mins"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="learningTime"
                            label="Learning Time"
                            align="center"
                    >
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
                <button class="right-btn" @click="downLoadRecord">Download Course Record</button>
            </template>
        </footer>
    </div>
</template>
<script>
    import axios from 'axios';
    import utils from '~/plugins/utils';
    import {mapState, mapActions} from 'vuex'
    export default {
        async fetch({store, query, isServer, redirect}){
            query.proId || redirect('/learner');
            await store.dispatch("index/learner/courseRecords/getData", {
                proId: query.proId || "0",
                levelId: query.levelId || "0",
                lessonId: query.lessonId || "0"
            });
        },
        asyncData({query}) {
            return {
                proId: (query.proId || "0") + "",
                selectLevel: (query.levelId || "0") + "",
                selectLesson: (query.lessonId || "0") + ""
            };
        },
        data () {
            return {
                pageNum: 1,
                //每页显示数量
                pageSize: 10,
                selectLevel: "0",
                selectLesson: "0",
                CURRENT_PATH: [{
                    name: "Performance",
                    url: "learner-statistics"
                }, {
                    name: "Course Progress",
                    url: "learner-courseProgress"
                }, {
                    name: "Course Records",
                    url: "learner-courseRecords"
                }]
            }
        },
        methods: {
            ...mapActions('index/learner/courseRecords', [
                'searchTable'
            ]),
            ...mapActions('index/learner/learner', [
                'changeCurrentPath'
            ]),
            changeCondition() {
                this.searchTable({
                    proId: this.proId,
                    levelId: this.selectLevel,
                    lessonId: this.selectLesson
                });
            },
            async downLoadRecord(){
                let res = await utils.sendAxiosPost('/api/progress/getDownLoadRecord', {uid:this.$store.state.authUser.uid,proId:this.proId,levelId: this.selectLevel,lessonId: this.selectLesson,classId: 0,recordType:1});
                if (res.status && res.data.status_code === 200) {
                    window.location.href = res.data.data["download_url"];
                }else{
                    this.$_error('Download failed!');
                }
            },
        },
        computed: {
            ...mapState("index/learner/courseRecords", {
                dataOptions: state => state.dataOptions,
                levelOptions: state => state.levelOptions,
                lessonOptions: state => state.lessonOptions
            }),
            formatTableData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count
                return this.dataOptions.slice(begin, count * pageNum);
            }
        },
        created () {
            this.changeCurrentPath(this.CURRENT_PATH);
        },
        components: {}
    }
</script>
<style lang="less">
    @import "~~assets/less/element/content_table";
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/element/tab_pagination";
</style>
