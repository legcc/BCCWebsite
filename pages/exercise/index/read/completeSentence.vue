<template>
    <div :class="isUpdate&&'fadeIn'"
    >
        <div class="theme-1" v-if="!haveImg">
            <ul class="sentence">
                <li v-for="item in content.sentences">
                    <span class="pinyin">{{item.pinyin}}</span>
                    <em>{{item.chinese || item.english}}</em>
                </li>
            </ul>
            <ul class="question">
                <li class="list" v-for="(item,index) in content.questions">
                    <label v-html="getHtml(item.question,index)"></label>
                </li>
            </ul>
        </div>
        <div class="theme-2" v-if="haveImg">
            <div class="container">
                <img src="~assets/img/img-loading.png" alt="" class="picture">
                <ul class="question">
                    <li class="list" v-for="(item,index) in content.questions">
                        <label v-html="getHtml(item.question,index)"></label>
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
                const initData = {};
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
        isUpdate = false;
        answerArr = [];

        get haveImg() {
            return R.ifElse(R.prop('image'), R.T, R.F)(this.content)
        }

        created() {
            this.$nextTick(_ => {
                const pits = document.querySelectorAll(".question-input");
                const addEventListener = (event, fn, isPre = false) => {
                    return (item) => {
                        item.addEventListener(event, fn, isPre);
                    }
                };
                R.forEach(addEventListener("input", this.inputFn, false))(pits);

            })
        }

        mounted() {
            this.init();
        }

        inputFn(ev) {
            const target = ev.target;
            const questionId = target.getAttribute("data-question");
            const answerId = target.getAttribute("data-answer");
            const keyOrder = R.split(",", this.content.questions[questionId].keyAnswer[answerId].keyOrder);
            let result = false;
            if (!this.answerArr.length) {
                this.answerArr = R.map(R.F)(this.content.questions);
            }
            this.content.questions[questionId].keyWords.forEach((item, index) => {
                if (R.contains(item.order, keyOrder) && result === false) {

//                    此处由于不知道会包含什么关键字 所以我把三种关键字都包含了 但是有些关键字可能是空字符 所以必定正确 之后在做调整吧 不是代码有问题
                    result = !!(R.contains(item.chinese, target.value) || R.contains(item.pinyin, target.value) || R.contains(item.english, target.value));
                }
            });
            this.answerArr[questionId] = result;
            const answer = R.all(R.clone, this.answerArr);
            const answerMsg = this.content.questions.map(question => {
                const arr = [];
                question.keyAnswer.forEach(item => {
                    R.split(",")(item.keyOrder).forEach(item => {
                        const keyword = question.keyWords[item - 1];
                        arr.push(keyword.chinese || keyword.pinyin || keyword.english);
                    })
                });
                return arr;
            });
            this.setAnswer({
                answer,
                msg: `${(R.join('、', answerMsg))}`
            });
        }

        init() {
            this.$nextTick(_ => {
                const answerMsg = this.content.questions && this.content.questions.map(question => {
                        const arr = [];
                        question.keyAnswer.forEach(item => {
                            R.split(",")(item.keyOrder).forEach(item => {
                                const keyword = question.keyWords[item - 1];
                                arr.push(keyword.chinese || keyword.pinyin || keyword.english);
                            })
                        });
                        return arr;
                    });

                this.setAnswer({
                    answer: false,
                    msg: `${(R.join('、', answerMsg))}`
                });

            })
        }

        getHtml(sen, questionId) {
            const indexArr = R.match(/\[.]/g, sen);
            indexArr.forEach((item, index) => {
                sen = sen.replace(/\[.]/, `<input class='question-input' data-answer="${index}" data-question="${questionId}" type='text'>`)
            });
            return sen;
        }
    }
</script>
<style lang="less">
    .question-input {
        background: none;
        border: none;
        outline: none;
        border-bottom: 2px solid #1670b3;
        width: 100px;
    }
</style>
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
        text-align: center;
        .sentence {
            width: 650px;
            text-align: left;
            color: #0000b8;
            margin: 30px auto auto auto;
            font-size: 20px;
            padding: .6rem .5rem .6rem .7rem;
            font-family: GothamRounded-Book;
            background: url("~~assets/img/exercise/text-bg.png") no-repeat;
            background-size: 100% 100%;
            .pinyin {
                color: #a50000;
                display: block;
                font-size: 16px;
                margin: 5px 0 5px 60px;
            }
        }
        .question {
            margin-top: 30px;
            display: inline-block;
            text-align: left;
            font-size: 22px;
            color: #1670b3;
            font-family: GothamRounded-Book;
            .list:not(:first-child) {
                margin-top: 50px;
            }
        }
    }

    .theme-2 {
        text-align: center;
        .container {
            display: inline-block;
            margin-top: 40px;
        }
        .picture {
            vertical-align: middle;
            width: 300px;
        }
        .question {
            vertical-align: middle;
            display: inline-block;
            max-width: 480px;
            margin-left: 60px;
            text-align: left;
            font-size: 22px;
            color: #071f30;
            font-family: GothamRounded-Book;
            .list {
                line-height: 2
            }
            .list:not(:first-child) {
                margin-top: 50px;
            }
        }
    }

</style>