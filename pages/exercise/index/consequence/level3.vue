<template>
    <div class="container">
        <ul class="list">
            <li class="list-item">
                <ul class="statistics">
                    <li>
                        <progressChart :percent="50"></progressChart>
                        <h2 class="label">Correct</h2>
                        <p class="result">5</p>
                    </li>
                    <li>
                        <progressChart :percent="80"></progressChart>

                        <h2 class="label">Incorrect</h2>
                        <p class="result">6</p>
                    </li>
                    <li>
                        <progressChart :percent="50"></progressChart>

                        <h2 class="label">skipped</h2>
                        <p class="result">7</p>
                    </li>
                </ul>
            </li>
            <li class="list-item">
                <div class="progress">
                    <div class="bar" :style="{width:`${(curStar/totalStar)*100}%`}"></div>
                    <i class="star" :style="{left:`${(curStar/totalStar)*100}%`}">{{curStar}}</i><i class="totalStar">{{totalStar}}</i>
                </div>
            </li>
            <li class="list-item">
                <button class="back-btn">Back to Lesson 1</button>
            </li>
            <li class="list-item">
                <button class="repeat-btn">RETRY</button>
            </li>
        </ul>
    </div>
</template>

<script>
    import progressChart from '~/components/progress'
    export default {
        data () {
            return {
                totalStar: 13,
                curStar: 4,
            }
        },
        methods: {},
        created () {

        },
        computed: {},
        components: {
            progressChart
        }
    }
</script>

<style lang="less" scoped>
    .container {
        margin-top: 100px;
        text-align: center;
        .list {
            display: inline-block;
            .list-item {
                margin: 25px 0;
            }
            .statistics {
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
