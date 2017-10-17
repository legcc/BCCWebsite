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
            The following list shows how you learned the new sentence patterns in that lesson.
        </div>
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
                            prop="pattern"
                            label="Sentence Pattern"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="example"
                            label="Example"
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
            </template>
        </footer>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex';
    export default {
        async fetch({store, query, redirect}){
            await store.dispatch("index/learner/sentence/getData", {
                levelId: query.levelId || "0",
                lessonId: query.lessonId || "0"
            });
        },
        asyncData({query}) {
            return {
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
                    name: "Sentence",
                    url: "learner-sentence"
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
            ...mapActions('index/learner/learner', [
                'changeCurrentPath'
            ]),
            ...mapActions('index/learner/sentence', [
                'searchTable'
            ]),
        },
        computed: {
            ...mapState("index/learner/sentence", {
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
        components: {},
    }
</script>

<style lang="less">
    @import "~~assets/less/element/content_table";
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/element/tab_pagination";
</style>
