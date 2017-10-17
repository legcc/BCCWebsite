<template>
    <div class="statistics">
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
                    <el-select v-model="selectLesson" @change="changeCondition">
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
        <div class="view-schedule">
            <transition name="el-zoom-in-center">
                <div class="schedule-list">
                    <div class="img-container"></div>
                    <ul>
                        <li><em>{{option.pronunce.initials}}</em> initial learnt</li>
                        <li><em>{{option.pronunce.finals}}</em> finals learnt</li>
                        <li>PINYIN</li>
                    </ul>
                    <nuxt-link :to="{name:'learner-pinyinView'}" tag="p">
                        <span class="vw-more">VIEW MORE<i>+</i></span>
                    </nuxt-link>
                </div>
            </transition>
            <div class="schedule-list">
                <div class="img-container"></div>
                <ul>
                    <li></li>
                    <li><em>{{option.pronunce.vocabulary}}</em> vocabulary learnt</li>
                    <li>Vocabulary</li>
                </ul>
                <nuxt-link :to="{name:'learner-vocabulary',query:{
                        levelId: selectLevel,
                        lessonId: selectLesson
                    }}" tag="p">
                    <span class="vw-more">VIEW MORE<i>+</i></span>
                </nuxt-link>
            </div>
            <div class="schedule-list">
                <div class="img-container"></div>
                <ul>
                    <li></li>
                    <li><em>{{option.pronunce.sentence}}</em> sentence pattern learnt</li>
                    <li>Sentence Pattern</li>
                </ul>
                <nuxt-link :to="{name:'learner-sentence',query:{
                        levelId: selectLevel,
                        lessonId: selectLesson
                    }}" tag="p">
                    <span class="vw-more">VIEW MORE<i>+</i></span>
                </nuxt-link>
            </div>
        </div>
        <div class="data-dy">
            <div class="dy-lt-1">
                <span class="dy-tle">Core Lesson
                    <nuxt-link :to="{name:'learner-courseProgress',query:{
                            levelId: selectLevel,
                            lessonId: selectLesson
                        }}"><i>+</i></nuxt-link>
                </span>
                <!--pie-->
                <div class="cs-pandect-pie">
                    <courses-pie :option="option"></courses-pie>
                </div>
            </div>
            <div class="dy-rt-1">
                <span class="dy-tle">Exercises Total Time Spent
                    <nuxt-link :to="{name:'learner-exercisesProgress', query:{
                            levelId: selectLevel,
                            lessonId: selectLesson
                        }}"><i>+</i></nuxt-link>
                </span>
                <!--line chart-->
                <div class="cs-pandect-line">
                    <exercises-cost :option="option"></exercises-cost>
                </div>
            </div>
        </div>
        <div class="data-dy">
            <div class="dy-lt-2">
                <span class="dy-tle">Exercises
                    <nuxt-link :to="{name:'learner-exercisesProgress',query:{
                        levelId: selectLevel,
                        lessonId: selectLesson
                        }}"><i>+</i>
                    </nuxt-link>
                </span>
                <!--pie-->
                <div class="cs-multi-pie">
                    <exercises-pie :option="option"></exercises-pie>
                </div>
            </div>
            <div class="dy-rt-2">
                <span class="dy-tle">Score
                    <nuxt-link :to="{name:'learner-exercisesProgress',query:{
                        levelId: selectLevel,
                        lessonId: selectLesson
                        }}"><i>+</i></nuxt-link>
                </span>
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
    import exercisesPie from './exercisesPie.vue';
    import exercisesCost from './exercisesCost.vue';
    import exercisesChart from './exercisesChart.vue';
    import {mapState, mapActions} from 'vuex'
    export default {
        async fetch({store, redirect, query}){
            await store.dispatch("index/learner/statistics/getData", {
                lessonId: query.lessonId || "0",
                levelId: query.levelId || "0"
            });
            store.dispatch("index/learner/learner/changeEntryActive", "statistics");
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
                CURRENT_PATH: [{
                    name: "Performance",
                    url: "learner-statistics"
                }],
                selectLevel: "0",
                selectLesson: "0"
            }
        },
        methods: {
            changeCondition(){
                this.searchData({
                    levelId: this.selectLevel,
                    lessonId: this.selectLesson
                });
            },
            ...mapActions('index/learner/learner', [
                'changeCurrentPath'
            ]),
            ...mapActions('index/learner/statistics', ['searchData'])
        },
        computed: {
            ...mapState("index/learner/statistics", {
                option: state => state.dataOptions,
                levelOptions: state => state.levelOptions,
                lessonOptions: state => state.lessonOptions,
            })
        },
        created () {
            this.changeCurrentPath(this.CURRENT_PATH)
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
