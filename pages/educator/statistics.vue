<template>
    <div class="statistics">
        <div class="resources-select">
            <nav class="resources-nav">
                <section class="nav-left-side">
                    <em class="nav-legend ">Class</em>
                    <el-select class="el-long-select" v-model="selectClass" @change="changeCondition">
                        <el-option
                                v-for="item in classOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <em class="nav-legend">Student</em>
                    <el-select v-model="selectStudent" @change="changeCondition" placeholder="All Student">
                        <el-option
                                v-for="item in studentOptions[selectClass]?studentOptions[selectClass]:[]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
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
        <div class="info-desc">
        </div>
        <div class="data-dy">
            <div class="dy-lt-1">
                <span class="dy-tle">Core Lesson(Class)
                    <nuxt-link
                            :to="{name:'educator-courseProgress',
                            query:{
                                classId: selectClass, 
                                levelId: selectLevel,
                                studentId: selectStudent,
                                lessonId: selectLesson
                        }}"><i>+</i>
                    </nuxt-link>
                </span>
                <!--pie-->
                <div class="cs-pandect-pie">
                    <courses-pie :option="option"></courses-pie>
                </div>
            </div>
            <div class="dy-rt-1">
                <span class="dy-tle">Exercises Total Time Spent(Students)
                    <nuxt-link
                            :to="{name:'educator-exercisesProgress',
                            query:{
                                classId:selectClass,
                                levelId:selectLevel,
                                studentId: selectStudent,
                                lessonId: selectLesson
                            }}"><i>+</i>
                    </nuxt-link>
                </span>
                <!--line chart-->
                <div class="cs-pandect-line">
                    <exercises-cost :option="option"></exercises-cost>
                </div>
            </div>
        </div>
        <div class="data-dy">
            <div class="dy-lt-2">
                <span class="dy-tle">Exercises(Students)
                    <nuxt-link
                            :to="{name:'educator-exercisesProgress',
                            query:{
                                classId:selectClass,
                                levelId:selectLevel,
                                studentId: selectStudent,
                                lessonId: selectLesson
                            }}"><i>+</i></nuxt-link>
                </span>
                <!--pie-->
                <div class="cs-multi-pie">
                    <exercises-pie :option="option"></exercises-pie>
                </div>
            </div>
            <div class="dy-rt-2">
                <nuxt-link :to="{name:'educator-exercisesProgress',
                    query:{
                        classId:selectClass,
                        levelId:selectLevel,
                        studentId: selectStudent,
                        lessonId: selectLesson
                    }}"
                           class="dy-tle">Score(Students)<i>+</i></nuxt-link>
                <!--histogram-->
                <div class="cs-multi-line">
                    <exercises-chart :option="option"></exercises-chart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import coursesPie from './coursesPie.vue';
    import exercisesCost from './exercisesCost.vue';
    import exercisesPie from './exercisesPie.vue';
    import exercisesChart from './exercisesChart.vue';
    import {mapState, mapActions} from 'vuex';
    export default {
        async fetch(ctx){
            let {isServer, store, query, redirect} = ctx;
            if (isServer) {
                redirect('/educator/performance');
            }
            else if (!(query.classId && query.levelId)) {
                redirect('/educator/performance');
            }
            try {
                await Promise.all([
                    store.dispatch("index/educator/statistics/getData", {
                        classId: query.classId || "0",
                        levelId: query.levelId || "0"
                    })
                ])
            } catch (e) {
            }
        },
        asyncData({query}){
            if (Object.keys(query).length) {
                return {
                    classId: query.classId,
                    levelId: query.levelId,
                    selectLevel: (query.levelId || "0") + "",
                    selectClass: (query.classId || "0") + "",
                    selectLesson: (query.lessonId || "0") + "",
                    selectStudent: (query.studentId || "0") + ""
                };
            }
        },
        data () {
            return {
                CURRENT_PATH: [{
                    name: "Performance",
                    url: "educator-performance"
                }, {
                    name: "Statistics",
                    url: "educcator-statistics"
                }],
                selectLesson: "0",
                selectStudent: "0",
                selectLevel: "0",
                selectClass: "0"
            }
        },
        methods: {
            changeCondition() {
                this.searchData({
                    classId: this.selectClass,
                    studentId: this.selectStudent,
                    levelId: this.selectLevel,
                    lessonId: this.selectLesson
                });
            },
            ...mapActions('index/educator/statistics', ['searchData']),
            ...mapActions('index/educator/educator', [
                'changeCurrentPath',
                'changeEntryActive'
            ])
        },
        computed: {
            ...mapState("index/educator/statistics", {
                option: state => state.dataOptions,
                levelOptions: state => state.levelOptions,
                classOptions: state => state.classOptions,
                lessonOptions: state => state.lessonOptions,
                studentOptions: state => state.studentOptions
            })
        },
        created () {
            this.changeCurrentPath(this.CURRENT_PATH);
        },
        components: {
            coursesPie,
            exercisesPie,
            exercisesCost,
            exercisesChart
        }
    }
</script>

<style lang="less">
    @import "~~assets/less/element/nav_select";
    @import "~~assets/less/element/statistics";
</style>
