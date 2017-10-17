<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <span class="indicate-picture"></span>
                        <ul class="word-list">
                            <li v-for="item in contentInfo.words">
                                <div class="en">
                                    <p :class="contentInfo.toneType=='initial'?'in-click':''"
                                       @click="playAudio($event,item.initialsAudio)">
                                        <span>{{item.initials}}</span>
                                    </p>
                                    <p :class="contentInfo.toneType=='final'?'in-click':''"
                                       @click="playAudio($event,item.finalsAudio)">
                                      <span>
                                          {{item.finals}}
                                      </span>
                                    </p>
                                </div>
                                <div class="cn">
                                    {{item.chinese}}
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
    export default {
        async fetch({store, params, isServer, redirect}){
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}){
            return {extendData: params.extendData}
        }, data () {
            return {}
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            playAudio(ev, audio){
                if (audio) {
                    this.$emit("playAudio", this.addPrefixHost(audio), ev);
                }
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

            .indicate-picture {
                display: block;
                width: 80px;
                height: 100px;
                background: url("~~assets/img/main_content/course/click-picture.png") center no-repeat;
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
            .word-list {
                font-weight: 700;
                font-size: 45px;
                li {
                    margin: .4rem .6rem;
                    display: inline-block;
                    vertical-align: middle;

                    p {
                        display: inline-block;
                        vertical-align: middle;
                        margin: .05rem .1rem;
                    }

                }
            }
            .in-click {
                background: #002D32;
                border-radius: 5px;
                padding: 5px;
                color: white;
                cursor: pointer;
                display: inline-block;

                span {
                    display: block;
                    box-sizing: border-box;
                    height: 100%;
                    background: #00565F;
                    border: 2px dashed white;
                    border-radius: 5px;
                    padding: 5px 20px;
                    min-width: 1.25rem;
                }
              .play-active{
                  background: #619ABE;
              }
            }
        }
    }
</style>
