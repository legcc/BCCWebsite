<template>
    <div class="statistical-container">
        <ul class="statistical-list">
            <li class="statistical-list-item">
                <ul class="statistical-statistics">
                    <li>
                        <progressChart :percent="Math.floor(correct/totalPage*100)"></progressChart>
                        <h2 class="label">Correct</h2>
                        <p class="result">{{correct}}</p>
                    </li>
                    <li>
                        <progressChart :percent="Math.floor(incorrect/totalPage*100)"></progressChart>

                        <h2 class="label">Incorrect</h2>
                        <p class="result">{{incorrect}}</p>
                    </li>
                    <li>
                        <progressChart :percent="Math.floor(skipped/totalPage*100)"></progressChart>

                        <h2 class="label">skipped</h2>
                        <p class="result">{{skipped}}</p>
                    </li>
                </ul>
            </li>
            <li class="statistical-list-item">
                <div class="progress">
                    <div class="bar" :style="{width:`${(curStar/totalStar)*100}%`}"></div>
                    <i class="star" :style="{left:`${(curStar/totalStar)*100}%`}">{{curStar}}</i><i class="totalStar">{{totalStar}}</i>
                </div>
            </li>
            <li class="statistical-list-item">
                <button class="back-btn" @click="backHome">Back to Lesson {{+exerciseInfo.lessonId - 73}}</button>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex'
    import progressChart from '~/components/progress'
    import R from 'ramda'
    export default {
        data () {
            return {
                totalStar: 0,
                curStar: 0,
            }
        },
        methods: {
            backHome(){
                this.$router.replace({
                    name: 'learner-courseDetail', query: {
                        ...this.exerciseInfo
                    }
                });
            }
        },
        created () {
            this.$nextTick(_=>{
                this.totalStar = this.totalPage;
                this.curStar = this.correct;})
        },
        computed: {
            ...mapState('index/exercise/index', {
                contentInfo: state => state.contentInfo
                , exerciseInfo: state => state.exerciseInfo
                , exerciseModuleName: state => state.exerciseModuleName
                , statisticsInfo: state => state.statisticsInfo
                , totalPage: state => state.totalPage
            }),
            correct(){
                return R.compose(R.length, R.filter(R.pipe(R.clone, R.equals(true))))(this.statisticsInfo.correct);
            }, incorrect(){
                return R.compose(R.length, R.filter(R.pipe(R.clone, R.equals(false))))(this.statisticsInfo.correct);
            }, skipped(){
                return this.totalPage - this.correct - this.incorrect;
            }
        },
        components: {
            progressChart
        }
    }
</script>

<style lang="less" scoped>
    .statistical-container {
        margin-top: 100px;
        text-align: center;
        .statistical-list {
            display: inline-block;
            .statistical-list-item {
                margin: 25px 0;
            }
            .statistical-statistics {
                li {
                    display: inline-block;
                    margin: 0 40px;
                    font-family: 'Arial Rounded MT Bold', 'Arial Rounded MT';
                    font-size: 24px;
                    color: #196AAD;
                }
                .result {
                    margin-top: 20px;
                    font-weight: 600;
                    font-size: 32px;
                }
            }
            .progress {
                height: 40px;
                width: 600px;
                display: inline-block;
                background-color: white;
                border-radius: 20px;
                position: relative;
                .bar {
                    width: 0;
                    background: linear-gradient(-45deg, #D3BF45 15%, #FFF053 0, #FFF053 45%, #D3BF45 0, #D3BF45 65%, #FFF053 0);
                    background-size: 6px 6px;
                    height: 100%;
                    border-radius: 20px;
                    transition: all .2s ease-in
                }
                .star, .totalStar {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    background: url("~~assets/img/exercise/star.png") no-repeat;
                    background-size: 100% 100%;
                    display: inline-block;
                    width: 46px;
                    height: 43px;
                    line-height: 43px;
                    text-align: center;
                    color: red;
                    font-family: GothamRounded-Medium;
                    transition: all .2s ease-in
                }
                .star {
                    transform: translate(-50%, -50%);
                }
            }
            .repeat-btn, .back-btn {
                width: 420px;
                height: 40px;
                border-radius: 5px;
                background: #007CE5;
                color: white;
                font-size: 20px;
                font-family: GothamRounded-Medium;
                &:hover {
                    background: white;
                    color: #007CE5;
                }
            }
        }
    }
</style>
