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
        <div class="info-desc">
            The list below shows the record of the new vocabulary you learned in that lesson.
        </div>
        <tabs :labels="labels" :defaultActive="labels[1]">
            <article class="content-table" slot="HSK">
                <template v-if="hskTableOptions.length > 0">
                    <el-table
                            :stripe="true"
                            :data="hskTableData"
                            border
                            class="el-table-div"
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
                                width="100"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="chinese"
                                label="Word/Phrase"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="pinyin"
                                label="PINYIN"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="example"
                                label="Meaning"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="LearningTime"
                                label="Learning Time"
                                align="center"
                        >
                        </el-table-column>
                    </el-table>
                </template>
                <footer class="footer">
                    <template v-if="hskTableOptions.length > 0">
                        <el-pagination
                                class="table-info-pagination"
                                layout="prev, pager, next"
                                :page-size="pageSize"
                                :current-page.sync="pageNum"
                                :total="hskTableOptions.length">
                        </el-pagination>
                    </template>
                </footer>
            </article>
            <article class="content-table" slot="Edexcel">
                <template v-if="edcTableOptions.length > 0">
                    <el-table
                            :stripe="true"
                            :data="edexcelTableData"
                            border
                            class="el-table-div"
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
                                width="100"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="chinese"
                                label="Word/Phrase"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="pinyin"
                                label="PINYIN"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="example"
                                label="Meaning"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="LearningTime"
                                label="Learning Time"
                                align="center"
                        >
                        </el-table-column>
                    </el-table>
                </template>
                <footer class="footer">
                    <template v-if="edcTableOptions.length > 0">
                        <el-pagination
                                class="table-info-pagination"
                                layout="prev, pager, next"
                                :page-size="pageSize"
                                :current-page.sync="pageNum"
                                :total="edcTableOptions.length">
                        </el-pagination>
                    </template>
                </footer>
            </article>
        </tabs>
    </div>
</template>
<script>
    import tabs from "~/components/tabs";
    import {mapState, mapActions} from 'vuex';
    export default {
        async fetch({store, query, redirect}) {
            await store.dispatch("index/learner/vocabulary/getData", {
                levelId: query.levelId || "0",
                lessonId: query.lessonId || "0"
            });
        },
        asyncData({query}) {
            if (Object.keys(query).length) {
                return {
                    selectLevel: (query.levelId || "0") + "",
                    selectLesson: (query.lessonId || "0") + ""
                };
            }
        },
        data () {
            return {
                labels: ["Edexcel", "HSK"],
                pageNum: 1,
                //每页显示数量
                pageSize: 10,
                selectLevel: "0",
                selectLesson: "0",
                CURRENT_PATH: [{
                    name: "Performance",
                    url: "learner-statistics"
                }, {
                    name: "Vocabulary",
                    url: "learner-vocabulary"
                }]
            }
        },
        methods: {
            changeCondition() {
                this.searchTable({
                    levelId: this.selectLevel,
                    lessonId: this.selectLesson
                });
            },
            ...mapActions('index/learner/vocabulary', [
                'searchTable'
            ]),
            ...mapActions('index/learner/learner', [
                'changeCurrentPath'
            ])
        },
        computed: {
            ...mapState("index/learner/vocabulary", {
                hskTableOptions: state => state.hskTableOptions,
                edcTableOptions: state => state.edcTableOptions,
                levelOptions: state => state.levelOptions,
                lessonOptions: state => state.lessonOptions
            }),
            hskTableData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count;
                const data = this.hskTableOptions || [];
                return data.slice(begin, count * pageNum);
            },
            edexcelTableData(){
                let pageNum = this.pageNum;
                const count = this.pageSize;
                let begin = (pageNum - 1) * count;
                const data = this.edcTableOptions || [];
                return data.slice(begin, count * pageNum);
            }
        },
        created () {
            this.changeCurrentPath(this.CURRENT_PATH);

        },
        components: {
            tabs
        }
    }
</script>

<style lang="less">
    @import "~~assets/less/element/content_table";
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/element/tab_pagination";
</style>
