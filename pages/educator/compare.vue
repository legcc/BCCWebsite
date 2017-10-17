<template>
    <div class="main-content">
        <div class="resources-select">
            <nav class="resources-nav">
                <section class="nav-left-side">
                    <em class="nav-legend ">Level</em>
                    <el-select v-model="selectLevel" @change="changeCondition">
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
        </div>
        <div class="view-schedule">
            <div class="schedule-list" v-for="info in option.classInfo">
                <nuxt-link :to="{name:'educator-statistics',
                                    query:{levelId: info.levelId, classId: info.id}}">
                    <div :class="levelStyle(info)">
                        <div class="img-container"></div>
                        <em>{{info.name}}</em>
                        <span class="vw-more">VIEW MORE<i>+</i></span>
                    </div>
                </nuxt-link>
            </div>
        </div>
        <div class="data-dy">
            <span class="dy-tle">Courses Progress</span>
            <div class="cst-all-chart">
                <all-course-chart :option="option"></all-course-chart>
            </div>
        </div>
        <div class="data-dy">
            <span class="dy-tle">Exercises Cost Rate</span>
            <div class="cst-all-chart">
                <all-exercises-chart :option="option"></all-exercises-chart>
            </div>
        </div>
    </div>
</template>
<script>
    import allCourseChart from './allCourseChart.vue';
    import allExercisesChart from './allExercisesChart.vue';
    import {mapState, mapActions} from 'vuex';
    export default {
        async fetch({isServer, store, query, redirect}){
            isServer && redirect('/educator/performance');

            query.classIds && await store.dispatch("index/educator/compare/getData", {
                classIds: query.classIds,
                levelId: query.levelId || "0",
                lessonId: query.lessonId || "0"
            });
        },
        asyncData({query}){
            if (Object.keys(query).length) {
                return {
                    classIds: query.classIds || '',
                    selectLevel: query.levelId || "0",
                    selectLesson: query.lessonId || "0"
                };
            }
        },
        data () {
            return {
                CURRENT_PATH: [{
                    name: "Performance",
                    url: "educator-performance"
                }, {
                    name: "Compare Class",
                    url: "educator-compare"
                }],
                selectLevel: "0",
                selectLesson: "0"
            }
        },
        methods: {
            levelStyle: function(info) {
                if(info.levelId === 1) {
                    return 'add-div lv1-bg';
                } else if(info.levelId === 2) {
                    return 'add-div lv2-bg';
                } else if(info.levelId === 3) {
                    return 'add-div lv3-bg';
                } else if(info.levelId === 4) {
                    return 'add-div lv4-bg';
                } else if(info.levelId === 5) {
                    return 'add-div lv5-bg';
                } else if(info.levelId === 6) {
                    return 'add-div lv6-bg';
                }
            },
            changeCondition() {
                this.searchData({
                    classIds: this.classIds,
                    levelId: this.selectLevel,
                    lessonId: this.selectLesson
                });
            },
            ...mapActions('index/educator/educator', [
                'changeCurrentPath',
                'changeEntryActive'
            ]),
            ...mapActions('index/educator/compare', ['searchData'])
        },
        created () {
            this.changeCurrentPath(this.CURRENT_PATH);
        },
        computed: {
            ...mapState('index/educator/compare', {
                option: state => state.dataOptions,
                levelOptions: state => state.levelOptions,
                lessonOptions: state => state.lessonOptions
            })
        },
        components: {
            allCourseChart,
            allExercisesChart
        }
    }
</script>

<style lang="less" scoped>
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/educator/compare";
</style>