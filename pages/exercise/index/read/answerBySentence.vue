<template>
    <div :class="isUpdate&&'fadeIn'">
        <div v-if="templateStyle === 'level-1'">
            <div class="theme-1" v-if="haveImage">
                <div class="container">
                    <header class="header">
                        <p class="sentence" v-for="item in content.sentence">
                            {{item.chinese}}</p>
                    </header>
                    <article class="content">
                        <template v-for="(item,qIndex) in content.questions">
                            <h2 class="question">{{item.english}}</h2>
                            <ul class="answer-list">
                                <li v-for="(ans,aIndex) in item.answers">
                                    <label>
                                        <input type="checkbox"><span
                                            :class="answerArr[qIndex]&&answerArr[qIndex][aIndex]===ans.isRight&&'active'"
                                            @click="l3AnswerHandler(aIndex,qIndex,ans.isRight)"
                                            class="answer-checkbox"></span>
                                    </label>
                                    <img :src="addPrefixHost(ans.answerImage)" class="picture" alt="">
                                </li>
                            </ul>
                        </template>
                    </article>
                </div>
            </div>
            <div class="theme-2" v-if="!haveImage">
                <div class="container">
                    <header class="header">
                        <p class="sentence" v-for="item in content.sentence">
                            {{item.chinese}}</p>
                    </header>
                    <article class="content">
                        <template v-for="(item,qIndex) in content.questions">
                            <h2 class="question">{{item.english}}</h2>
                            <ul class="answer-list">
                                <li v-for="(ans,aIndex)  in item.answers">
                                    <button @click="l3AnswerHandler(aIndex,qIndex,ans.isRight)" class="yellow-btn">
                                        {{ans.enlish}}
                                    </button>
                                </li>
                            </ul>
                        </template>
                    </article>
                </div>
            </div>
        </div>
        <div v-else-if="templateStyle === 'level-2'">
            <div class="theme-3" v-if="content.sentences.length">
                <div class="container" :class="isOverflow(content.sentences.length,5)">
                    <ul class="list">
                        <li v-for="item in content.sentences">
                            <p class="pinyin">{{item.pinyin}}</p>
                            <p>{{item.chinese}}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="theme-4" v-if="content.answers.length">
                <ul class="questions">
                    <li class="question-item" v-for="(item,index) in content.answers">
                        <div class="item" @click="answerHandler(index,item.isRight)">
                            <em class="Identifier" :class="answerArr[index]===item.isRight&&'active'"></em>
                            <span class="answer">{{item.answer}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else-if="templateStyle ==='level-4'" class="theme-5">
            <p class="content" v-for="item in content.sentence"><span
                    class="text">{{item.chinese || item.english || item.pinyin}}</span></p>
            <ul class="question-container">
                <li v-for="(item,index) in content.questions">
                    <h2 class="question">{{item.chinese || item.english || item.pinyin}}</h2>
                    <ul class="answer-list">
                        <template v-if="!item.answerImage" v-for="(answer,itemIndex) in item.answers">
                            <li class="list-item" @click="l4AnswerHandler(index,answer.isRight,itemIndex)"
                                :class="activeArr[index]===itemIndex&&'active'"
                            >
                                <em >{{answer.chinese || answer.english || answer.pinyin}}</em>
                            </li>
                        </template>
                        <template v-else>
                            loadingImage
                        </template>
                    </ul>
                </li>
            </ul>
        </div>
        <div v-else class="coming-soon-container">
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
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
            isOverflow(senLen, maxLen){
                return senLen > maxLen && 'overflow'
            }
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answerArr: [],
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
        isUpdate = false;
        activeArr = [];
        get haveImage() {
            const isImage = R.ifElse(R.prop('answerImage'), R.always(true), R.always(false));
            return R.pipe(R.prop('answers'), R.any(isImage))(this.content);
        }

        get rightArr() {
            let rightArr = [];
            if(this.content.answers){
                rightArr =R.map(R.prop('isRight'))(this.content.answers);
            } else if(this.templateStyle==='level-4'&&this.content.questions){
                const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
                const getLabel  = or(R.prop("chinese"),R.prop("english"),R.prop("pinyin"));
                rightArr =R.pipe(R.map(R.prop("answers")),R.map(R.pipe(R.defaultTo({}),R.find(R.propEq("isRight","T")),R.defaultTo({}),getLabel)))(this.content.questions);
            }
            return  rightArr;
        }

        init() {
            this.$nextTick(_ => {
                this.setAnswer({
                    answer: false,
                    msg: this.rightArr && ` ${R.join("、")(this.rightArr)}`
                });
            })
        }

        mounted() {
            this.init();
        }

        get l3rightArr() {
            return templateStyle === 'level-3' && R.map(R.pipe(R.prop("answers"), R.map(R.prop("isRight"))))(this.content);
        }

        answerHandler(index, isRight) {
            if (!this.answerArr[index]) {
                Vue.set(this.answerArr, index, isRight);
            } else {
                Vue.set(this.answerArr, index, "");
            }
            const answer = R.equals(this.answerArr, this.rightArr);
            this.setAnswer({
                answer,
                msg: `Correct answer: ${R.join("、")(this.rightArr)}`
            });
        }
        l4AnswerHandler(index, isRight,itemIndex=0) {

            Vue.set(this.answerArr, index, isRight);
            Vue.set(this.activeArr, index,itemIndex);
            const answer = R.all(R.equals("T"))(this.answerArr);
            this.setAnswer({
                answer,
                msg: `Correct answer: ${R.join("、")(this.rightArr)}`
            });
        }
        l3AnswerHandler(aIndex, qIndex, isRight) {
            let arr = this.answerArr;
            if (!arr[qIndex]) {
                arr[qIndex] = this.l3rightArr[qIndex].map(item => {
                    return "F"
                });
            }
            if (arr[qIndex][aIndex] === "F") {
                Vue.set(arr[qIndex], aIndex, "T");
            } else {
                Vue.set(arr[qIndex], aIndex, "F");
            }
            const answer = R.equals(this.l3rightArr, arr);
            this.setAnswer({
                answer,
                msg: `${R.join("、")(R.reduce((pre, item) => (pre.concat(item)), [])(this.l3rightArr))}`
            });
        }
    }
</script>

<style lang="scss" scoped>
    .coming-soon {
        width: 600px;
        height: 236px;
        margin: 100px auto auto auto;
        background: url(~~assets/img/exercise/coming.png) no-repeat;
        background-size: 100% 100%;
    }

    .fadeIn {
        animation: fadeIn .4s ease-in;
        transform: translateZ(0);
    }

    @import "~~assets/sass/mixins";

    @keyframes fadeIn {
        from {
            transform-origin: left;
            transform: scaleX(.4);
            opacity: 0;
        }
    }

    .theme-1 {
        .container {
            margin: 0 0 0 20%;
            .header {
                margin-top: .15rem;
                margin-right: 10%;
                background: url(~~assets/img/main_content/exercise/sentence-bg-yellow.png) no-repeat center;
                padding: .2rem .4rem;
                background-size: 100% 100%;
                box-sizing: border-box;
                text-indent: 2em;
                font-size: 26px;
                text-shadow: 0 1px 2px black;
                color: #ffffff;
                font-family: 楷体;
            }
            .content {
                margin-top: 2%;
                margin-left: 5%;
                .question {
                    font-size: 26px;
                    text-indent: 1em;
                    margin-bottom: 2%;
                }
                .answer-list > li {
                    display: inline-block;
                    input[type='checkbox'] {
                        display: none;
                        &:checked + .answer-checkbox {
                            background: rgb(0, 0, 0);
                        }
                    }
                }
                .answer-checkbox {
                    display: inline-block;
                    width: 25px;
                    height: 25px;
                    border-radius: 4px;
                    transition: all .1s linear;
                    border: 2px solid dodgerblue;
                    background: white;
                    vertical-align: top;
                    margin-right: .2rem;
                }
                .picture {
                    width: 2.38rem;
                    height: 1.77rem;
                    vertical-align: middle;
                    margin-right: .4rem;
                }
            }
        }
    }

    .theme-2 {
        .container {
            margin: 0 0 0 20%;
            .header {
                margin-top: .15rem;
                margin-right: 10%;
                background: url(~~assets/img/main_content/exercise/sentence-bg-yellow.png) no-repeat center;
                padding: .2rem .4rem;
                background-size: 100% 100%;
                box-sizing: border-box;
                text-indent: 2em;
                font-size: 26px;
                text-shadow: 0 1px 2px black;
                color: #ffffff;
                font-family: 楷体;
            }
            .content {
                margin-top: 2%;
                margin-left: 5%;
                .question {
                    font-size: 26px;
                    text-indent: 1em;
                    margin-bottom: 2%;
                }
                .answer-list li {
                    display: inline-block;
                    .yellow-btn {
                        font-size: 28px;
                        font-family: 'GothamRounded-Book';
                        padding: .2rem .2rem;
                        box-sizing: border-box;
                        background: url("~~assets/img/main_content/exercise/content-button.png") no-repeat left top 4px;
                        background-size: 100% 100%;
                        border-radius: .3rem;
                        color: white;
                        margin-right: 1rem;

                    }
                }

            }
        }
    }

    .theme-3 {
        text-align: center;
        .container {
            display: inline-block;
            max-width: 776px;
            min-height: 315px;
            background: url("~~assets/img/exercise/level2/xiangkuang.png");
            padding: 10px 60px 60px;
            background-size: 100% 100%;
            margin-bottom: -.4rem;
            &.overflow {
                padding: 1.2rem 1.2rem 2.6rem 1rem;
                margin-bottom: -1rem;
            }
            .list {
                margin: 60px 70px;
                font-size: 20px;
                font-family: GothamRounded-Medium;
                color: #071f30;
                text-align: left;
            }
            .pinyin {
                color: #000000;
                margin: 10px 0;
            }
        }
    }

    .theme-4 {
        text-align: center;
        .questions {
            display: inline-block;
            margin-bottom: .2rem;
            text-align: left;
            width: 9.6rem;
            .question-item {
                display: inline-block;
                width: 50%;
                vertical-align: middle;
                text-align: center;
                margin-top: 20px;
            }
            .item {
                display: inline-block;
                .Identifier {
                    width: 50px;
                    height: 50px;
                    display: inline-block;
                    text-align: center;
                    line-height: 50px;
                    font-family: GothamRounded-Medium;
                    font-size: 32px;
                    color: white;
                    cursor: pointer;
                    background: url("~~assets/img/exercise/level2/gou-normal.png") no-repeat;
                    background-size: 100% 100%;
                    vertical-align: middle;
                    &.active {
                        background-image: url("~~assets/img/exercise/level2/gou-active.png");
                    }
                }
                .answer {
                    padding: 20px 50px;
                    background: url("~~assets/img/exercise/level2/juzi.png") no-repeat;
                    vertical-align: middle;
                    background-size: 100% 100%;
                    color: white;
                    display: inline-block;
                    text-align: left;
                    margin-left: 20px;
                    max-width: 540px;
                    font-size: 18px;
                }
            }
        }
    }

    .theme-5 {
        text-align: center;
        margin: 40px 0;
        .content {
            width: 700px;
            min-height: 100px;
            line-height: 100px;
            text-align: center;
            margin: 10px auto;
            padding: 0 50px;
            @include fullBgWithPicName("bg-purple.png");
            .text {
                line-height: 1.4;
                text-indent: 2em;
                display: inline-block;
                text-align: left;
                font-size: 26px;
                color: #08319f;
                vertical-align: middle;
                font-family: chinese;
                font-weight: 600;
            }
        }
        .question-container {
            margin-top: 30px;
            text-align: left;
            display: inline-block;
            max-width: 800px;
            .question {
                font-size: 26px;
                display: inline-block;
                margin-bottom: 10px;
                color: #08319f;
                text-indent: 2em;
            }
            .answer-list {
                font-size: 22px;
                .list-item {
                    padding: 20px 40px;
                    display: inline-block;
                    margin: 5px 10px;
                    cursor: pointer;
                    @include l2FullBg("pit-lan.png");
                    &.active{
                        transition: all .1s linear;
                        @include l2FullBg("pit.png");
                    }
                }
            }
        }
    }
</style>
