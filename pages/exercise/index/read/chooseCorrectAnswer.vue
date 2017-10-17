<template>
    <div :class="isUpdate&&'fadeIn'">
        <div v-if="templateStyle==='level-1'" class="theme-1">
            <div class="practice_read_choose practice_common_box">
                <div class="read_choose_content">
                    <div class="center_cell">
                        <div class="read_choose_select">
                            <ul class="read_choose_issue">
                                <template v-for="item in content.sentence" v-if="Array.isArray(content.sentence)">
                                    <li class="pinyin" v-if="item.pinyin"><span>{{item.pinyin}}</span></li>
                                    <li class="chinese" v-if="item.Chinese"><span>{{item.Chinese}}</span></li>
                                </template>
                                <li class="question-pinyin" v-if="content.pinyin">{{content.pinyin}}</li>
                                <li class="question-sentence" v-if="!Array.isArray(content.sentence)">
                                    <span>{{content.sentence}}</span></li>
                                <li class="question"
                                    v-html="content.question&&content.question.replace(/\[.*\]/g,`<div class='issue-input'></div>`)">
                                </li>
                            </ul>
                            <div class="choose_option">
                                <p class="read_choose_option"
                                   @click="answerHandler(0,aIndex)"
                                   v-for="(answer,aIndex) in content.answers"
                                   :class="isActive(0,aIndex)">
                                    <span>{{answer.answer}}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="templateStyle==='level-4'" class="theme-2">
            <div class="template-content">
                <div class="content">
                    {{content.sentence}}
                </div>
                <div class="select-contianer">
                    <template v-for="(item,qIndex) in content.questions">
                        <p class="question">{{item.question}}</p>
                        <ul>
                            <li class="option" v-for="(answer,aIndex) in item.answers">
                                <span class="checkbox"
                                      @click="answerHandler(qIndex,aIndex)"
                                      :class="isActive(qIndex,aIndex)"
                                ></span>
                                <span class="answer">{{answer.answer}}</span>
                            </li>
                        </ul>
                    </template>
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
                contentInfo: state => state.contentInfo,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
            rightArr(){
                const arr = [];
                if (this.content.questions) {
                    this.content.questions && this.content.questions.forEach(_ => {
                        const itemArr = [];
                        _.answers.forEach((item, index) => {
                            R.equals(item.isRight, 'T') && itemArr.push(index);
                        });
                        arr.push(itemArr);
                    });
                } else {
                    const itemArr = [];
                    this.content.answers && this.content.answers.forEach((item, index) => {
                        R.equals(item.isRight, 'T') && itemArr.push(index);
                    });
                    arr.push(itemArr);
                }
                return arr;

            }
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
                    activeIndex: []
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
        activeIndex = [];
        isUpdate = false;

        answerHandler(qIndex, aIndex) {
            this.activeIndex[qIndex] || (_ => {
                Vue.set(this.activeIndex, qIndex, new Set());
            })();
            if (this.activeIndex[qIndex].has(aIndex)) {
                this.activeIndex[qIndex].delete(aIndex);
                Vue.set(this.activeIndex, qIndex, this.activeIndex[qIndex]);

            } else {
                this.activeIndex[qIndex].add(aIndex);
                Vue.set(this.activeIndex, qIndex, this.activeIndex[qIndex]);
            }
            const indexMap = R.addIndex(R.map);
            const result = indexMap((item, index) => {
                    if (this.activeIndex[index]) {
                        if (this.activeIndex[index].size === item.length) {
                            return R.all(R.contains(R.__, [...R.nth(index, this.activeIndex)]))(item);
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
            )(this.rightArr);
            const answer = R.all(R.clone)(result);
            this.setAnswer({
                answer,
                msg: `${R.map(i => R.prop('answer')(this.content.answers[+i]))(R.unnest(this.rightArr))}`
            });
        }

        init() {
            this.$nextTick(_ => {
                this.setAnswer({
                    answer: false,
                    msg: this.rightArr && `${R.map(i => R.prop('answer')(this.content.answers[+i]))(R.unnest(this.rightArr))}`
                });

            })
        }


        mounted() {
            this.init();
        }

        isActive(qIndex, aIndex) {
            return this.activeIndex[qIndex] && this.activeIndex[qIndex].has(aIndex) && 'active';
        }
    }
</script>
<style lang="scss">
    .read_choose_issue .issue-input {
        vertical-align: middle;
        display: inline-block;
        min-height: 30px;
        min-width: 60px;
        border-bottom: 2px solid;
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
        .practice_common_box {
            width: 750px;
            height: 100%;
            display: block;
            margin: 1% auto 0 auto;
            position: relative;
        }
        .read_choose_content {
            width: 100%;
            height: 100%;
            text-align: center;
            display: table;
        }
        .center_cell {
            display: table-cell;
            vertical-align: middle;
        }
        .read_choose_sentence {
            width: 600px;
            height: 200px;
            background: url(~~assets/img/main_content/exercise/answer_title_bg.png) no-repeat;
            background-size: 100% 100%;
            background-position: center;
            display: table;
            margin: 0 auto;
            padding-left: 20px;
            padding-right: 20px;
        }
        .read_choose_sentence p {
            margin: 0;
            color: #0000FF;
            font-size: 20px;
            padding: 40px;
            text-align: initial;
        }
        .center_cell {
            display: table-cell;
            vertical-align: middle;
        }
        .read_choose_select {
            display: block;
            width: 100%;
            height: auto;
            font-size: 24px;
            text-align: center;
            margin-top: 50px;
        }
        .read_choose_issue, .read_choose_option {
            display: block;
        }
        .read_choose_issue {
            color: coral;
            font-weight: 700;
            margin-bottom: 20px;
            text-align: left;
            padding: 0.06rem 0 0.01rem 0px;
            text-shadow: 0 1px 2px #cccccc;
            span {
                display: inline-block;
                text-align: left;
                text-indent: 2em;
                line-height: 1.2;
                word-break: break-all;
                font-weight: 600;
                font-family: Calibri,c;
                margin: 10px 0;
                color: rgba(73, 154, 255, 0.98);
            }
            .question-sentence {
                text-align: center;
                margin-bottom: -10px;
                span {
                    line-height: 1.6;
                }
            }
            .question-pinyin {
                text-align: center;
                margin-bottom: -20px;
                color: #ff53ab;
            }
            .pinyin span {
                margin: 0;
                color: #ff53ab;
            }
            .chinese span {
                margin: 0;
            }
            .question {
                margin: 30px;
                text-align: center;
            }
        }
        .read_choose_option {
            display: block;
            clear: both;
            cursor: pointer;
            width: 350px;
            margin: 0 auto;
            height: 40px;
            line-height: 40px;
            border-radius: 20px;
            background-color: white;
            color: #0082AA;
            margin-bottom: 10px;
            text-align: center;
            position: relative;
            &.active {
                background-color: #20a0ff;
                color: white;
            }
        }
        .read_choose_option {
            display: block;
            clear: both;
            cursor: pointer;
            width: 350px;
            margin: 0 auto;
            height: 40px;
            line-height: 40px;
            border-radius: 20px;
            background: white;
            color: #0082AA;
            margin-bottom: 10px;
            position: relative;
        }
        .read_choose_option i {
            position: absolute;
        }
    }

    .theme-2 {
        .template-content {
            width: 1000px;
            margin: 2% 0 0 22%;
        }
        .content {
            width: 900px;
            height: 180px;
            margin-left: -50px;
            background: url(~~assets/img/exercise/content-title.png) no-repeat;
            background-size: 100% 100%;
            font-family: "楷体", GothamRounded-Book;
            font-weight: bolder;
            font-style: normal;
            font-size: 32px;
            text-align: left;
            text-indent: 2em;
            word-break: normal;
            color: #30c;
            padding: 10px 50px;
            line-height: normal;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            cursor: default;
        }
        .select-contianer {
            width: 900px;
        }
        .question {
            font-family: Calibri Bold, Calibri Regular, Calibri;
            font-weight: 700;
            font-style: normal;
            font-size: 36px;
            color: #3e347a;
            line-height: normal;
            text-align: left;
            margin-top: 15px;
        }
        .question + ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-direction: column;
            flex-direction: column;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            width: 100%;
            height: 140px;
            -ms-flex-pack: start;
            justify-content: flex-start;
        }

        .option {
            height: 50%;
            width: 50%;
            text-align: left;
        }
        .option .checkbox {
            vertical-align: top;
            width: 37px;
            height: 41px;
            background: inherit;
            margin: 5px 12px;
            background-color: #fff;
            box-sizing: border-box;
            border: 1px solid #797979;
            cursor: pointer;
            border-radius: 4px;
            &.active {
                background-color: black;
            }
        }
        .option .answer, .option .checkbox {
            line-height: normal;
            display: inline-block;
        }
        .option .answer {
            font-family: Arial Normal, Arial;
            font-weight: 600;
            font-style: normal;
            font-size: 24px;
            color: #333;
            text-align: center;
            border: 3px dashed #fff;
            padding: 8px 12px;
        }

    }
</style>
