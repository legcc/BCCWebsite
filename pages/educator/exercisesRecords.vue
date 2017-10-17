<template>
    <div class="table-container">
        <nav class="resources-nav">
            <section class="nav-left-side">
                <em class="nav-legend">Level</em>
                <el-select v-model="selectLevel" @change="changeCondition" placeholder="All Level">
                    <el-option
                            v-for="item in levelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <em class="nav-legend ">Lesson</em>
                <el-select v-model="selectLesson" @change="changeCondition" placeholder="All Level">
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
                        style="width: 100%"
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
                            prop="exercistType"
                            label="Exercise Type"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="totalStar"
                            label="Total Stars"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="earnedStar"
                            label="Earned Stars"
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
                <button class="right-btn" @click="downLoadRecord">Download Exercise Record</button>
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
            isServer && redirect('/educator/performance');
            query.proId || redirect('/educator/performance');
            await Promise.all([store.dispatch("index/educator/exercisesRecords/getData", {
                proId: query.proId || "0",
                levelId: query.levelId || "0",
                lessonId: query.lessonId || "0"
            }),
                store.dispatch("index/educator/exercisesRecords/setOptions")
            ]);
        },
        asyncData({query}){
            if (Object.keys(query).length) {
                return {
                    proId: (query.proId || "0") + "",
                    selectLevel: (query.levelId || "0") + "",
                    selectLesson: (query.lessonId || "0") + ""
                };
            }
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
                    url: "educator-performance"
                }, {
                    name: "Statistics",
                    url: "educator-statistics"
                }, {
                    name: "Exercises Progress",
                    url: "educator-exercisesProgress"
                }, {
                    name: "Exercises Records",
                    url: "educator-exercisesRecords"
                }]
            }
        },
        methods: {
            ...mapActions('index/educator/exercisesRecords', [
                'getData'
            ]),
            changeCondition(){
                this.getData({
                    proId: this.proId,
                    levelId: this.selectLevel,
                    lessonId: this.selectLesson
                });
            },
            async downLoadRecord(){
                let res = await utils.sendAxiosPost('/api/progress/getDownLoadRecord', {uid:this.$store.state.authUser.uid,proId:this.proId,levelId: this.selectLevel,lessonId: this.selectLesson,classId: 0,recordType:0});
                if (res.status && res.data.status_code === 200) {
                    window.location.href = res.data.data["download_url"];
                }else{
                    this.$_error('Download failed!');
                }
            },
            ...mapActions('index/educator/educator', [
                'changeCurrentPath'
            ])
        },
        computed: {
            ...mapState("index/educator/exercisesRecords", {
                dataOptions: state => state.dataOptions,
                levelOptions: state => state.levelOptions,
                lessonOptions: state => state.lessonOptions,
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