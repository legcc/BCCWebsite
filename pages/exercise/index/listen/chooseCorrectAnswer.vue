<template>
    <div :class="isUpdate&&'fadeIn'">
        <div :class="style">
            <div class="practice_common_box">
                <div class="right-content">
                    <template v-for="(answerInfo,sentenceIndex) in QuestionsAndAnswers">
                        <p class="questions">{{answerInfo.question}}</p>
                        <ul class="answer" @click="templateStyle==='level-4'?l4checkAnswer():checkAnswer()">
                            <template v-if="answerInfo.answer.type==='picture'">
                                <li v-for="(item,index)  in answerInfo.answer.options">
                                    <label><span class="content-checkbox"
                                                 @click="answerHandler(sentenceIndex,item.isRight,index)"
                                                 :class="sentenceActive[sentenceIndex]===index&&'active'"></span></label>
                                    <loadingImage :src="addPrefixHost(item.value)" alt=""
                                                  class="picture"></loadingImage>
                                </li>
                            </template>
                            <template v-else-if="answerInfo.answer.type==='button'">
                                <li v-for="(item,index) in answerInfo.answer.options">
                                    <div class="content-button"
                                         @click="answerHandler(sentenceIndex,item.isRight,index)"
                                         :class="sentenceActive[sentenceIndex]===index&&'active'">
                                        <span>{{item.value}}</span></div>
                                </li>
                            </template>
                            <template v-else-if="answerInfo.answer.type==='checkbox'">
                                <li v-for="(item,index) in answerInfo.answer.options"
                                    :style="{width:`${1/answerInfo.answer.options.length*100}%`}">
                                    <label class="checkbox-container">
                                        <input type="checkbox" :name="answerInfo.question" v-model="answerInfo.correct"
                                               :value="item">
                                        <span class="content-checkbox"></span>
                                        <span class="option">{{item.value}}</span>

                                    </label>
                                </li>
                            </template>
                        </ul>
                    </template>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import Vue from 'vue';
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage';
    export default {
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },
        data () {
            return {
                sentenceActive: [],
                answerArr: [],
                isUpdate: false
            }
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
            answerHandler(sentenceIndex, isRight, index){
                Vue.set(this.answerArr, sentenceIndex, isRight);
                Vue.set(this.sentenceActive, sentenceIndex, index);
            },
            l4checkAnswer(){
                const correctLen = R.map(R.prop("correctLen"))(this.QuestionsAndAnswers);
                const answerArr = R.pipe(R.map(R.prop("correct")),R.defaultTo([[]]),R.map(R.filter(R.propEq("isRight","T"))))(this.QuestionsAndAnswers);
                const answer = answerArr.every((item,index)=>{
                    return item.length === +correctLen[index];
                });


                this.setAnswer({
                    answer,
                    msg:R.pipe(R.map(R.prop('answers')), R.reduce((acc, item) => (acc.concat(R.filter(R.propEq('isRight', 'T'))(item))), []), R.map(R.or(R.prop('answer'), R.always('null'))), R.join(","))(this.content.questions)
                })
            },
            checkAnswer(){

                let answer = false;
                if (this.answerArr.length === this.content.questions.length) {
                    answer = R.all(R.equals('T'))(this.answerArr);
                }
                this.setAnswer({
                    answer,
                    msg: R.pipe(R.map(R.prop('answers')), R.reduce((acc, item) => (acc.concat(R.filter(R.propEq('isRight', 'T'))(item))), []), R.map(R.or(R.prop('answer'), R.always('null'))), R.join(","))(this.content.questions)
                });

            }, init(){
                this.$nextTick(_ => {
                    this.setAnswer({
                        answer: false,
                        msg: this.content.questions && R.pipe(R.map(R.prop('answers')), R.reduce((acc, item) => (acc.concat(R.pipe(R.defaultTo([]),R.filter(R.propEq('isRight', 'T')))(item))), []), R.map(R.or(R.prop('answer'), R.always('null'))), R.join(","))(this.content.questions)
                    });
                })
            }
        },
        mounted(){
            this.init();
        },

        computed: {
            ...mapState('index/exercise/index', {
                content: state => state.contentInfo ? state.contentInfo.content : {},
                templateStyle: state => state.templateStyle
            }),
            style(){
                switch (this.templateStyle) {
                    case "level-4":
                        return 'theme-4';
                    case "level-3":
                        return 'theme-3';
                }
            },
            QuestionsAndAnswers(){
                const obj = [];
//                如果是level4就是选择框 否则是按钮
                this.content.questions.forEach(item => {
                    let type = this.templateStyle === "level-4" ? 'checkbox' : 'button';
                    if (item.answers) {
                        const options = item.answers.map(item => {
                            let option;
//                        如果有图片则是图片按钮
                            if (item.image) {

                                type = "picture";
                                option = {value: item.image, isRight: item.isRight};
                            } else {
                                option = {value: item.answer, state: false, isRight: item.isRight};
                            }
                            return option;
                        });
                        obj.push({
                            question: item.question,
                            answer: {
                                type,
                                options,
                            },
                            correctLen:R.length(R.pipe(R.defaultTo([]),R.filter(R.propEq("isRight","T")))(options)),
                            activeIndex: "",
                            correct: [],
                        });
                    }
                });
                return obj;
            }
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    sentenceActive: [],
                    answerArr: []
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
        components: {loadingImage,}
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

    .theme-4 {
        .practice_common_box {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 900px;
            margin: 0 auto;
            text-align: center;
            margin-top: 3%;
            .right-content {
                width: 698px;
                background: url(~~assets/img/main_content/exercise/questionAnswer-01.png) no-repeat;
                background-size: 100% 100%;
                padding: 5%;
                margin: 0 auto;
                box-sizing: border-box;
                .questions {
                    color: #1B4471;
                    font-size: 30px;
                    text-align: left;
                }
                .answer {
                    .picture {
                        width: 140px;
                        vertical-align: top;
                    }
                    .content-button {
                        cursor: pointer;
                        height: 60px;
                        min-width: 130px;
                        box-sizing: border-box;
                        background: url("~~assets/img/main_content/exercise/content-button.png") no-repeat center;
                        background-size: 100% 100%;
                        border-radius: 5px;
                        line-height: 60px;
                        text-align: center;
                        padding: 0 10%;
                        position: relative;
                        display: inline-block;
                        font-size: 22px;
                        color: #ffffff;
                        &.active {
                            background: url("~~assets/img/main_content/exercise/content-button-active.png") no-repeat center;
                            background-size: 100% 100%;
                            color: black;
                        }
                    }
                }
                .answer > li {
                    display: inline-block;
                    margin-top: 2%;
                    min-width: 30%;
                    label {
                        width: 100%;
                        vertical-align: middle;
                    }
                }
                .checkbox-container {
                    [type = 'checkbox'] {
                        display: none;
                    }
                    [type = 'checkbox']:checked ~ .content-checkbox {
                        background: rgba(0, 0, 0, .5);
                    }
                }
                .content-checkbox {
                    width: 30px;
                    height: 30px;
                    background: #ffffff;
                    border: 2px solid black;
                    border-radius: 5px;
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 10px;
                }
                .answer > li .option {
                    display: inline-block;
                    font-size: 22px;
                    margin-left: 10%;
                    width: 50%;
                    color: blue;
                    user-select: none;
                    border: 3px dashed #ffffff;
                    border-radius: 5px;
                    line-height: 26px;
                    vertical-align: middle;
                }
            }

        }
    }

    .theme-3 {
        .practice_common_box {
            width: 800px;
            margin: 0 auto;
            text-align: left;
            margin-top: 1%;
            .right-content {
                background: url(~~assets/img/main_content/exercise/answer-bg.png) no-repeat;
                background-size: 100% 100%;
                padding: 5%;
                margin: 0 auto;
                box-sizing: border-box;
                .questions {
                    color: #fcf6fa;
                    font-size: 30px;
                    text-align: left;
                }
                .answer {
                    .picture {
                        width: 140px;
                        vertical-align: top;
                    }
                    .content-button {
                        cursor: pointer;
                        height: 60px;
                        min-width: 130px;
                        font-size: 28px;
                        font-family: 宋体;
                        box-sizing: border-box;
                        background: url("~~assets/img/main_content/exercise/content-button.png") no-repeat center;
                        background-size: 100% 100%;
                        border-radius: 5px;
                        line-height: 60px;
                        text-align: center;
                        padding: 0 10%;
                        position: relative;
                        display: inline-block;
                        color: #0b2f49;
                        &.active {
                            background: url("~~assets/img/main_content/exercise/content-button-active.png") no-repeat center;
                            background-size: 100% 100%;
                            color: black;
                        }
                    }
                }
                .answer > li {
                    display: inline-block;
                    margin-top: 2%;
                    min-width: 30%;
                    label {
                        width: 100%;
                        vertical-align: middle;
                    }
                }
                input[type = "radio"] {
                    display: none;
                    &:checked + .content-checkbox {
                        background: rgba(0, 0, 0, .5);
                    }
                }
                .content-checkbox {
                    width: 30px;
                    height: 30px;
                    background: #ffffff;
                    border: 2px solid black;
                    margin: 0 10px;
                    border-radius: 5px;
                    display: inline-block;
                    vertical-align: middle;

                }
                .answer > li .option {
                    display: inline-block;
                    font-size: 22px;
                    margin-left: 10%;
                    width: 50%;
                    color: blue;
                    user-select: none;
                    border: 3px dashed #ffffff;
                    border-radius: 5px;
                    line-height: 26px;
                    vertical-align: middle;
                }
            }

        }
    }
</style>
