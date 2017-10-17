<template>
    <div class="container" :class="isUpdate&&'fadeIn'">
        <div class="theme-1" v-if="templateStyle==='level-1'">
            <div class="container">
                <aside class="pit-words">
                    <div class="chinese-words" data-name="word-button" v-for="(item,index) in content.answers"
                         :class="activeIndex === item.order&&'active'"
                         @click="answerHandler(item,item.order)">
                        <em v-if="item.chinese">{{item.chinese}}</em>
                        <em v-else-if="item.english">{{item.english}}</em>
                        <em v-else-if="item.pinyin">{{item.pinyin}}</em>
                    </div>
                </aside>
                <h2 class="english">
                    <div class="question" v-for="(sen,index) in content.sentences"
                         v-html="getHtml(sen,index)">
                    </div>
                </h2>

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
                    activeText: "",
                    activeIndex: "",
                    answerArr: {},
                    eleArr: [],
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                this.init();
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600)
            }
        },


    })
    export default class chooseAnswer extends Vue {
        activeText = "";
        activeIndex = "";
        answerArr = {};
        eleArr = [];
        isUpdate = false;

        created() {
            this.$nextTick(_ => {
                const pits = document.querySelectorAll(".topic-pit-btn");
                R.forEach(item => {
                    const questionOrder = item.getAttribute('data-question');
                    if (!this.eleArr[questionOrder]) {
                        this.eleArr[questionOrder] = [];
                    }
                    this.eleArr[questionOrder].push(item);
                })(pits);
                const addEventListener = (event, fn, isPre = false) => {
                    return (item) => {
                        item.addEventListener(event, fn, isPre);
                    }
                };
                R.forEach(addEventListener("click", this.clickFn, false))(pits);
            });
        }

        mounted() {
            this.init();
        }

        answerHandler(word, order) {
            this.activeText = word.pinyin || word.chinese || word.english;
            this.activeIndex = order;
        }

        clickFn(e) {
            let ele = e.target;
            const answerOrder = ele.getAttribute('data-answer');
            const questionOrder = ele.getAttribute('data-question');

//            没有内容且选择了词汇
            if (!ele.innerText && this.activeText) {
//                先清空所有内容
                this.eleArr[questionOrder].forEach((item) => {
                    item.innerText = ""
                });
                this.answerArr[questionOrder] ? void 0 : this.answerArr[questionOrder] = [];
                for (let i = 0, length = Object.keys(this.eleArr[questionOrder]).length; i < length; i++) {
                    this.answerArr[questionOrder][i] = "0";
                }
                //                先清空所有内容
                ele.innerText = this.activeText;
                this.answerArr[questionOrder][answerOrder] = this.activeIndex + "";

            } else {
                ele.innerText = "";
                if (this.answerArr[questionOrder][answerOrder]) {
                    this.answerArr[questionOrder][answerOrder] = "0";
                } else {
                    this.answerArr[questionOrder] ? void 0 : this.answerArr[questionOrder] = [];
                    for (let i = 0, length = Object.keys(this.eleArr[questionOrder]).length; i < length; i++) {
                        this.answerArr[questionOrder][i] = "0";
                    }
                }
            }
            if (this.activeText) {
                let allAnswer = [];
                for (let key in this.answerArr) {
                    allAnswer = allAnswer.concat(this.answerArr[key]);
                }
                const answer = R.any(R.pipe(R.split(","), R.equals(allAnswer)))(this.content.answerOrder[0]);
                this.setAnswer({
                    answer,
                    msg: `${R.split("、")(this.content.answerOrder[0])}`
                })
            }
        }

        init() {
            this.$nextTick(_ => {

                if (this.content.answerOrder) {
                    this.setAnswer({
                        answer: false,
                        msg: `${R.split("、")(this.content.answerOrder[0])}`
                    })
                }
            })

        }

        getHtml(sen, num) {
            const indexArr = R.match(/\[.]/g, sen);
            indexArr.forEach((item, index) => {
                sen = sen.replace(/\[.]/, `<div data-answer="${index}" data-question="${num}" class='topic-pit-btn'></div>`)
            });
            return sen;
        }
    }
</script>
<style lang="scss">
    .theme-1 {
        .topic-pit-btn {
            width: 1.4rem;
            font-size: 18px;
            height: .5rem;
            vertical-align: middle;
            display: inline-block;
            border-radius: .2rem;
            font-family: "楷体";
            box-shadow: -4px 4px 6px 2px #D63D0C inset, 2px -2px 6px #ffffff inset;
            background: #FB9A1E;
            text-align: center;
            line-height: .5rem;
            margin: 0 .1rem;
            cursor: pointer;

        }
    }
</style>
<style lang="scss" scoped>
    @import "~~assets/sass/mixins";

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
        color: white;
        font-family: GothamRounded-Book;
        .question {
            line-height: 1.9;
        }
        .container {
            text-align: left;
            margin-top: 50px;
            display: inline-block;
            min-height: 4rem;
            width: 700px;
            padding: 20px 70px;
            @include fullBgWithMainContentPicName("answer-bg.png");
            .answer {
                vertical-align: middle;
            }
            .english {
                margin: .3rem 0;
                font-family: Calibri;
                font-size: 28px;

            }
            .chinese {
                margin: .3rem 0;
                font-size: 28px;
                font-family: 'GothamRounded-Book';
                .pit {
                    width: 1.4rem;
                    height: .5rem;
                    vertical-align: middle;
                    display: inline-block;
                    border-radius: .2rem;
                    box-shadow: -4px 4px 6px 2px #D63D0C inset, 2px -2px 6px #ffffff inset;
                    background: #FB9A1E;
                    margin: 0 .1rem;
                }
            }
            .pit-words {
                margin-top: .3rem;
                .chinese-words {
                    font-size: 18px;
                    font-family: 'GothamRounded-Book', "楷体";
                    padding: .2rem .4rem;
                    box-sizing: border-box;
                    margin: 0 10px;
                    display: inline-block;
                    background: url("~~assets/img/main_content/exercise/content-button.png") no-repeat left top 4px;
                    background-size: 100% 100%;
                    border-radius: .3rem;
                    cursor: pointer;
                    &.active {
                        transition: all .1s ease-in;
                        background-image: url('~~assets/img/main_content/exercise/button-yellow-active.png');
                    }

                }
            }
        }
    }

</style>