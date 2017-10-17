<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <span class="indicate-picture"></span>
                        <div class="sentence">{{contentInfo.sentence}}</div>
                        <div class="parts">
                            <div class="content-tool">
                                <span class="parts-audio" @click="playAudio($event,contentInfo.audio)"></span>
                                <!--<span>PLAY</span>-->
                            </div>
                            <div class="content-tool">
                             <span class="parts-voice" @click="record">
                                          <em>{{timer.count}}</em>
                                    </span>
                                <!--<span>RECORD</span>-->
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
                timer:{
                    count:3
                }
            }
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            playAudio(ev, audio){
                this.$emit("playAudio", this.addPrefixHost(audio), ev);
            },
            record(ev){
                this.$emit("record", ev, this.timer);
            },
        },
        created () {
        },
        computed: {
            contentInfo(){
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle
            }),
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
                width: 7.5rem;
            }

            .sentence {
                font-size: 0.3rem;
                font-family: "Berlin Sans FB";
                text-align: center;
            }

            .indicate-picture {
                display: block;
                width: 90px;
                height: 62px;
                background: url("~~assets/img/main_content/course/listen-picture.png") center no-repeat;
                background-size: contain;
                /* position: absolute; */
                /* top: 23%; */
                /* left: 0; */
                position: absolute;
                top: 50%;
                left: 0;
                -webkit-transform: translateY(-50%);
                -ms-transform: translateY(-50%);
                transform: translateY(-50%);
                /* width: 50%; */
            }

            .parts {
                margin-top: 50px;

                .content-tool {
                    margin: 0 .4rem;
                    display: inline-block;
                    vertical-align: top;

                    span {
                        display: block;
                        margin: 0 auto;
                    }

                    /*span:nth-child(2) {*/
                    /*margin-top: .05rem;*/
                    /*color: #2B86A6;*/
                    /*font-family: -webkit-pictograph;*/
                    /*}*/

                }
            }
            .parts-audio {
                background: url("~~assets/img/main_content/course/lv1-audio.png") center no-repeat;
                background-size: cover;
            }

            .parts-voice {
                background: url("~~assets/img/main_content/course/lv1-speak.png") center no-repeat;
                background-size: cover;
            }

    .parts-audio, .parts-voice {
        width: 68px;
        height: 68px;
        border-radius: 50%;
        cursor: pointer;
        text-align: center;
        line-height: 68px;
        font-size: 25px;
        color: white;
        em{
            display: none;
        }
    }
    .play-active{
        background: url("~~assets/img/main_content/course/lv1-audio-active.png") center no-repeat;
        background-size: cover;
    }
        .active {
            background: url("~~assets/img/main_content/course/lv1-countdown.png") center no-repeat;
            background-size: cover;
            em{
                display: block;
            }
        }
    }
    }
</style>
