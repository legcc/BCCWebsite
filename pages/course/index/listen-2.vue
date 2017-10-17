<template>
    <div>
        <transition name="fade">
            <div class="style-2" v-if="templateStyle ==='style-2'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="left-module">
                            <div class="tool">
                                <span class="parts-audio" @click="playAudio($event)"></span>
                                <span>PLAY</span>
                            </div>
                            <div class="play-progress">

                            </div>
                        </div>
                        <div class="content-right">
                            <ul class="content-topic">
                                <li v-for="(item,index) in contentInfo.questions" class="column">
                                    <p class="topic">{{index + 1}}.{{item.question}}</p>
                                    <div class="answer">
                                        <div :class="(list.answer=='T'||list.answer=='F')?'list-type-2':'list-type-1'"
                                             v-for="list in item.answers"  @click="setOption($event,index,list.isRight);Answer($event,index,list.isRight)">{{list.answer}}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-left">
                            <div class="headset-picture"></div>
                            <div class="left-module">
                                <div class="tool">
                                    <span class="parts-audio"></span>
                                    <span>PLAY</span>
                                </div>
                                <div class="play-progress">

                                </div>
                            </div>
                        </div>
                        <div class="content-right">
                            <ul class="content-topic">
                                <li v-for="(item,index) in contentInfo.questions">
                                    <p class="topic"><i>{{++index}}.</i>{{item.question}}</p>
                                    <div class="answer">
                                        <div v-for="list in item.answers">{{list.answer}}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-4" v-if="templateStyle ==='style-4'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-left">
                            <div class="tool">
                                <span class="parts-audio" @click="playAudio($event)"></span>
                                <span>PLAY</span>
                            </div>
                        </div>
                        <div class="content-right">
                            <ul class="content-topic">
                                <li v-for="(item,index) in contentInfo.questions" class="column">
                                    <p class="topic en">{{index + 1}}.{{item.question}}</p>
                                    <div class="answer">
                                        <span v-for="list in item.answers"
                                              @click="setOption($event,index,list.isRight);Answer($event,index,list.isRight)">{{list.answer}}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
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
                content: state => state.contentInfo,
                templateStyle: state => state.templateStyle
            }),
        }
    }
</script>

<style lang="less" scoped>
    .style-2 {

        .course_common_box {

            text-align: center;

            .course-content {
                display: inline-block;
            }
            .left-module {
                display: inline-block;
                vertical-align: middle;
                margin-right: .5rem;
                span {
                    display: block;
                }
                span:nth-child(2) {
                    margin-top: .05rem;
                    color: green;
                }
            }
            .parts-audio {
                width: 68px;
                height: 68px;
                border-radius: 50%;
                cursor: pointer;
                background: url("~~assets/img/main_content/course/l2-audio.png") center no-repeat;
                background-size: cover;
            }
            .play-active {
                background: url("~~assets/img/main_content/course/l2-audio-active.png") center no-repeat;
                background-size: cover;
            }
            .content-right {
                display: inline-block;
                vertical-align: middle;
                max-width: 800px;
            }
            .topic {
                font-size: 22px;
                text-align: left;
                margin: .05rem 0;
            }
            .answer {
                min-height: 50px;
                .list-type-1 {
                    float: left;
                    min-width: .4rem;
                    height: .42rem;
                    line-height: .42rem;
                    border-radius: 0.05rem;
                    box-shadow: 0.01rem 0.02rem 0.06rem black;
                    background: linear-gradient(#ffffff 0, #ACACAC 90%);
                    margin: .05rem .32rem .05rem .32rem;
                    cursor: pointer;
                    padding: 0 .03rem;
                    font-size: 20px;
                    &:hover {
                        background: linear-gradient(#bababa 100%, #ffffff 55%);
                    }
                    &.active {
                        background: linear-gradient(#bababa 100%, #ffffff 55%);
                    }
                }
                .list-type-2 {
                    margin: .05rem .32rem .05rem .32rem;
                    width: 0.45rem;
                    height: 0.45rem;
                    border-radius: 0.05rem;
                    line-height: 0.45rem;
                    font-size: 0.22rem;
                    background: linear-gradient(#ffffff 0, #ACACAC 90%);
                    float: left;
                    cursor: pointer;
                    box-shadow: 0.01rem 0.02rem 0.06rem black;
                    &:hover {
                        background: linear-gradient(#bababa 100%, #ffffff 55%);
                    }
                    &.active {
                        background: linear-gradient(#bababa 100%, #ffffff 55%);
                    }
                }
            }
        }

    }

    .style-3 {

        .course_common_box {

            text-align: center;

            .course-content {
                display: inline-block;
            }

            .content-left, .content-right {
                display: inline-block;
                vertical-align: middle;
            }
            .headset-picture {
                width: 1.2rem;
                height: 1.2rem;
                background: url("~~assets/img/main_content/course/l3-headset-picture.png") center no-repeat;
                background-size: cover;
            }

            .left-module {
                margin-top: 20px;
                .tool {
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 10px;
                    span {
                        display: block;
                        color: rgb(129, 30, 29);
                    }

                    span:nth-child(2) {
                        margin-top: .05rem;
                    }
                }
                .parts-audio {
                    background: url("~~assets/img/main_content/course/l3-audio.png") center no-repeat;
                    background-size: cover;
                }
                .parts-audio {
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                    cursor: pointer;
                }
                .play-progress {
                    margin-left: 10px;
                    display: inline-block;
                    vertical-align: middle;
                    width: 100px;
                    height: 30px;
                }
            }
            .content-right {
                max-width: 800px;
            }
            .content-topic {
                font-size: 20px;
                display: inline-block;
            }
            .topic {
                text-align: left;
                margin: .05rem 0;
                i {
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    line-height: 30px;
                    border-radius: 50%;
                    background: #811e1d;
                    text-align: center;
                    margin-right: 5px;
                }
            }
            .answer {
                overflow: hidden;
                div {
                    float: left;
                    min-width: .4rem;
                    height: .42rem;
                    line-height: .42rem;
                    background: #811e1d;
                    border-radius: 0.05rem;
                    -webkit-box-shadow: -0.03rem -0.03rem 0 0 #591113 inset;
                    box-shadow: -0.03rem -0.03rem 0 0 #591113 inset;
                    margin: .05rem .32rem .05rem .32rem;
                    cursor: pointer;
                    padding: 0 .03rem;
                    color: white;
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
            }
            .content-left, .content-right {
                display: inline-block;
                vertical-align: middle;
            }
            .tool {
                display: inline-block;
                vertical-align: middle;
                margin-right: .5rem;
                span {
                    display: block;
                }
                span:nth-child(2) {
                    margin-top: .05rem;
                    color: #24418F;
                }
            }
            .parts-audio {
                width: 68px;
                height: 68px;
                border-radius: 50%;
                cursor: pointer;
                background: url("~~assets/img/main_content/course/l41_voice_icon.png") center no-repeat;
                background-size: cover;
            }
            .play-active {
                background: url("~~assets/img/main_content/course/l41_audio_play-active.png") center no-repeat;
                background-size: cover;
            }
            .play-progress {
                margin-left: 10px;
                display: inline-block;
                vertical-align: middle;
                width: 100px;
                height: 30px;
                border: 1px solid black;
            }
            .content-right {
                max-width: 800px;
            }
            .content-topic {
                font-size: 24px;
                display: inline-block;
            }
            .topic {
                text-align: left;
                margin: .1rem 0;
            }
            .answer {
                overflow: hidden;
                span {
                    display: inline-block;
                    float: left;
                    width: .45rem;
                    height: .45rem;
                    line-height: .45rem;
                    border-radius: 5px;
                    background: rgb(40, 37, 82);
                    font-size: 20px;
                    color: white;
                    cursor: pointer;
                    margin: 0 1rem 0 .5rem;
                    &.active {
                        background: rgb(131, 106, 216);
                    }
                }
                span:hover {
                    background: rgb(131, 106, 216);
                }
            }
        }

    }

</style>
