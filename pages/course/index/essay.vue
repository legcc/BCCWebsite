<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="inside">
                            <div class="content-left">
                                <div class="tool" v-if="contentInfo.audio&&contentInfo.audio.length">
                                    <span class="parts-audio" @click="playAudio($event,contentInfo.audio)"></span>
                                </div>
                                <div class="left-picture" v-if="contentInfo.image!=''">
                                    <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                                </div>
                            </div>
                            <div class="content-right">
                                <ul class="right-sentence">
                                    <li v-for="item in (contentInfo.sentences||content.tips)">
                                        <span :style="{'display':pinyinSwitch ? 'block':'none'}"
                                              class="en">{{item.pinyin || ""}}</span>
                                        <span class="cn">{{item.chinese}}</span>
                                        <span class="en">{{item.english}}</span>
                                    </li>
                                </ul>
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
                        <div class="picture" v-if="contentInfo.image!=''">
                            <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                        </div>
                        <div class="content-scroll" v-iscroll="scroll">
                            <ul class="sentence">
                                <li v-for="item in contentInfo.sentences">
                                    <span :style="{'display':pinyinSwitch ? 'block':'none'}"
                                          class="en">{{item.pinyin}}</span>
                                    <span>{{item.chinese}}</span>
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
                        <ul class="sentence">
                            <li v-for="item in contentInfo.sentences">
                                <span>{{item.pinyin}}</span>
                                <span>{{item.chinese}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-4" v-if="templateStyle ==='style-4'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-scroll" v-iscroll="scroll">
                            <div>
                                <p v-for="item in contentInfo.sentences">
                                    <span :style="{'display':pinyinSwitch ? 'block':'none'}"
                                          class="py">{{item.pinyin || ""}}</span>
                                    <span class="hz">{{item.chinese}}</span>
                                </p>
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
                isTips: false,
                Index: "",
            }
        },
        methods: {
            playAudio(ev, audio) {
                this.$emit("playAudio", this.addPrefixHost(audio), ev);
            },
            scroll() {
                this.$emit('getIscroll');
            },
            ...mapActions('index/course/index', ['setAnswer', 'setTurningState', 'setBackbtnState', 'setToolsPage']),
        },
        created() {
            console.log(this.contentInfo)
        },
        computed: {
            contentInfo() {
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                content: state => state.contentInfo,
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
                color: white;
                display: inline-block;
                background: #002D32;
                padding: 0.1rem;
                border-radius: 10px;
                box-sizing: border-box;

                .inside {
                    background: #00565F;
                    border-radius: 10px;
                    border: 2px dashed white;
                    padding: 15px;
                }

            }
            .tool {
                margin: 40px;

                span {
                    display: block;
                    margin: 0 auto;
                }

                span:nth-child(2) {
                    margin-top: .05rem;
                    color: #2B86A6;
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
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                    cursor: pointer;
                }

            }
            .left-picture {

                img {
                    max-width: 2.5rem;
                    max-height: 210px;
                }

            }

            .content-left {
                display: inline-block;
                vertical-align: middle;
            }

            .content-right {
                vertical-align: middle;
                display: inline-block;
                text-align: left;
                width: 500px;
            }

            .right-sentence {
                font-size: 18px;
                padding-left: 25px;
                padding-top: 10px;

                li {
                    margin: 8px 0;

                    span {
                        display: block;
                    }

                }
            }

        }

    }

    .style-2 {

        .course_common_box {
            margin: 0 auto;
            text-align: center;

            .course-content {
                display: inline-block;
            }

            .picture {
                display: inline-block;
                vertical-align: middle;
                margin-right: 25px;

                img {
                    max-width: 3rem;
                    max-height: 3rem;
                    border-radius: 5px;
                }

            }
            .content-scroll {
                display: inline-block;
                vertical-align: middle;
                max-height: 450px;
                max-width: 650px;
                overflow: hidden;
                position: relative;
            }
            .sentence {
                text-align: left;
                font-size: 22px;

                /* max-width: 6rem; */
                .en {
                    font-size: 18px;
                }
                li {
                    margin: 20px 0;

                    span {
                        display: block;
                    }

                    span:nth-child(1) {
                        text-indent: 16px;
                    }

                    li {
                        margin: 10px 0;
                        margin: 5px 0;
                    }

                }
            }
        }

    }

    .style-3 {

        .course_common_box {
            margin: 0 auto;
            text-align: center;

            .course-content {
                display: inline-block;
                width: 800px;
            }

            .sentence {
                text-align: left;
                font-size: 16px;

                /* max-width: 6rem; */

                li {
                    margin: 20px 0;

                    span {
                        display: block;
                    }

                    span:nth-child(1) {
                        text-indent: 16px;
                    }

                    li {
                        margin: 10px 0;
                        margin: 5px 0;
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
                width: 7.5rem;
                height: 450px;
                padding: 10px;
                display: inline-block;
                text-align: left;
                background: url("~~assets/img/main_content/course/l4-essay-bg.png") center no-repeat;
                background-size: 100% 100%;

                .content-scroll {
                    width: 96%;
                    height: 90%;
                    overflow: hidden;
                    margin-top: 21px;
                    position: relative;
                }

                p {
                    position: relative;
                    width: 90%;
                    margin: 0 auto;
                }

                .py {
                    display: block;
                    line-height: 0.52rem;
                    text-indent: 0.38rem;
                    font-size: 14px;
                    font-family: Calibri;
                }

                .hz {
                    display: block;
                    position: absolute;
                    left: 0;
                    top: 0.22rem;
                    line-height: 0.53rem;
                    font-size: 0.14rem;
                    text-indent: 0.35rem;
                    letter-spacing: 0.09rem;
                    font-family: KaiTi;
                }

            }

        }

    }

</style>
