<template>
    <div>
        <transition name="fade">
            <div class="style-1">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="title">
                            {{contentInfo.contentTitle}}
                        </div>
                        <div class="container-video" :class="LEVEL_STYLE[parseInt(content.lessons.levelId)-1]">
                            <video :src="addPrefixHost(contentInfo.video)" ref="video" controls="controls"
                                   @click="videoControl">
                            </video>
                        </div>
                        <div class="link">
                            <p class="explain" v-for="item in contentInfo.sentence">{{item}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-2" v-if="templateStyle ==='style-2'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="title">
                            {{contentInfo.sentence}}
                        </div>
                        <div class="picture" v-for="item in contentInfo.image">
                            <loadingImage :src="addPrefixHost(item)"/>
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
        async fetch({store, params, isServer, redirect}) {
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}) {
            return {extendData: params.extendData}
        }, data() {
            return {
                LEVEL_STYLE: [
                    'l1-video-bg',
                    'l2-video-bg',
                    'l3-video-bg',
                    'l4-video-bg'
                ]
            }
        },
        methods: {
            videoControl: function () {
                if (this.$refs.video.paused) {
                    this.$refs.video.play();
                } else {
                    this.$refs.video.pause();
                }
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
                content: state => state.contentInfo,
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
                font-size: 15px;
                position: relative;
                margin-bottom: 15px;
            }
            .title {
                position: absolute;
                width: 100%;
                font-size: 25px;
                font-family: Calibri;
                font-weight: 800;
                top: -10px;
            }
            .l1-video-bg {
                width: 6.1rem;
                height: 4rem;
                margin: 0 auto;
                background: url("~~assets/img/main_content/course/lv1-video-bg.png") center center no-repeat;
                background-size:contain ;
                video {
                    width: 76%;
                    height: 70%;
                    margin-left: 0.06rem;
                    margin-top: .63rem;
                    cursor: pointer;
                    -o-object-fit: fill;
                    object-fit: fill;
                    border-radius: 0.07rem;
                }
            }
            .l4-video-bg {
                width: 6.1rem;
                height: 4rem;
                margin: 0 auto;
                background: url("~~assets/img/main_content/course/lv4-video-bg.png") center center no-repeat;
                background-size:contain ;
                video {
                    width: 71%;
                    height: 66%;
                    margin-left: 0.44rem;
                    margin-top: .75rem;
                    cursor: pointer;
                    -o-object-fit: fill;
                    object-fit: fill;
                }
            }
            .link {
                position: absolute;
                bottom: .08rem;
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
                left: 50%;
                width: 100%;
                transform: translate(-50%,50%);
            }

        }

    }

    .style-2 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
                font-size: 18px;
            }

            .title {
                width: 750px;
                margin: 0 auto;
                margin-bottom: 10px;
            }

            .picture {

                img {
                    max-width: 700px;
                    max-height: 300px;
                }

            }
        }

    }
</style>
