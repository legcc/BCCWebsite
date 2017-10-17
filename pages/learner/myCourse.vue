<template>
    <div class="myCourse-body">
        <div class="main-top">
            PICK A LEVEL TO START WITH
        </div>
        <div class="main-view">
            <ul class="learner-Level-list">
                <li class="level-info" v-for="(info,index) in statusOptions">
                    <nuxt-link :to="{name:'learner-courseList',query:{levelId:info.id}}"
                               v-if="info.lock==0" class="level-info-start">
                        <div class="tb">
                            <div class="img-box">
                                <img class="level-info-bear" :src="IMGSET[levelInfo[index].icon]" alt=""/>
                            </div>
                            <h1 class="level-title">{{levelInfo[index].title}}</h1>
                        </div>
                    </nuxt-link>
                    <nuxt-link :to="'/store'" v-if="info.lock==1" class="level-info-start">
                        <div class="tb">
                            <div class="img-box">
                                <img class="level-info-bear" :src="IMGSET[levelInfo[index].icon]" alt=""/>
                            </div>
                            <h1 class="level-title">{{levelInfo[index].title}}</h1>
                        </div>
                    </nuxt-link>
                    <nuxt-link :to="'/store'" target="_blank" v-if="info.lock==1" class="level-info-shade-lock" title="Please click here to purchase all other levels.">
                    </nuxt-link>
                </li>
            </ul>
            <p class="content-note">Note: You can use free trail courses or buy the courses which you need, or you can
                <nuxt-link :to="'/myBCC/resources'" target="_blank">click here</nuxt-link>
                to activate your courses.
            </p>
        </div>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex';
    export default {
        async fetch({store, redirect}){
            try {
                await store.dispatch("index/learner/myCourse/getLevel");
            } catch (e) {
                redirect("/")
            }
            store.dispatch("index/learner/learner/changeEntryActive", "myCourse");
        },
        data () {
            return {
                COURSE_ENTRY: {name: 'course-index-matching-4'},
                CURRENT_PATH: [{
                    name: "My Course",
                    url: "learner-myCourse"
                }],
                levelInfo: [{
                    icon: 1,
                    title: "Level 1",
                }, {
                    icon: 2,
                    title: "Level 2"
                }, {
                    icon: 3,
                    title: "Level 3"
                }, {
                    icon: 4,
                    title: "Level 4"
                }, {
                    icon: 5,
                    title: "Level 5"
                }, {
                    icon: 6,
                    title: "Level 6"
                }],
                IMGSET: [
                    "",
                    require("~/assets/img/bear_face_icon/level1.png"),
                    require("~/assets/img/bear_face_icon/level2.png"),
                    require("~/assets/img/bear_face_icon/level3.png"),
                    require("~/assets/img/bear_face_icon/level4.png"),
                    require("~/assets/img/bear_face_icon/level5.png"),
                    require("~/assets/img/bear_face_icon/level6.png")
                ]
            }
        },
        methods: {
            getLevelId(levelName){
                return levelName.match(/(\d)$/) ? levelName.match(/(\d)$/)[0] : 0;
            },
            ...mapActions('index/learner/learner', [
                'changeCurrentPath'
            ])
        },
        computed: {
            ...mapState("index/learner/myCourse", {
                statusOptions: state => state.statusOptions,
            }),
        },
        components: {},
        created(){
            this.changeCurrentPath(this.CURRENT_PATH)
        }
    }
</script>
<style lang="less" scoped>
    @import "~~assets/less/element/common";
    @import "~~assets/less/learner/myCourse";
</style>
