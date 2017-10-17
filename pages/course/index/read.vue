<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-left">
                            <div class="content-left-img">
                                <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            </div>
                            <div class="content-left-word">{{contentInfo.english}}</div>
                        </div>
                        <div class="content-right">
                            <div class="content-right-word">
                                <div class="right-word-inside tb" v-for="item in contentInfo.words">
                                    <span :style="{'display':pinyinSwitch ? 'block':'none'}"
                                          class="en">{{item.pinyin}}</span>
                                    <span class="cn">{{item.chinese}}</span>
                                </div>
                            </div>
                            <div class="content-right-parts">
                                <div class="content-tool">
                                    <span class="parts-audio" @click="playAudio($event)"></span>
                                    <span>PLAY</span>
                                </div>
                                <div class="content-tool">
                                    <span class="parts-voice" @click="record">
                                          <em>{{timer.count}}</em>
                                    </span>
                                    <span>RECORD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-2" v-if="templateStyle ==='style-2'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-left">
                            <ul class="content-word-list">
                                <li v-for="item in contentInfo.words">
                                    <span :style="{'display':pinyinSwitch ? 'block':'none'}">{{item.pinyin}}</span>
                                    <div class="content-word">{{item.chinese}}</div>
                                </li>
                            </ul>
                            <span class="content-spell">{{contentInfo.english}}</span>
                        </div>
                        <div class="content-right">
                            <div class="content-right-img">
                                <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            </div>
                        </div>
                        <div class="content-bottom-parts">
                            <div class="content-tool">
                                <span class="parts-audio" @click="playAudio($event)"></span>
                                <span>PLAY</span>
                            </div>
                            <div class="content-tool">
                                <span class="parts-voice" @click="record">
                                          <em>{{timer.count}}</em>
                                </span>
                                <span>RECORD</span>
                            </div>
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
                            <div class="content-left-img">
                                <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            </div>
                        </div>
                        <div class="content-right">
                            <ul class="content-word-list">
                                <li v-for="item in contentInfo.words">
                                    <span>{{item.pinyin}}</span>
                                    <div class="content-word">{{item.chinese}}</div>
                                </li>
                            </ul>
                            <span class="content-spell">{{contentInfo.english}}</span>
                            <div class="content-right-parts">
                                <div class="content-tool">
                                    <span class="parts-audio" @click="playAudio"></span>
                                    <span>PLAY</span>
                                </div>
                                <div class="content-tool">
                                    <span class="parts-voice"></span>
                                    <span>RECORD</span>
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
                        <div class="content-right">
                            <div class="content-right-img">
                                <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            </div>
                        </div>
                        <div class="content-left">
                            <ul class="content-word-list">
                                <li v-for="item in contentInfo.words">
                                    <span :style="{'display':pinyinSwitch ? 'block':'none'}">{{item.pinyin}} </span>
                                    <div class="content-word">{{item.chinese}}</div>
                                </li>
                            </ul>
                            <span class="content-spell">{{contentInfo.english}}</span>
                            <div class="content-left-parts">
                                <div class="content-tool">
                                    <span class="parts-audio" @click="playAudio($event)"></span>
                                    <span>PLAY</span>
                                </div>
                                <div class="content-tool">
                                    <span class="parts-voice" @click="record">
                                          <em>{{timer.count}}</em>
                                    </span>
                                    <span>RECORD</span>
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

    export default {
        async fetch({isServer, redirect, store, params}) {
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}) {
            return {extendData: params.extendData}
        }, data() {
            return {
                timer: {count: 5},
            }
        },
        methods: {
            playAudio(ev) {
                this.$emit("playAudio", this.addPrefixHost(this.contentInfo.audio), ev);
            },
            record(ev) {
                this.$emit("record", ev, this.timer);
            },
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
        },
        created() {
        },
        computed: {
            contentInfo() {
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

            .course-content {
                text-align: center;

                .content-left, .content-right {
                    display: inline-block;
                    vertical-align: middle;
                }

                .content-left {
                    margin-right: 70px;
                    max-width: 3rem;
                }

                .content-right {
                    margin-left: 70px;
                }

                .content-left-img {
                    display: block;
                    width: 280px;
                    height: 180px;
                    border: 3px solid black;
                    margin: 0 auto .2rem;
                    background: white;

                    img {
                        width: 100%;
                        height: 100%;

                    }

                }
                .content-left-word {
                    font-size: 25px;
                    font-family: 'Showcard Gothic Bold', 'Showcard Gothic Normal', 'Showcard Gothic';
                }

                .content-right-word {
                    background: #002D32;
                    box-sizing: border-box;
                    padding: 5px;
                    border-radius: 5px;
                    display: table;
                    margin: 0 auto;

                    .right-word-inside {
                        border-radius: 5px;
                        border: 2px dotted white;
                        background: #084E62;
                        color: white;
                        padding: 5px 10px 5px 10px;
                        min-width: 1.55rem;
                        box-sizing: border-box;
                        height: 118px;
                        font-size: 35px;

                        span {
                            display: block;
                        }

                    }

                }
                .content-right-parts {
                    margin-top: 50px;

                    .content-tool:nth-child(1) {
                        margin-right: .2rem;
                    }

                    .content-tool:nth-child(2) {
                        margin-left: .2rem;
                    }

                    .content-tool {
                        display: inline-block;
                        vertical-align: top;

                        span {
                            display: block;
                            margin: 0 auto;
                        }

                        span:nth-child(2) {
                            margin-top: .05rem;
                            color: #2B86A6;
                            font-family: -webkit-pictograph;
                        }

                    }
                }
                .parts-audio {
                    background: url("~~assets/img/main_content/course/lv1-audio.png") center no-repeat;
                    background-size: cover;
                }

                /*.audio-active {*/
                /*background: url("~~assets/img/main_content/course/lv1-audio-active.png") center no-repeat;*/
                /*background-size: cover;*/
                /*}*/

                .parts-voice {
                    background: url("~~assets/img/main_content/course/lv1-speak.png") center no-repeat;
                    background-size: cover;

                    em {
                        display: none;
                    }

                }

                /*.voice-active {*/
                /*background: url("~~assets/img/main_content/course/lv1-speak-active.png") center no-repeat;*/
                /*background-size: cover;*/
                /*}*/

                .parts-audio, .parts-voice {
                    display: inline-block;
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                    cursor: pointer;
                    text-align: center;
                    line-height: 68px;
                    font-size: 25px;
                    color: white;
                }

                .play-active {
                    background: url("~~assets/img/main_content/course/lv1-audio-active.png") center no-repeat;
                    background-size: cover;
                }

                .active {
                    background: url("~~assets/img/main_content/course/lv1-countdown.png") center no-repeat;
                    background-size: cover;

                    em {
                        display: block;
                    }

                }

            }

        }
    }

    .style-2 {

        .course_common_box {

            .course-content {
                text-align: center;

                .content-left, .content-right {
                    display: inline-block;
                    vertical-align: middle;
                }

                .content-left {
                    margin-right: 20px;

                    .content-word-list {

                        li {
                            display: inline-block;
                            margin: 0 5px 0 5px;

                            span {
                                display: block;
                                margin-bottom: 10px;
                                font-size: 25px;
                            }

                            .content-word {
                                width: 120px;
                                height: 120px;
                                border: 5px solid #37860E;
                                border-radius: 10px;
                                font-size: 80px;
                                box-shadow: 0px 2px 8px -1px black;
                                font-family: cursive;
                                line-height: 120px;
                                background: url("~~assets/img/main_content/course/l2-word-bg.jpg") center no-repeat;
                                background-size: cover;
                            }

                        }
                    }
                    .content-spell {
                        margin-top: 15px;
                        display: block;
                        font-size: 22px;
                    }

                }
                .content-right {
                    margin-left: 20px;

                    .content-right-img {
                        width: 2.8rem;
                        height: 2.5rem;
                        background-size: 100% 100%;
                        border-radius: 15px;
                        overflow: hidden;
                        background: url("~~assets/img/main_content/course/l2-word-frame.png") center no-repeat;
                        background-size: 100% 100%;

                        img {
                            width: 91%;
                            height: 90%;
                            margin: 7px 2.5px 0 0;
                            border-radius: 5px;
                        }

                    }

                }

                .content-bottom-parts {
                    margin-top: 20px;

                    .content-tool {
                        display: inline-block;
                        margin: 0 20px;

                        span {
                            display: block;
                            margin: 0 auto;
                        }

                        span:nth-child(2) {
                            margin-top: .05rem;
                            color: green;
                        }

                    }
                }
                .parts-audio {
                    background: url("~~assets/img/main_content/course/l2-audio.png") center no-repeat;
                    background-size: cover;
                }

                .parts-voice {
                    background: url("~~assets/img/main_content/course/l2-speak.png") center no-repeat;
                    background-size: cover;
                    em {
                        display: none;
                    }
                }

                .parts-audio, .parts-voice {
                    display: inline-block;
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                    cursor: pointer;
                    text-align: center;
                    line-height: 68px;
                    font-size: 25px;
                    color: white;
                }
                .play-active {
                    background: url("~~assets/img/main_content/course/l2-audio-active.png") center no-repeat;
                    background-size: cover;
                }
                .active {
                    background: url("~~assets/img/main_content/course/lv2-countdown.png") center no-repeat;
                    background-size: cover;

                    em {
                        display: block;
                    }

                }
            }

        }
    }

    .style-3 {

        .course_common_box {

            .course-content {
                text-align: center;

                .content-left, .content-right {
                    display: inline-block;
                    vertical-align: middle;
                }

                .content-left {
                    margin-right: 30px;
                }

                .content-right {
                    margin-left: 30px;

                    .content-word-list {

                        li {
                            display: inline-block;
                            margin: 0 10px 0 10px;

                            span {
                                display: block;
                                margin-bottom: 10px;
                                font-size: 25px;
                            }

                            .content-word {
                                width: 1.2rem;
                                height: 1.2rem;
                                font-size: 0.8rem;
                                line-height: 1.2rem;
                                background: url("~~assets/img/main_content/course/l3-word-bg.png") center center no-repeat;
                                background-size: 100% 100%;
                                vertical-align: middle;
                            }

                        }
                    }
                    .content-spell {
                        margin-top: 15px;
                        display: block;
                        font-size: 20px;
                        font-weight: 800;
                    }

                }
                .content-left-img {
                    width: 2.6rem;
                    height: 2.7rem;
                    background: url("~~assets/img/main_content/course/l3-picture-frame.png") center center no-repeat;
                    background-size: 100% 100%;

                    img {
                        width: 2.2rem;
                        height: 2.2rem;
                        margin: 0.25rem 0 0 0.07rem;

                    }

                }

                .content-right-parts {
                    margin-top: 20px;

                    .content-tool:nth-child(1) {
                        margin-right: .2rem;
                    }

                    .content-tool:nth-child(2) {
                        margin-left: .2rem;
                    }

                    .content-tool {
                        display: inline-block;

                        span {
                            display: block;
                            margin: 0 auto;
                        }

                        span:nth-child(2) {
                            margin-top: .05rem;
                            color: #9B422E;
                        }

                    }
                }
                .parts-audio {
                    background: url("~~assets/img/main_content/course/l3-audio.png") center no-repeat;
                    background-size: cover;
                }

                .parts-voice {
                    background: url("~~assets/img/main_content/course/l3-speak.png") center no-repeat;
                    background-size: cover;
                }

                .parts-audio, .parts-voice {
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                    cursor: pointer;
                }

            }

        }
    }

    .style-4 {

        .course_common_box {

            .course-content {
                text-align: center;

                .content-left, .content-right {
                    display: inline-block;
                    vertical-align: middle;
                }

                .content-left {
                    margin-left: 20px;

                    .content-word-list {

                        li {
                            display: inline-block;
                            margin: 0 5px 0 5px;

                            span {
                                display: block;
                                margin-bottom: 10px;
                                font-size: 30px;
                                font-family: Calibri;
                            }

                            .content-word {
                                width: 1rem;
                                height: 1rem;
                                line-height: 1rem;
                                font-size: 0.7rem;
                                font-family: cursive;
                                background: url("~~assets/img/main_content/course/l4-word-bg.jpg") center no-repeat;
                                background-size: 100% 100%;
                            }

                        }
                    }
                    .content-spell {
                        margin-top: 15px;
                        display: block;
                        font-size: 25px;
                        font-family: Calibri;
                    }

                }
                .content-right {
                    margin-right: 20px;
                }

                .content-right-img {
                    display: block;
                    width: 2.7rem;
                    height: 1.8rem;
                    border: 3px solid black;
                    border-radius: 10px;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;

                    }

                }

                .content-left-parts {
                    margin-top: 20px;

                    .content-tool:nth-child(1) {
                        margin-right: .2rem;
                    }

                    .content-tool:nth-child(2) {
                        margin-left: .2rem;
                    }

                    .content-tool {
                        display: inline-block;

                        span {
                            display: block;
                            margin: 0 auto;
                        }

                        span:nth-child(2) {
                            margin-top: .05rem;
                            color: #24418F;
                        }

                    }
                }
                .parts-audio, .parts-voice {
                    display: inline-block;
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                    cursor: pointer;
                    text-align: center;
                    line-height: 68px;
                    font-size: 25px;
                    color: white;
                }
                .parts-audio {
                    background: url("~~assets/img/main_content/course/l41_voice_icon.png") center no-repeat;
                    background-size: cover;
                }

                .parts-voice {
                    background: url("~~assets/img/main_content/course/l41_speak_icon.png") center no-repeat;
                    background-size: cover;
                    em {
                        display: none;
                    }
                }
                .play-active {
                    background: url("~~assets/img/main_content/course/l41_audio_play-active.png") center no-repeat;
                    background-size: cover;
                }
                .active {
                    background: url("~~assets/img/main_content/course/lv4-countdown.png") center no-repeat;
                    background-size: cover;

                    em {
                        display: block;
                    }

                }
            }

        }
    }
</style>
