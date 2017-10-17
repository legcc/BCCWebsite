<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="theme-1"
             v-if="templateStyle === 'level-4'||templateStyle === 'level-3'||templateStyle === 'level-1'">
            <div class="content-container">
                <div class="top-content" :class="templateStyle">
                    <ul v-for="item in content.sentences" v-if="item.chinese||item.english||item.pinyin">
                        <li style="color: #be61ba;font-family: GothamRounded-Book">{{item.pinyin}}</li>
                        <li>{{item.chinese}}</li>
                    </ul>
                </div>
            </div>
            <div class="bottom-questions">
                <div class="bottom-answer-outer">
                    <textarea v-model="text" class="bottom-answer" :class="templateStyle"></textarea>
                </div>
            </div>
        </div>
        <div class="theme-2" v-if="templateStyle === 'level-2'">
            <div class="top-content">
                <div class="container">
                    <ul v-for="item in content.sentences">
                        <li class="pinyin">{{item.pinyin}}</li>
                        <li class="chinese">{{item.chinese}}</li>
                    </ul>
                </div>
                <div class="answer" v-for="(item,index) in content.sentences">
                    <input type="text" class="answer-input" @input="answerHandler($event,index)">
                </div>
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
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answerArr: [], text: ""
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
//    数据有问题 所有给他做什么都对吧
    export default class chooseNumber extends Vue {
        answerArr = [];
        isUpdate = false;
        text = "";

        init() {
            this.$nextTick(_ => {
                const answerSentence = this.content.answerSenteces&&R.map(R.replace(/\n\r/g,""))(R.unnest(R.map(R.pipe(R.props(["chinese","english","pinyin"]),R.filter(R.clone),R.map(R.replace(/\n/g,""))))(this.content.answerSenteces)));
                this.setAnswer({
                    answer: true,
                    promptMsg: this.content.answerSenteces && `${R.join("\n")(answerSentence)}`
                });
            })
        }

        mounted() {
            this.init();
        }

        answerHandler(e, index) {
            const inputVal = e.target.value;
            this.answerArr[index] = inputVal;
            const cmp = (x, y) => {
                if (x.english) {
                    return R.contains(x.english, y)
                } else if (x.chinese) {
                    return R.contains(x.chinese, y)
                } else if (x.pinyin) {
                    return R.contains(x.pinyin, y)
                } else {
                    return false;
                }
            };
            const or = R.curry((a, b, c, d) => (a(d) || b(d) || c(d)));
            if (this.content.keyWords) {
                let answer = this.answerArr.length === this.content.keyWords.length ? R.all(item => R.all(R.curry(cmp)(R.__, item))(this.content.keyWords))(this.answerArr) : false;
                this.setAnswer({
                    answer: true,
                    promptMsg: this.content.answerSenteces && `${R.join("\n")(R.unnest(R.map(R.pipe(R.props(["chinese","english","pinyin"]),R.filter(R.clone)))(this.content.answerSenteces)))}`
                });
            } else {
                this.setAnswer({
                    answer: true,
                    promptMsg: this.content.answerSenteces && `${R.join("\n")(R.unnest(R.map(R.pipe(R.props(["chinese","english","pinyin"]),R.filter(R.clone)))(this.content.answerSenteces)))}`
                })
            }
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
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -ms-flex-align: center;
        align-items: center;
        width: 800px;
        margin: 3% 0 0 22%;
        .content-container {
            text-align: center;
            margin: 20px auto;
            min-height: 100px;
            width: 620px;
        }
        .top-content {
            font-family: chinese;
            font-style: normal;
            font-weight: 600;
            text-shadow: 0 -1px 2px white;
            display: inline-block;
            text-align: left;
            font-size: 28px;
            color: #fff;
            line-height: 1.3;
            &.level-3 {
                color: black;
            }
            &.level-1, &.level-4 {
                color: #3c4e80;
            }
        }
        .bottom-questions {
            width: 100%;
            margin-top: 30px;
        }
        .bottom-questions .bottom-answer-outer {
            width: 445px;
            height: 156px;
            overflow: hidden;
            margin: 2% auto;
        }
        .bottom-questions .bottom-answer-outer .bottom-answer {
            width: 445px;
            height: 156px;
            margin-right: -50px;
            background: url(~~assets/img/main_content/exercise/textarea-bg-02.png) 0 0 no-repeat;
            background-size: 100% 100%;
            box-sizing: border-box;
            border: none;
            outline: none;
            padding: 8px 18px 50px 18px;
            border-radius: 5px;
            font-family: chinese;
            font-weight: 600;
            font-style: normal;
            font-size: 22px;
            color: #333;
            line-height: normal;
            &.level-1 {
                background-image: url("~~assets/img/main_content/exercise/textarea-bg-01.png");
            }
        }
    }

    .theme-2 {
        text-align: center;
        .top-content {
            display: inline-block;
            width: 700px;
            min-height: 300px;
            line-height: 300px;
            font-family: GothamRounded-Medium;
            font-weight: bold;
            font-style: normal;
            font-size: 28px;
            color: #071f30;
            text-align: left;
            padding: 1rem 1.2rem 1.4rem 1.9rem;
            margin-top: 20px;
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
                width: 500px;
                overflow: hidden;
                position: relative;
                height: 90px;
                background: url("~~assets/img/exercise/level2/tengtiao.png") no-repeat;
                padding: 0 20px 8px 20px;
                background-size: 100% 100%;
                .answer-input {
                    background: none;
                    position: absolute;
                    font-size: 22px;
                    bottom: .6rem;
                    left: 0;
                    outline: none;
                    border: none;
                    width: 100%;
                    margin: 0 40px;
                }
            }

        }
    }
</style>
