<template>
    <div class="endPage-container">
        <div class="endPage-picture">
        </div>
        <div class="skip-btn">
            <button class="enterExercise" @click="enterExercise">EXERCISES</button>
            <nuxt-link :to="{
                            name:'learner-courseDetail',
                            query: {
                                levelId:exerciseInfo.levelId,
                                lessonId: nextLesson,
                            }}">
                <button class="enterNextLesson">NEXT LESSON</button>
            </nuxt-link>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex';
    import NuxtLink from "../../../../.nuxt/components/nuxt-link";
    export default {
        components: {NuxtLink},
        async fetch({isServer, redirect, store, params}){
            (isServer || !params) && redirect("/learner/myCourse");
            await store.dispatch("index/course/index/setContentInfo", params);
        },
        data () {
            return {}
        },
        methods: {
            enterExercise(){
                if (parseInt(this.$store.state.authUser.customerType) === 1) {
                    this.$router.replace({
                        name: 'learner-courseDetail', query: {
                            ...this.exerciseInfo
                        }
                    });
                }
                if (parseInt(this.$store.state.authUser.customerType) === 2) {
                    this.$router.replace({
                        name: 'educator-courseDetail', query: {
                            ...this.exerciseInfo
                        }
                    });
                }
            },
//            enterLesson(){
//                if (parseInt(this.$store.state.authUser.customerType) === 1) {
//                    this.$router.replace({
//                        name: 'learner-courseList', query: {
//                            ...this.exerciseInfo
//                        }
//                    });
//                }
//                if (parseInt(this.$store.state.authUser.customerType) === 2) {
//                    this.$router.replace({
//                        name: 'educator-courseList', query: {
//                            ...this.exerciseInfo
//                        }
//                    });
//                }
//            },
        },
        created(){
        },
        computed: {
            ...mapState('index/exercise/index', {
                exerciseInfo: state => state.exerciseInfo,
            }),
            ...mapState('index/course/index', {
                nextLesson: state => state.nextLesson
            })
        }
    }
</script>

<style lang="less" scoped>
    .endPage-container {
        position: absolute;
        top: 76px;
        left: 50%;
        -ms-transform: translateX(-50%);
        transform: translateX(-50%);
        height: 70%;
        .endPage-picture {
            background: url("~~assets/img/main_content/course/endPage-bg.png") center 0px no-repeat;
            background-size: contain;
            width: 7.5rem;
            height: 4rem;
            margin: 0 auto;
        }

        .skip-btn {
            text-align: center;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 0);
            width: 100%;
        }

        .enterExercise, .enterNextLesson {
            margin: 0 0.3rem;
            font-size: 0.18rem;
            font-family: 'Showcard Gothic Bold', 'Showcard Gothic Normal', 'Showcard Gothic';
            background: #00232a;
            color: #ffc464;
            border: 0.02rem solid white;
            border-radius: 0.08rem;
            height: 0.45rem;
            width: 1.6rem;
            line-height: 0.41rem;
        }

    }
</style>
