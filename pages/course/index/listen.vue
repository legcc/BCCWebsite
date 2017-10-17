<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="tool" v-if="contentInfo.audio&&contentInfo.audio.length">
                            <span class="parts-audio" @click="playAudio($event)"></span>
                            <span>PLAY</span>
                        </div>
                        <div class="chunk">
                            <div class="column" v-for="(item,index) in contentInfo.questions">
                                <div class="column-picture" v-if="item.image&&item.image.length">
                                    <loadingImage :src="addPrefixHost(item.image)"/>
                                </div>
                                <div class="column-info">
                                    <h1 class="column-issue en">{{item.question}}</h1>
                                    <ul class="column-option">
                                        <li v-for="list in item.words"
                                            @click="setOption($event,index,list.isRight);Answer($event,index,list.isRight)">
                                            <div class="inside">
                                                <div class="tb">
                                                    <span :style="{'display':pinyinSwitch ? 'block':'none'}" class="py">{{list.pinyin || ""}}</span>
                                                    <span class="cn">{{list.chinese}}</span>
                                                    <span class="en">{{list.english}}</span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
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
        async fetch({store, params, isServer, redirect}){
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}){
            return {extendData: params.extendData}
        },
        data () {
            return {
                creatAnswer: [],
                getAnswer: [],
                contrast: [],
                errorMessage: ""
            }
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            playAudio(ev){
                this.$emit("playAudio", this.addPrefixHost(this.contentInfo.audio), ev);
            },
            setOption(e, Index, isRight){
                const questions = document.querySelectorAll(".column");
                for (let j = 0; j < questions[Index].getElementsByTagName("li").length; j++) {
                    questions[Index].getElementsByTagName("li")[j].classList.remove('active');
                }
                e.currentTarget.classList.add('active');
            },
            Answer(e, Index, isRight){
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
            init(){
                this.$nextTick(_ => {
                    if (this.contentInfo.questions) {
                        if (this.getAnswer.length < this.contentInfo.questions.length) {
                            for (let i = 0; i < this.contentInfo.questions.length; i++) {
                                this.getAnswer.push(0);
                                this.contrast.push(1);
                                for (let j = 0; j < this.contentInfo.questions[i].words.length; j++) {
                                    if (this.contentInfo.questions[i].words[j].isRight === "T") {
                                        this.errorMessage += (this.contentInfo.questions[i].words[j].chinese || this.contentInfo.questions[i].words[j].english) + "<br>";
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
        created () {
        },
        watch: {
            contentInfo(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    creatAnswer: [],
                    getAnswer: [],
                    contrast: [],
                    errorMessage: ""
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
            contentInfo(){
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle,
                pinyinSwitch: state => state.pinyinSwitch,
            }),
        },
        components: {
            loadingImage
        }
    }
</script>

<style lang="less" scoped>
    .style-1 {

        .course_common_box {

            text-align: center;

            .course-content {
                display: inline-block;
                position: relative;
            }
            .py {
                font-size: 15px;
            }
            .tool {
                position: absolute;
                top: 40px;
                left: -100px;
                display: inline-block;

                span {
                    display: block;
                    margin: 0 auto;
                }

                span:nth-child(2) {
                    color: #1F7C84;
                }

            }
            .parts-audio {
                background: url("~~assets/img/main_content/course/lv1-audio.png") center no-repeat;
                background-size: cover;
            }

            .play-active {
                background: url("~~assets/img/main_content/course/lv1-audio-active.png") center no-repeat;
                background-size: cover;
            }

            .parts-audio {
                cursor: pointer;
                width: 68px;
                height: 68px;
                border-radius: 50%;
            }

            .column {
                display: flow-root;
                margin: 0.3rem 0;
                text-align: left;
            }

            .column-picture {
                display: inline-block;
                vertical-align: middle;
                width: 1rem;
                img {
                    max-width: 100px;
                    max-height: 100px;
                }

            }

            .column-info {
                display: inline-block;
                vertical-align: middle;
                margin-left: 20px;
            }

            .column-issue {
                font-size: 25px;
                text-align: left;
            }

            .column-option {
                float: left;

                .active {
                    background: dodgerblue;
                    box-shadow: 0 0 0 3px #619ABE;
                }

                li {
                    vertical-align: top;
                    float: left;
                    background: #084E62;
                    border-radius: 5px;
                    padding: 10px 2px;
                    box-sizing: border-box;
                    font-size: 20px;
                    color: white;
                    margin: 10px 0 0 20px;
                    min-height: 55px;
                    min-width: 80px;
                    box-shadow: 0 0 0 4px #002D32;
                    border: 2px dashed white;
                    cursor: pointer;
                    text-align: center;
                    .inside {
                        display: table;
                        width: 100%;
                        height: 100%;
                    }
                    span {
                        display: block;
                    }

                }

            }

        }

    }

</style>
