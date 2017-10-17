<template>
    <div>
        <transition name="fade">
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-left" v-if="contentInfo.image.length">
                            <div class="content-picture">
                                <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            </div>
                        </div>
                        <div class="content-right">
                            <ul>
                                <li v-for="item in contentInfo.sentences">
                                    <em class="name" v-if="item.name.length>0">{{item.name}}:</em>
                                    <div class="sentence">
                                        <em :style="{'display':pinyinSwitch ? 'block':'none'}">{{item.pinyin}}</em>
                                        <em>{{item.chinese}}</em>
                                        <em>{{item.english}}</em>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-2" v-if="templateStyle ==='style-2'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-tools" v-if="contentInfo.audio">
                            <span class="parts-audio"></span>
                            <span>PLAY</span>
                        </div>
                        <div class="content-picture" v-if="contentInfo.image">
                            <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                        </div>
                        <div class="content-text">
                            <ul class="content-topic" v-if="contentInfo.questions">
                                <li v-for="item in (contentInfo.questions)">
                                    <p class="topic">{{item.question}}</p>
                                    <div class="answer">
                                        <div v-for="list in item.answers">{{list.answer}}</div>
                                    </div>
                                </li>
                            </ul>
                            <ul class="content-dialogue" v-if="contentInfo.sentences">
                                <li v-for="item in contentInfo.sentences">
                                    <em class="name" v-if="item.name.length">{{item.name}}:</em>
                                    <div class="text">
                                        <p class="en" :style="{'display':pinyinSwitch ? 'block':'none'}">{{item.pinyin}}</p>
                                        <p class="cn">{{item.chinese}}</p>
                                        <p class="en">{{item.english}}</p>
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
                        <div class="content-left" v-if="contentInfo.image.length">
                            <div class="content-picture">
                                <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            </div>
                        </div>
                        <div class="content-right" v-iscroll="scroll">
                            <ul>
                                <li v-for="item in contentInfo.sentences">
                                    <em class="name" v-if="item.name&&item.name.length>0">{{item.name}}:</em>
                                    <div class="sentence">
                                        <p class="en" :style="{'display':pinyinSwitch ? 'block':'none'}">
                                            {{item.pinyin}}</p>
                                        <p class="cn">{{item.chinese}}</p>
                                        <p class="en">{{item.english}}</p>
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
    import {mapState, mapGetters, mapActions} from 'vuex';
    import utils from '~/plugins/utils';
    import loadingImage from '~/components/loadingImage';

    export default {
        async fetch({store, params, isServer, redirect}) {
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}) {
            return {extendData: params.extendData}
        }, data() {
            return {}
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
        },
        created() {
        },
        computed: {
            scroll() {
                this.$emit('getIscroll');
            },
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
            .content-right {
                width: 5rem;
                height: 4.5rem;
                overflow-y: scroll;
                overflow-x: hidden;
                text-align: left;
                ul li:nth-child(1n) {
                    .name {
                        color: darkmagenta;
                    }
                }
                ul li:nth-child(2n) {
                    .name {
                        color: #4B77BE;
                    }
                }
            }
            .content-left {
                margin-right: .8rem;
            }
            .content-picture {

                img {
                    max-width: 3rem;
                    max-height: 3rem;
                    border-radius: 5px;
                }
            }
            .name {
                display: block;
                margin-right: .1rem;
                color: darkmagenta;
            }
            .sentence {
                display: inline-block;
                em {
                    display: block;
                    text-align: left;
                    margin: .1rem 0;
                }
            }
        }

    }

    .style-4 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
            }
            .content-left, .content-right {
                display: inline-block;
                vertical-align: middle;
            }
            .content-right {

                width: 5rem;
                height: 4.2rem;
                overflow: hidden;
                text-align: left;
                position: relative;

                ul li:nth-child(1n) {
                    .name {
                        color: darkmagenta;
                    }
                }
                ul li:nth-child(2n) {
                    .name {
                        color: #4B77BE;
                    }
                }
            }
            .content-left {
                margin-right: .8rem;
            }
            .content-picture {

                img {
                    max-width: 3rem;
                    max-height: 3rem;
                    border-radius: 5px;
                }
            }
            .name {
                display: block;
                margin-right: .1rem;
                color: darkmagenta;
            }
            .sentence {
                display: inline-block;
                p {
                    display: block;
                    text-align: left;
                    margin: .1rem 0;
                    font-size: 20px;
                }
                .en {
                    font-family: Calibri;
                }
                .cn {
                    font-family: KaiTi, Calibri;
                }
            }
        }

    }

    .style-2 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
                .content-tools {
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 25px;
                    span {
                        display: block;
                        margin: 0 auto;
                    }
                }
                .content-picture {
                    margin-right: 20px;
                    display: inline-block;
                    vertical-align: middle;
                    img {
                        max-width: 250px;
                        max-height: 250px;
                        border-radius: 5px;
                    }
                }
                .content-text {
                    display: inline-block;
                    vertical-align: middle;
                }
                .content-topic {
                    font-size: 20px;
                    display: inline-block;
                    max-width: 700px;
                }
                .content-dialogue {
                    font-size: 16px;
                    display: inline-block;
                    text-align: left;
                    vertical-align: middle;
                    max-width: 700px;
                    overflow-y: scroll;
                    li {
                        margin: 5px 0;
                    }
                    li:nth-child(1n) {
                        .name {
                            color: darkmagenta;
                        }
                    }
                    li:nth-child(2n) {
                        .name {
                            color: #4B77BE;
                        }
                    }
                }
                .topic {
                    text-align: left;
                    margin: .05rem 0;
                }
                .answer {
                    overflow: hidden;
                    div {
                        float: left;
                        min-width: .4rem;
                        height: .42rem;
                        line-height: .42rem;
                        border-radius: .05rem;
                        box-shadow: 0.01rem 0.02rem 0.06rem black;
                        background: linear-gradient(#C7C7C7, #ffffff);
                        margin: .05rem .4rem .05rem .4rem;
                        cursor: pointer;
                        padding: 0 .03rem;
                    }
                }
                .content-tools {
                    span:nth-child(2) {
                        margin-top: 5px;
                        color: green;
                    }
                }
                .parts-audio {
                    background: url("~~assets/img/main_content/course/l2-audio.png") center no-repeat;
                    background-size: cover
                }
            ;
                .parts-audio {
                    cursor: pointer;
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                }

            }
        }
    }
</style>
