<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="theme-1" v-if="templateStyle === 'level-4'">
            <div class="template-content">
                <div class="left-content" v-for="item in content.sentences"><em class="text">{{item}}</em>
                </div>
                <div class="right-questions">
                    <ul>
                        <li class="option" v-for="(item,index) in content.questions">
                            <span class="question">{{item.question}}</span>
                            <div v-if="item.keyWords">
                                <div class="answer">
                                    <input type="text" @input="answerHandler('input',index,$event)"
                                           class="answer-input">
                                </div>
                            </div>
                            <span v-else>
                                <span
                                        :class="activeArr[index]==='T'&&'active'"
                                        class="icon-true" @click="answerHandler('selection',index,'T')"></span>
                                <span
                                        :class="activeArr[index]==='F'&&'active'"
                                        @click="answerHandler('selection',index,'F')" class="icon-false"></span>
                                </span>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
        <div class="theme-2" v-if="templateStyle === 'level-3'">
            <div class="container">
                <header class="header">
                    <p class="sentence" v-for="item in content.sentences">
                        {{item}}
                    </p>
                </header>
                <ul class="answer-list">
                    <li v-for="(item,index) in content.questions">
                        <em class="answer">{{item.question}}</em>
                        <div v-if="item.keyWords">
                            <div class="input-container">
                                <input type="text" @input="answerHandler('input',index,$event)"
                                       class="answer-input">
                            </div>
                        </div>
                        <span v-else>
                        <label class="radio-true"
                               :class="activeArr[index]==='T'&&'active'"
                               @click="answerHandler('selection',index,'T')"></label>
                        <label class="radio-false"
                               :class="activeArr[index]==='F'&&'active'"
                               @click="answerHandler('selection',index,'F')"></label>
                        </span>
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
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ])
        },
        computed: {
            ...mapState('index/exercise/index', {
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
            rightAnswer(){
                const arr = [];
                this.content.questions.forEach(item => {
                    item.isRight && arr.push(item.isRight);
                    item.keyWords && arr.push(item.keyWords.map(item => {
                        return R.toLower(item.keyWord);
                    }));
                });
                return arr;
            }
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answerArr: [],
                    activeArr: [],
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
    })
    export default class chooseNumber extends Vue {
        answerArr = [];
        activeArr = [];
        isUpdate = false;

        init() {
            this.$nextTick(_ => {
                this.setAnswer({
                    answer: false,
                    msg: this.rightAnswer && `　${R.join("、")(R.reduce((pre, item) => (pre.concat(item)), [])(this.rightAnswer))}`
                });
            })
        }

        mounted() {
            this.init();
        }

        answerHandler(type, index, condition) {
            let result = "";
            switch (type) {
                case "selection":
                    result = condition === this.rightAnswer[index];
                    Vue.set(this.activeArr, index, condition);
                    break;
                case "input":
                    result = R.all(R.contains(R.__, condition.target.value.toLowerCase()))(this.rightAnswer[index]);
                    break;
            }
            this.answerArr[index] = result;
            let answer = false;
            if (this.answerArr.length === this.content.questions.length) {
                answer = R.all(R.clone)(this.answerArr);
            }
            this.setAnswer({
                answer,
                msg: `　${R.join("、")(R.reduce((pre, item) => (pre.concat(item)), [])(this.rightAnswer))}`
            });

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
        .answer {
            width: 70%;
            margin-top: 15px;
            height: 30px;
            background: url("~~assets/img/main_content/exercise/split-line.png") no-repeat center / 100% 100%;
            background-position: -24px 5px;
            position: relative;
        }
        .answer-input {
            display: block;
            width: 100%;
            border: none;
            margin: 0 24px;
            outline: none;
            background: none;
            color: #0b2f49;
            position: absolute;
            top: 0;
            left: 0;
            font-family: GothamRounded-Book;
        }

        .template-content {
            margin: 40px auto auto auto;
            text-align: center;
        }

        .left-content {
            vertical-align: middle;
            width: 30%;
            display: inline-block;
            white-space: pre-line;
            text-align: left;
            word-break: break-all;
            word-wrap: break-word;
            box-sizing: border-box;
            min-height: 500px;
            overflow: hidden;
            line-height: 500px;
            background: url(~~assets/img/main_content/exercise/read-message-bg.png) no-repeat;
            background-size: 100% 100%;
            font-family: "楷体";
            font-weight: 900;
            font-style: normal;
            font-size: 20px;
            color: #333;
            padding: 0 50px;
            cursor: pointer;
            padding-bottom: 70px;
            height: auto;
            .text {
                display: inline-block;
                line-height: 1.4;
                margin: 70px 0 60px 20px;
                vertical-align: middle;
            }
        }

        .right-questions {
            vertical-align: middle;
            display: inline-block;
            text-align: left;
            margin-top: -50px;
            width: 50%;
        }

        .right-questions .option {
            list-style: none;
            margin: 30px;
        }

        .right-questions .option .question {
            width: 70%;
            display: inline-block;
            font-family: "Helvetica";
            font-weight: 400;
            font-style: normal;
            font-size: 26px;
            line-height: 34px;
            color: #333;
            vertical-align: middle;
            text-align: left;
        }

        .right-questions .option span[class^=icon-] {
            display: inline-block;
            width: 71px;
            height: 90px;
            background-size: contain;
            cursor: pointer;
            vertical-align: middle;
        }

        .right-questions .option .icon-true {
            background: url(~~assets/img/main_content/exercise/T.png);
            margin-left: 30px;
            &.active {
                background-image: url(~~assets/img/main_content/exercise/TT.png);
            }
        }

        .right-questions .option .icon-false {
            background: url(~~assets/img/main_content/exercise/FF.png);
            &.active {
                background-image: url(~~assets/img/main_content/exercise/F.png);
            }
        }
    }

    .theme-2 {
        .container {
            width: 55%;
            margin: 0 auto;

            .header {
                margin-top: .15rem;
                background: url(~~assets/img/main_content/exercise/sentence-bg-yellow.png) no-repeat center;
                padding: .2rem .4rem;
                background-size: 100% 100%;
                box-sizing: border-box;
                text-indent: 2em;
                font-size: 26px;
                text-shadow: 0 1px 2px black;
                color: #ffffff;
                font-family: "楷体";
            }
            .answer-list {
                li {
                    margin-top: .25rem;
                    font-size: 26px;
                    color: lighten(#C7420C, -10%);
                }
                .input-container {
                    width: 70%;
                    margin-top: 15px;
                    height: 40px;
                    background: url("~~assets/img/main_content/exercise/line-yellow.png") no-repeat center / 100% 60%;
                    background-position: 0 .15rem;
                    position: relative;
                }
                .answer-input {
                    display: block;
                    width: 100%;
                    border: none;
                    margin: 0 24px;
                    outline: none;
                    background: none;
                    color: #0b2f49;
                    position: absolute;
                    top: 0;
                    left: 0;
                    font-family: GothamRounded-Book;
                }

                .answer {
                    display: inline-block;
                    width: 78%;
                }
                .radio-true {
                    display: inline-block;
                    background: url(~~assets/img/main_content/exercise/T-yellow.png) no-repeat center;
                    width: 55px;
                    height: 60px;
                    cursor: pointer;
                    background-size: 100% 100%;
                    vertical-align: middle;
                    margin: 0 4% 0 2%;
                    &.active {
                        background-image: url("~~assets/img/main_content/exercise/T-yellow-active.png");
                    }
                }
                .radio-false {
                    display: inline-block;
                    background: url(~~assets/img/main_content/exercise/F-yellow.png) no-repeat center;
                    width: 55px;
                    height: 60px;
                    cursor: pointer;
                    background-size: 100% 100%;
                    vertical-align: middle;
                    &.active {
                        background-image: url("~~assets/img/main_content/exercise/F-yellow-active.png");
                    }
                }
            }

        }
    }
</style>
