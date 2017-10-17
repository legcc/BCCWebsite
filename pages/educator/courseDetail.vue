<template>
    <div>
        <div class="main-title">
            <div :class="LEVEL_STYLE[lessonInfoArr.levelId]">
                <nuxt-link v-if="lessonInfoArr.courseLock==0"
                           :to="{name:COURSE_ENTRY,params:{course:courseTemplate[0].params}}">
                    <div class="info-start">
                        <em class="info-state"></em>
                        <div class="img-container">
                            <img class="info-img" :src="LESSON_IMG" alt=""/>
                        </div>
                        <em class="info-title">Core Lesson</em>
                        <h1 class="info-introduce">{{lessonInfoArr.name}}</h1>
                    </div>
                </nuxt-link>
                <div v-if="lessonInfoArr.courseLock==1" class="info-start">
                    <em class="info-state"></em>
                    <div class="img-container">
                        <img class="info-img" :src="LESSON_IMG" alt=""/>
                    </div>
                    <em class="info-title">Core Lesson</em>
                    <h1 class="info-introduce">{{lessonInfoArr.name}}</h1>
                </div>
                <div v-if="lessonInfoArr.courseLock==1" class="info-shade-lock">
                </div>
            </div>
            <div class="course-info">
                <h1><i class="icon-cup"></i><em>Course Info</em></h1>
                <table class="course-info-tb">
                    <tbody>
                    <tr>
                        <td>Core Lesson:</td>
                        <td>{{lessonInfoArr.lessonPeriod}} mins</td>
                    </tr>
                    <tr>
                        <td>Practices:</td>
                        <td>{{lessonInfoArr.exercisePeriod}} mins</td>
                    </tr>
                    <tr>
                        <td>Vocabularies:</td>
                        <td>{{lessonInfoArr.vocabularyNum}}</td>
                    </tr>
                    <tr>
                        <td>Sentence Patterns:</td>
                        <td>{{lessonInfoArr.sentenceNum}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--
            <div class="course-skip">
                <nuxt-link :to="{name:'educator-statistics', query:{
                    classId: this.classId,
                    levelId: this.levelId,
                    lessonId: this.lessonId
                }}">
                    <button class="statistics-skip-btn">View Performance</button>
                </nuxt-link>
            </div>
            -->
        </div>
        <div class="main-content">
            <ul class="exercise-list">
                <li class="exercise-info" v-for="(info,index) in dataOptions.exercises">
                    <nuxt-link v-if="info.exerciseLock==0"
                               :to="{name:EXERCISE_ENTRY,params:exerciseTemplate[index]&&{exercise:exerciseTemplate[index].params,moduleName:exerciseTemplate[index].name}}">
                        <div class="info-start">
                            <div class="exercise-card">
                                <em class="info-state" data-v-68d5b6a6="">{{info.name}}</em>
                                <div class="exercise-img-container">
                                    <img class="info-img" :src="IMGSET[index]" alt=""/>
                                </div>
                                <h1 class="info-title">Exercise</h1>
                                <em class="info-introduce">{{lessonInfoArr.title}}</em>
                            </div>
                            <ul class="exercise-introduction">
                                <li><em>{{info.exerciseNum}}</em> exercises</li>
                                <li><em>{{info.exerciseNum}}</em> pages
                                    <span class="aside">
                                    <em>{{info.exercisePeriod}} min</em>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </nuxt-link>
                    <div v-if="info.exerciseLock==1" class="info-start">
                        <div class="exercise-card">
                            <em class="info-state" data-v-68d5b6a6="">{{info.name}}</em>
                            <div class="exercise-img-container">
                                <img class="info-img" :src="IMGSET[index]" alt=""/>
                            </div>
                            <h1 class="info-title">Exercise</h1>
                            <em class="info-introduce">{{lessonInfoArr.title}}</em>
                        </div>
                        <ul class="exercise-introduction">
                            <li><em>{{info.exerciseNum}}</em> exercises</li>
                            <li><em>{{info.exerciseNum}}</em> pages
                                <span class="aside">
                                <em>{{info.exercisePeriod}} min</em>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div v-if="info.exerciseLock==1" class="info-shade-lock">
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import {mapState, mapActions,mapMutations} from 'vuex'
    export default {
        async fetch({query, isServer, store, redirect}){
            //根据lessonId获取到 课程或者练习模板数据格式
            const home = "/educator";
            let lessonId = query.lessonId;
            let classId = query.classId;
            if (isServer && !lessonId && !classId) {
                redirect(home);
                return void(0)
            }
            lessonId ? store.dispatch("index/educator/locus/setLessonPath", lessonId) : lessonId = store.state.index.educator.locus.lessonId;
            store.dispatch("index/educator/educator/changeEntryActive", "myClass");
            await Promise.all([store.dispatch('index/educator/courseDetail/getData', {
                lessonId: lessonId,
                classId: classId
            }),
            store.dispatch('index/educator/courseDetail/getExerciseTemplate', {lessonId: lessonId}),
            store.dispatch('index/educator/courseDetail/getCourseTemplate', {lessonId: lessonId})])
        },
        asyncData({query}){
            return {
                levelId: query.levelId || 0,
                lessonId: query.lessonId || 0,
                classId: query.classId || 0
            }
        },
        data () {
            return {
                COURSE_ENTRY: 'course',
                EXERCISE_ENTRY: 'exercise',
                CURRENT_PATH: [{
                    name: "My Class",
                    url: "educator-myClass"
                }, {
                    name: "Course List",
                    url: "educator-courseList"
                }, {
                    name: "Course Detail",
                    url: "educator-courseDetail"
                }],
                LEVEL_STYLE: [
                    '',
                    'lesson-card level1',
                    'lesson-card level2',
                    'lesson-card level3',
                    'lesson-card level4',
                    'lesson-card level5',
                    'lesson-card level6'
                ],
                exerciseInfo: [{
                    state: true,
                    icon: 0,
                    title: "Listening"
                }, {
                    state: true,
                    icon: 1,
                    title: "Speaking"
                }, {
                    state: false,
                    icon: 2,
                    title: "Reading"
                }, {
                    state: true,
                    icon: 3,
                    title: "Writing"
                }],
                LESSON_IMG: require("~/assets/img/my_course/core-lesson.png"),
                IMGSET: [
                    require("~/assets/img/class/listening-icon.png"),
                    require("~/assets/img/class/speaking-icon.png"),
                    require("~/assets/img/class/reading-icon.png"),
                    require("~/assets/img/class/writing-icon.png")
                ]
            }
        },
        created () {
            this.changeCurrentPath(this.CURRENT_PATH);
            this.setExerciseInfo({
                levelId: this.levelId,
                lessonId: this.lessonId,
                classId: this.dataOptions.classId
            });
            this.$store.dispatch('setLayout', this.levelId);
//            初始化练习音频样式
            this['INIT_AUDIO_INFO']();
        },
        methods: {
            ...mapActions('index/educator/educator', [
                'changeCurrentPath'
            ]),
            ...mapActions('index/exercise/index', [
                'setExerciseInfo'
            ]),
            ...mapMutations('index/exercise/index',['INIT_AUDIO_INFO'])
        },
        components: {},
        computed: {
            ...mapState('index/educator/courseDetail', {
                dataOptions: state => state.dataOptions,
                exerciseTemplate: state => state.exerciseTemplate,
                courseTemplate: state => state.courseTemplate
            }),
            lessonInfoArr(){
                return this.dataOptions.lessons || {};
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/element/courseDetail";
</style>
