<template>
    <div class="tools-content">
        <tabs :labels="labels" :defaultActive="labels[0]">
            <article class="content" slot="Grid Template">
                <div class="table-container">
                    <nav class="resources-nav">
                        <section class="nav-left-side">
                            <em class="nav-legend ">Level</em>
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
                        <section class="nav-right-side">
                            <a :href="`${backEndImgPath}/tools/words/single_grid.docx`">
                                <button class="nav-long-long-btn">Download Single Grid Template</button>
                            </a>
                        </section>
                    </nav>
                    <article class="content-table">
                        <div class="info-desc">
                            You can download and print Chinese Grid Templates here for writing exercises offline.
                        </div>
                        <template v-if="gridTemplateList.length > 0">
                            <el-table
                                    :stripe="true"
                                    :data="formatGridTemplateData"
                                    border
                                    class="el-table-div"
                                    :default-sort="{prop: 'date', order: 'descending'}">
                                <el-table-column
                                        prop="level"
                                        label="Level"
                                        align="center"
                                        width="170"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="lesson"
                                        label="Lesson"
                                        align="center"
                                        width="170"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="Grid Template"
                                        align="center"
                                >
                                </el-table-column>
                                <el-table-column
                                        pop=""
                                        label="Action"
                                        align="center"
                                        width="115"
                                >
                                    <template scope="scope">
                                        <el-button @click="downloadClick(scope.$index, scope.row)" type="text"
                                                   size="small">Download
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </article>
                    <footer class="footer">
                        <template v-if="gridTemplateList.length > 0">
                            <el-pagination
                                    class="table-info-pagination"
                                    layout="prev, pager, next"
                                    :page-size="pageSize"
                                    :current-page.sync="pageNum"
                                    :total="gridTemplateList.length">
                            </el-pagination>
                        </template>
                    </footer>
                </div>
            </article>
        </tabs>
    </div>
</template>
<script>
    import tabs from "~/components/tabs"
    import {mapState, mapActions} from 'vuex'
    const backEndImgPath = require('~/static/server.config.js').backEndImgPath;
    export default {
        async fetch({isServer, store, query, redirect}){
            store.dispatch("index/learner/learner/changeEntryActive", "tools");
            await store.dispatch("index/base/getMyStudyLevel");
            await store.dispatch("index/base/getGridTemplateList");
        },
        data () {
            return {
                backEndImgPath,
                CURRENT_PATH: [{
                    name: "Tools",
                    url: "learner-tools"
                }],
                labels: ["Grid Template"],
                selectLevel: "0",
                selectLesson: "0",
                pageNum: 1,
                //每页显示数量
                pageSize: 10
            }
        },
        methods: {
            ...mapActions('index/learner/learner', [
                'changeCurrentPath'
            ]),
            ...mapActions('index/base', [
                'getGridTemplateList'
            ]),
            changeCondition() {
                this.getGridTemplateList({
                    levelId: this.selectLevel,
                    lessonId: this.selectLesson
                });
            },
            downloadClick(index, row) {
                window.open(this.backEndImgPath + "/" + row.downloadUrl);
            }
        },
        computed: {
            ...mapState("index/base", {
                gridTemplateList: state => state.gridTemplateList,
                levelOptions: state => state.levelOptions,
                lessonOptions: state => state.lessonOptions,
            }),
            formatGridTemplateData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count
                return this.gridTemplateList.slice(begin, count * pageNum);
            }
        },
        created(){
            this.changeCurrentPath(this.CURRENT_PATH)
        },
        components: {
            tabs
        }
    }
</script>
<style lang="less">
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/element/content_table";
    @import "~~assets/less/element/tab_pagination";
</style>
