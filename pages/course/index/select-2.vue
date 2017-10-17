<template>
    <div>
        <transition name="fade">
            <div class="style-2" v-if="templateStyle ==='style-2'">
                <div class="course_common_box">
                    <div class="course-content">
                        <ul class="content-topic">
                            <li v-for="(item,index) in contentInfo.questions">
                                <p class="topic"><em>{{++index}}.</em>{{item.question}}</p>
                                <div class="select">
                                    <div class="select-set" v-for="list in item.answers"
                                         v-if="list.answer!='T'&&list.answer!='F'">
                                        <label>
                                            <input type="radio" name="1"/>
                                            <div>{{list.answer}}</div>
                                        </label>
                                    </div>
                                    <div class="tf-option" v-for="list in item.answers"
                                         v-if="list.answer=='T'||list.answer=='F'">
                                        {{list.answer}}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-top">
                            <div class="top-topic" v-for="(item,index) in contentInfo.questions">
                                <div class="inside">
                                    <div class="tb">
                                        <span class="topic"><i>{{++index}}.</i><em>{{item.question}}</em></span>
                                        <div class="select">
                                            <div v-for="list in item.answers">{{list.answer}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-4" v-if="templateStyle ==='style-4'">
                <div class="course_common_box">
                    <div class="course-content">
                        <ul class="content-topic">
                            <li v-for="(item,supIndex) in contentInfo.questions" class="column">
                                <span class="topic en">{{supIndex + 1}}.{{item.question}}</span>
                                <div class="select">
                                    <div class="select-set" v-for="list in item.answers"
                                         v-if="list.answer!='T'&&list.answer!='F'"
                                         @click="setOption($event,supIndex,list.isRight);Answer($event,supIndex,list.isRight)">
                                        <label>
                                            <input type="radio" :name="supIndex"/>
                                            <span>{{list.answer}}</span>
                                        </label>
                                    </div>
                                    <span class="tf-option" v-for="list in item.answers"
                                          v-if="list.answer=='T'||list.answer=='F'"
                                          @click="setOption($event,supIndex,list.isRight);Answer($event,supIndex,list.isRight)">
                                        {{list.answer}}
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import loadingImage from '~/components/loadingImage';
    import R from 'ramda';
    import Vue from 'vue';

    export default {
        async fetch({store, params, isServer, redirect}) {
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}) {
            return {extendData: params.extendData}
        }, data() {
            return {
                creatAnswer: [],
                getAnswer: [],
                contrast: [],
                errorMessage: "",
            }
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            playAudio(ev) {
                this.$emit("playAudio", this.addPrefixHost(this.contentInfo.audio), ev);
            },
            setOption(e, Index, isRight) {
                const questions = document.querySelectorAll(".column");
                for (let j = 0; j < questions[Index].getElementsByTagName("span").length; j++) {
                    questions[Index].getElementsByTagName("span")[j].classList.remove('active');
                }
                e.currentTarget.classList.add('active');
            },
            Answer(e, Index, isRight) {
                if (isRight === "T") {
                    this.getAnswer[Index] = 1;
                } else {
                    this.getAnswer[Index] = 0;
                }
                //判断所有数值是否为1
                let answer = false;
                if (this.getAnswer.join(",") === this.contrast.join(",")) {
                    answer = true;
                }
                this.setAnswer({
                    answer: answer,
                    msg: this.errorMessage
                });
            },
            init() {
                this.$nextTick(_ => {
                    if (this.contentInfo.questions) {
                        if (this.getAnswer.length < this.contentInfo.questions.length) {
                            for (let i = 0; i < this.contentInfo.questions.length; i++) {
                                this.getAnswer.push(0);
                                this.contrast.push(1);
                                for (let j = 0; j < this.contentInfo.questions[i].answers.length; j++) {
                                    if (this.contentInfo.questions[i].answers[j].isRight === "T") {
                                        this.errorMessage += (this.contentInfo.questions[i].answers[j].answer || this.contentInfo.questions[i].answers[j].answer) + "<br>";
                                    }
                                }
                            }
                        }
                    }
                    this.setAnswer({
                        answer: false,
                        msg: this.errorMessage
                    });
                })
            },
        },
        mounted() {
            this.init()
        },
        created() {
        },
        watch: {
            contentInfo() {
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    creatAnswer: [],
                    getAnswer: [],
                    contrast: [],
                    errorMessage: "",
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600);
                this.init();
            },
        },
        computed: {
            contentInfo() {
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo
            }),
        },
        components: {
            loadingImage,
        }
    }
</script>

<style lang="less" scoped>
    .style-2 {

        .course_common_box {
            margin: 0 auto;
            text-align: center;

            .course-content {
                display: inline-block;
            }
            .content-topic {
                font-size: 20px;
                box-sizing: border-box;
                max-width: 700px;
            }
            .topic {
                margin: .1rem 0;
                display: block;
                text-align: left;
            }
            .select {
                overflow: hidden;
                .select-set {
                    float: left;
                    margin: 0 20px;
                }
                label {
                    input {
                        display: inline-block;
                        margin-right: .08rem;
                        vertical-align: middle;
                    }
                    div {
                        vertical-align: middle;
                        display: inline-block;
                        padding: 0 .1rem;
                        height: 45px;
                        min-width: 45px;
                        box-sizing: border-box;
                        font-size: 0.15rem;
                        line-height: 45px;
                        color: black;
                        border-radius: .1rem;
                        box-shadow: 0.01rem 0.02rem 0.06rem black;
                        background: linear-gradient(#C7C7C7, #ffffff);
                        margin: 5px;
                        cursor: pointer;
                    }
                }
                .tf-option {
                    margin: 0 1rem 0 .5rem;
                    width: 45px;
                    height: 45px;
                    border-radius: 5px;
                    line-height: 45px;
                    font-size: 22px;
                    background: linear-gradient(#C7C7C7, #ffffff);
                    float: left;
                    cursor: pointer;
                }
                .tf-option:hover {
                    background: linear-gradient(#111, #124412);
                    color: white;
                }
            }
        }
    }

    .style-3 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
                max-width: 800px;
            }
            .top-topic {
                vertical-align: middle;
                box-sizing: border-box;
                background: url("~~assets/img/main_content/course/l3-select-bg.png") center center no-repeat;
                background-size: 100% 100%;
                display: inline-block;
                padding: 0 0.05rem;
                margin: 5px;
                .inside {
                    display: table;
                    min-width: 2.8rem;
                    max-width: 3rem;
                    min-height: 2rem;
                }
                .topic {
                    color: white;
                    font-size: 20px;
                    i {
                        display: inline-block;
                        width: .3rem;
                        height: .3rem;
                        border-radius: 50%;
                        background: rgb(237, 148, 33);
                        line-height: .3rem;
                        vertical-align: middle;
                    }
                    em {
                        vertical-align: middle;
                    }
                }
                .select {
                    margin-top: .1rem;
                    padding: 0 10px;
                    box-sizing: border-box;
                    div {
                        min-width: 1.8rem;
                        border-radius: .05rem;
                        padding: .05rem .1rem;
                        background: rgb(237, 174, 81);
                        color: rgb(102, 57, 26);
                        font-size: 20px;
                        margin: .07rem 0;
                        cursor: pointer;
                    }
                }
            }
            .content-bottom {
                margin-top: .5rem;
            }
            .bottom-topic {
                color: white;
                font-size: 20px;
                margin: .2rem 0;
                .topic {
                    display: inline-block;
                    vertical-align: middle;
                    i {
                        display: inline-block;
                        width: .3rem;
                        height: .3rem;
                        border-radius: 50%;
                        background: rgb(151, 42, 35);
                        line-height: .3rem;
                        vertical-align: top;
                        margin-right: .2rem;
                    }
                    em {
                        vertical-align: top;
                        background: rgb(185, 106, 51);
                        padding: .05rem .3rem;
                        border-radius: .2rem;
                    }
                }
                .select {
                    display: inline-block;
                    vertical-align: middle;
                    div {
                        display: inline-block;
                        vertical-align: top;
                        width: .4rem;
                        height: .4rem;
                        line-height: .4rem;
                        color: white;
                        font-size: 22px;
                        background: rgb(129, 30, 29);
                        border-radius: 10px;
                        box-shadow: -3px -3px 0px 0px #591113 inset;
                        cursor: pointer;
                        margin: 0 .2rem;
                    }
                }
            }
        }
    }

    .style-4 {

        .course_common_box {
            margin: 0 auto;
            text-align: center;

            .course-content {
                display: inline-block;
                width: 5rem;
            }
            .content-topic {
                box-sizing: border-box;
                width: 750px;
            }
            .topic {
                font-size: 24px;
                margin: .05rem 0;
                display: block;
                text-align: left;
                font-family: Calibri;
            }
            .select {
                margin: .05rem 0;
                overflow: hidden;
                .select-set {
                    float: left;
                    margin: 0 20px;
                    font-family: Calibri;
                }
                label {
                    input {
                        display: inline-block;
                        margin-right: .08rem;
                        vertical-align: middle;
                    }
                    span {
                        vertical-align: middle;
                        display: inline-block;
                        padding: 0 .1rem;
                        height: 45px;
                        min-width: 45px;
                        box-sizing: border-box;
                        font-size: 18px;
                        line-height: 45px;
                        color: white;
                        background: linear-gradient(rgb(52, 68, 91) 0, rgb(76, 176, 192) 90%);
                        margin: 5px;
                        cursor: pointer;
                        box-shadow: 0rem 0rem 0.03rem black inset;
                        border-radius: 5px;
                    }
                }
                .tf-option {
                    margin: 0 1rem 0 .5rem;
                    width: 45px;
                    height: 45px;
                    border-radius: 5px;
                    line-height: 50px;
                    font-size: 22px;
                    background: rgb(40, 37, 82);
                    color: white;
                    float: left;
                    cursor: pointer;
                    &.active {
                        background: rgb(131, 106, 216);
                    }
                }
                .tf-option:hover {
                    background: rgb(131, 106, 216);
                }
            }
        }
    }

</style>
