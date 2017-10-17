<template>
    <div class="theme-1" v-if="templateStyle === 'level-1'" :class="isUpdate&&'fadeIn'">
        <div v-for="(item,questionIndex) in content.question">
            <div class="practice_listen_answer practice_common_box">
                <div class="listen_answer_title"
                     v-if="item.english">
                    <span v-html="item.english.replace(/\[.]/g,`<input readonly type='text'  id='answer-input'>`)"
                          class="english"></span>
                </div>
                <div class="listen_answer_title"
                     v-else-if="item.chinese">
                    <span v-html="item.chinese.replace(/\[.]/g,`<input readonly type='text'  id='answer-input'>`)"
                          class="chinese"></span>
                </div>
                <div class="listen_answer_title"
                     v-else-if="item.pinyin">
                    <span v-html="item.pinyin.replace(/\[.]/g,`<input readonly type='text'  id='answer-input'>`)"
                          class="pinyin"></span>
                </div>
                <div class="listen_answer_title"
                     v-else
                     v-html="`<input readonly type='text'  id='answer-input'>`"></div>
            </div>
            <div class="listen_answer_box">
                <ul class="answer-list">
                    <li v-for="(ans,ansIndex) in item.answers">
                        <span class="listen_answer"
                              @click="answerHandler(ansIndex,ans,questionIndex)"
                              :class="activeIndex===ansIndex&&'active'"
                        >{{ans.order}}</span>
                        <ul class="text">
                            <li class="answer-content" v-if="ans.pinyin">{{ans.pinyin}}</li>
                            <li class="answer-content" v-if="ans.chinese">{{ans.chinese}}</li>
                            <li class="answer-content" v-if="ans.english">{{ans.english}}</li>
                        </ul>
                    </li>
                </ul>
            </div>
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
                contentInfo: state => state.contentInfo,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    activeIndex: "",
                    answers: [],
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                this.init();
                this.initVal("");
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600)
            }
        },
    })
    export default class chooseTheSentence extends Vue {
        activeIndex = "";
        answers = [];
        isUpdate = false;

        answerHandler(ansIndex, ans, questionIndex) {
            this.answers.length || (_ => {
                this.answers = R.map(R.F)(this.content.question)
            })();
            this.initVal(ans.order);
            this.answers[questionIndex] = R.equals(ans.isRight)('T');
            this.activeIndex = ansIndex;
            const answer = R.all(R.clone)(this.answers);
            this.setAnswer({
                answer,
                msg: `${R.pipe(R.map(item => item.english || item.chinese || item.pinyin), R.filter(R.clone), R.join("、"))(R.reduce((pre, item) => (pre.concat(R.filter(R.propEq('isRight', 'T'))(item.answers))), [])(this.content.question))}`
            });
        }

        init() {
            this.$nextTick(_ => {

                this.setAnswer({
                    answer: false,
                    msg: this.content.question && `${R.pipe(R.map(item => item.english || item.chinese || item.pinyin), R.filter(R.clone), R.join("、"))(R.reduce((pre, item) => (pre.concat(R.filter(R.propEq('isRight', 'T'))(item.answers))), [])(this.content.question))}`
                });
            })
        }

        mounted() {
            this.init();
        }

        initVal(text) {
            const ele = document.getElementById("answer-input");
            ele ? ele.value = text : void 0;
        }

    }
</script>

<style lang="less" scoped>
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
        .practice_common_box {
            width: 750px;
            display: block;
            margin: 0 auto;
            font-family: 'Arial Rounded MT Bold', 'Arial Rounded MT';
            text-align: center;
            position: relative;
        }
        .listen_answer_title {
            display: inline-block;
            width: 5rem;
            min-height: 1.2rem;
            font-size: .26rem;
            color: #0000b4;
            line-height: 1.2rem;
            margin-top: .4rem;
            text-align: center;
            padding: 0 40px;
            font-family: GothamRounded-Medium;
            background: url(~~assets/img/main_content/exercise/answer_title_bg.png) no-repeat;
            background-size: 100% 100%;
            .chinese, .pinyin, .english {
                line-height: 1.3;
                display: inline-block;
                text-align: left;
                vertical-align: middle;
            }
        }
        .answer-content {
            font-size: 20px;
            font-family: GothamRounded-Medium;
            color: #3057f2;
        }
        .listen_answer_box {
            margin-top: 10px;
            text-align: center;
        }
        .answer-list {
            display: inline-block;
            text-align: left;
            margin-left: -20px;
            .text {
                display: inline-block;
                vertical-align: middle;
            }
        }
        .listen_answer:nth-child(1) {
            color: #000099;
        }
        .listen_answer:nth-child(2) {
            color: #FF0000;
        }
        .listen_answer {
            display: inline-block;
            width: 80px;
            height: 80px;
            vertical-align: middle;
            text-align: center;
            background: url(~~assets/img/main_content/exercise/cloud.png) no-repeat;
            background-size: 100% 100% !important;
            background-position: center 5px !important;
            line-height: 80px;
            font-size: 40px;
            margin-left: 30px;
            margin-right: 30px;
            cursor: pointer;
            &.active {
                background: url(~~assets/img/main_content/exercise/cloud_active.png) no-repeat;
                color: white;
            }
        }
    }

</style>
<style lang="less">
    #answer-input {
        background: none;
        border: none;
        text-align: center;
        outline: none;
        border-bottom: 2px solid black;
        width: 160px;
    }
</style>