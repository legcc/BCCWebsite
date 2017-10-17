<template>
    <div :class="isUpdate&&'fadeIn'">
        <div v-if="templateStyle==='level-2'">
            <div class="theme-1">
                <div class="top-content" v-for="(item,index) in content.questions">
                    <div class="container">
                        <ul>
                            <li class="chinese">{{item.question}}</li>
                        </ul>
                    </div>
                    <div class="answer">
                        <input type="text" class="answer-input" @input="checkAnswer($event,item.keyWords,index)">
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="templateStyle==='level-4'">
            <div class="theme-2">
                <div class="practice_common_box">

                    <div class="right-content">
                        <template v-for="(item,index) in content.questions">

                            <p class="questions">{{item.question}}</p>
                            <div class="answer">
                                <input type="text" class="answer-input"
                                       @input="checkAnswer($event,item.keyWords,index)">
                            </div>
                        </template>

                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="coming-soon"></div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage'
    @Component({
        components: {loadingImage},
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },
        computed: {
            ...mapState('index/exercise/index', {
                content: state => state.contentInfo ? state.contentInfo.content : {},
                templateStyle: state => state.templateStyle
            }),
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answers: [],
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600);
                this.init();
            }
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
        }
    })
    export default class readSentenceAnswer extends Vue {
        answers = [];
        isUpdate = false;

        mounted() {
            this.init();
        }

        checkAnswer(ev, keywords, index) {
            this.answers.length || (_ => {
                this.answers = R.map(R.F)(this.content.questions)
            })();
            const inputVal = ev.target.value;
            const isHaveKeyWord = R.pipe(R.prop('keyWord'), R.contains(R.__, inputVal));
//            是否必要 非必要的没有也算对
            const isMust = R.ifElse(R.pipe(R.prop('mustInclude'), R.equals('T')), isHaveKeyWord, R.T);
            this.answers[index] = R.all(isMust)(keywords);
            const answer = R.all(R.clone)(this.answers);
            const rightArr = R.reduce((pre, item) => ( pre.concat(R.filter(R.propEq('mustInclude', 'T'))(item.keyWords)) ), [], this.content.questions);
            this.setAnswer({
                answer,
                msg:  R.join("、")(R.map(R.prop("keyWord"))(rightArr))
            });
        }

        init() {
            this.$nextTick(_ => {
                if (this.content.questions) {
                    const rightArr = this.content.questions
                        && R.pipe(
                            R.map(R.prop("keyWords")),
                            R.defaultTo([]),
                            R.map(R.pipe(R.defaultTo([]),R.filter(R.propEq('mustInclude', 'T')))),
                            R.unnest
                        )(this.content.questions);

                    this.setAnswer({
                        answer: false,
                        msg: R.pipe(R.map(R.prop("keyWord")),R.join("、"))(rightArr)
                    });
                }
            })
        }

    }
</script>
<style lang="less" scoped>
    .coming-soon {
        width: 600px;
        height: 236px;
        margin: 100px auto auto auto;
        background: url(~~assets/img/exercise/coming.png) no-repeat;
        background-size: 100% 100%;
    }

    @import "~~assets/less/plugins/jplayer.less";
    .fadeIn {
        animation: fadeIn .4s ease-in;
        transform: translateZ(0);
    }

    @keyframes fadeIn {
        from {
            transform-origin: left;
            transform: scaleX(.4);
            opacity: 0;
        }
    }

    .theme-1 {
        text-align: center;
        font-family: GothamRounded-Book;
        .top-content {
            display: inline-block;
            width: 6.6rem;
            min-height: 260px;
            font-family: GothamRounded-Medium;
            font-weight: bold;
            font-style: normal;
            font-size: 32px;
            color: #071f30;
            text-align: left;
            padding: 1.2rem 0.2rem 2.3rem 1.2rem;
            margin-top: 60px;
            background: url("~~assets/img/exercise/level2/xiangkuang.png") no-repeat;
            background-size: 100% 100%;
            position: relative;
            .container {
                vertical-align: middle;
                display: inline-block;
            }
            .pinyin {
                margin-left: 30px;
            }
            li {
                margin-top: 5px;
                line-height: 1.3;
            }
            .answer {
                overflow: hidden;
                position: absolute;
                bottom: 180px;
                left: 50%;
                transform: translateX(-50%);
                background: url("~~assets/img/exercise/level2/juzi.png") no-repeat;
                padding: 0 20px 8px 20px;
                background-size: 100% 100%;
                margin: 60px auto 20px auto;
                .answer-input {
                    background: none;
                    position: absolute;
                    font-size: 22px;
                    top: 50%;
                    left: 50%;
                    min-height: 30px;
                    transform: translate(-50%, -50%);
                    outline: none;
                    border: none;
                    width: 100%;
                    color: white;
                    margin: 0 20px;
                }
            }

        }
    }

    .theme-2 {
        font-family: GothamRounded-Book;
        .answer {
            height: .7rem;
            width: 5rem;
            background: url(~~assets/img/main_content/exercise/split-line.png) no-repeat left bottom -.3rem;
            background-size: 100% 100%;
            margin-left: -.4rem;
            padding-left: .6rem;
            position: relative;
        }
        .practice_common_box {
            margin-top: 50px;
        }
        #practice_view .practice_common_box {
            margin: 3% auto 10% auto;
            height: 100%;
            display: block;
            .right-content {
                height: 2.4rem;
            }

        }

    }


</style>
