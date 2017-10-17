<template>
    <div>
        <transition name="fade">
            <div class="style-2" v-if="true">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-title">
                            <p v-for="(item,index) in contentInfo.sentences" :key="index">{{item}}</p>
                        </div>
                        <div class="content-card">
                            <div class="type-1">
                                <div class="item-one" v-if="contentInfo.images&&contentInfo.images.length===1">
                                    <loadingImage :src="addPrefixHost(contentInfo.images[0].image)"/>
                                </div>
                                <ul class="item-entirety" v-if="contentInfo.images&&contentInfo.images.length>1">
                                    <li v-for="item in contentInfo.images">
                                        <div class="item-picture">
                                            <loadingImage :src="addPrefixHost(item.image)"/>
                                        </div>
                                        <em>{{item.pinyin || ''}}</em>
                                        <em>{{item.chinese || ''}}</em>
                                        <em>{{item.english || ''}}</em>
                                    </li>
                                </ul>
                                <div class="bottom-tools">
                                    <div class="tools">
                                        <span class="parts-voice" :class="templateStyle" @click="record">
                                                        <em>{{timer.count}}</em>
                                        </span>
                                        <!--<span>RECORD</span>-->
                                    </div>
                                    <!--<div class="play-progress">-->
                                    <!--</div>-->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!--<transition name="fade">-->
        <!--<div class="style-3" v-if="templateStyle ==='style-3'">-->
        <!--<div class="course_common_box">-->
        <!--<div class="course-content">-->
        <!--<div class="content-title">-->
        <!--<p v-for="(item,index) in contentInfo.sentences" :key="index">{{item}}</p>-->
        <!--</div>-->
        <!--<div class="content-card">-->
        <!--<div class="type-1">-->
        <!--<div class="item-one" v-if="contentInfo.images.length===1">-->
        <!--<loadingImage :src="addPrefixHost(contentInfo.images[0].image)"/>-->
        <!--</div>-->
        <!--<ul class="item-entirety" v-if="contentInfo.images.length>1">-->
        <!--<li v-for="item in contentInfo.images">-->
        <!--<div class="item-picture">-->
        <!--<loadingImage :src="addPrefixHost(item.image)"/>-->
        <!--</div>-->
        <!--<em>{{item.pinyin || ''}}</em>-->
        <!--<em>{{item.chinese || ''}}</em>-->
        <!--<em>{{item.english || ''}}</em>-->
        <!--</li>-->
        <!--</ul>-->
        <!--<div class="bottom-tools">-->
        <!--<div class="tools">-->
        <!--<span class="parts-voice"></span>-->
        <!--<span>RECORD</span>-->
        <!--</div>-->
        <!--<div class="play-progress">-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</transition>-->
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
                timer: {count: 15},
            }
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            record(ev) {
                this.$emit("record", ev, this.timer);
            },
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
                templateStyle: state => state.templateStyle
            }),
        },
        components: {
            loadingImage
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
            .content-title {
                width: 750px;
                font-size: 20px;
                color: black;
                margin: 0 auto 10px auto;
                font-family: Calibri;
            }
            .type-1 {
                .item-one {
                    margin: 0 auto;
                    img {
                        max-width: 700px;
                        max-height: 220px;
                        border-radius: 5px;
                    }
                }
                .item-entirety {
                    li {
                        display: inline-block;
                        vertical-align: top;
                        em {
                            font-size: 20px;
                            display: block;
                        }
                    }
                }
                .item-picture {
                    width: 2.3rem;
                    height: 1.6rem;
                    background: url("~~assets/img/main_content/course/l2-word-frame.png") center center no-repeat;
                    background-size: 100% 100%;
                    display: block;
                    vertical-align: middle;
                    margin: 0 3px;
                    img {
                        width: 91%;
                        height: 88%;
                        margin: 0.08rem .025rem 0 0rem;
                        border-radius: 5px;
                    }
                }
                .bottom-tools {
                    margin-top: 5px;
                }
                .tools {
                    display: inline-block;
                    vertical-align: middle;
                    span {
                        display: block;
                        /*color: green;*/
                    }

                    span:nth-child(2) {
                        margin-top: .05rem;
                    }
                    .parts-voice {
                        display: block;
                        width: 68px;
                        height: 68px;
                        border-radius: 50%;
                        cursor: pointer;
                        text-align: center;
                        line-height: 68px;
                        font-size: 25px;
                        color: white;
                        em {
                            display: none;
                        }
                        &.style-1 {
                            background: url("~~assets/img/main_content/course/lv1-speak.png") center no-repeat;
                            background-size: cover;
                            &.active {
                                background: url("~~assets/img/main_content/course/lv1-countdown.png") center no-repeat;
                                background-size: cover;
                                em {
                                    display: block;
                                }
                            }
                        }
                        &.style-2 {
                            background: url("~~assets/img/main_content/course/l2-speak.png") center no-repeat;
                            background-size: cover;
                        }
                        &.style-3 {
                            background: url("~~assets/img/main_content/course/l3-speak.png") center no-repeat;
                            background-size: cover;
                        }
                        &.style-4 {
                            background: url("~~assets/img/main_content/course/l41_speak_icon.png") center no-repeat;
                            background-size: cover;
                            &.active {
                                background: url("~~assets/img/main_content/course/lv4-countdown.png") center no-repeat;
                                background-size: cover;
                                em {
                                    display: block;
                                }
                            }
                        }
                    }
                }
                .play-progress {
                    display: inline-block;
                    vertical-align: middle;
                }
            }
            .picture-card {
                display: inline-block;
                margin: .6rem .25rem 0 .25rem;
                font-size: 20px;
                dt {
                    width: 2.5rem;
                    height: 1.7rem;
                    border: 1px solid black;
                    margin-bottom: .2rem;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                dd {
                    margin: .05rem 0;
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
            .content-title {
                width: 750px;
                font-size: 22px;
                color: rgb(212, 68, 32);
                margin: 0 auto 10px auto;
            }
            .type-1 {
                .item-one {
                    margin: 0 auto;
                    img {
                        max-width: 700px;
                        max-height: 350px;
                        border-radius: 5px;
                    }
                }
                .item-entirety {
                    li {
                        display: inline-block;
                        vertical-align: top;
                        em {
                            font-size: 20px;
                            display: block;
                            color: white;
                        }
                    }
                }
                .item-picture {
                    width: 2.5rem;
                    height: 1.8rem;
                    background: url("~~assets/img/main_content/course/l3-picture-frame.png") center center no-repeat;
                    background-size: 100% 100%;
                    display: block;
                    vertical-align: middle;
                    margin: 0 5px;
                    img {
                        width: 85%;
                        height: 81%;
                        margin: 17px 0 0 6px;
                    }
                }
                .bottom-tools {
                    margin-top: 20px;
                }
                .tools {
                    display: inline-block;
                    vertical-align: middle;
                    span {
                        display: block;
                        color: rgb(129, 30, 29);
                    }

                    span:nth-child(2) {
                        margin-top: .05rem;
                    }
                    .parts-voice {
                        display: block;
                        background: url("~~assets/img/main_content/course/l3-speak.png") center no-repeat;
                        background-size: cover;
                        width: 68px;
                        height: 68px;
                        border-radius: 50%;
                        cursor: pointer;
                    }
                }
                .play-progress {
                    display: inline-block;
                    vertical-align: middle;
                }
            }
            .picture-card {
                display: inline-block;
                margin: .6rem .25rem 0 .25rem;
                font-size: 20px;
                dt {
                    width: 2.5rem;
                    height: 1.7rem;
                    border: 1px solid black;
                    margin-bottom: .2rem;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                dd {
                    margin: .05rem 0;
                }
            }
        }

    }

</style>
