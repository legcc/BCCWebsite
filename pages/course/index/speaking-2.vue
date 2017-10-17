<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="course-title en">{{this.contentInfo.title}}</div>
                        <div class="dialogue">
                            <div class="one-picture">
                                <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            </div>
                            <div class="role-speak">
                                <div class="inside">
                                <span v-for="item in this.contentInfo.sentences">
                                    <em :style="{'display':pinyinSwitch ? 'block':'none'}" class="en">{{item.pinyin}}</em>
                                    <em class="cn">{{item.chinese}}</em>
                                </span>
                                </div>
                            </div>
                        </div>
                        <div class="dialogue">
                            <div class="two-info">
                                <div class="two-picture"></div>
                                <span>you</span>
                            </div>
                            <div class="tool">
                                  <span class="parts-voice" @click="record">
                                          <em>{{timer.count}}</em>
                                  </span>
                            </div>
                            <div class="record">
                                <div class="waviness">
                                    <div class="inside">
                                        <span class="voice-icon"></span>
                                        <span class="voice-wave"></span>
                                    </div>
                                </div>
                                <div class="you-speak en">
                                    {{this.contentInfo.notices}}
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
        }, data () {
            return {
                timer: {
                    count: 10
                },
                isUpdate: false
            }
        },
        methods: {
            playAudio(ev){
                this.$emit("playAudio", this.addPrefixHost(this.contentInfo.audio), ev);
            },
            record(ev){
                this.$emit("record", ev, this.timer);
                this.setJudge({practice: true, haveJudge: true});
            },
            init(){
                this.$nextTick(_ => {
                })
            },
            ...mapActions('index/course/index', ['setJudge']),
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
                templateStyle: state => state.templateStyle,
                pinyinSwitch: state => state.pinyinSwitch,
//
            }),
        },
        mounted() {
            this.init();
        },
        watch: {
            contentInfo(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    timer: {
                        count: 10
                    },
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

    }

    .course-title {
        font-size: 20px;
        color: rgb(1, 102, 102);
    }

    .dialogue {
        text-align: left;
        margin: .3rem 0;
    }

    .tool {
        display: inline-block;
        vertical-align: middle;
        margin: 0 .2rem;
    }

    .parts-voice {
        display: inline-block;
        width: 68px;
        height: 68px;
        border-radius: 50%;
        cursor: pointer;
        text-align: center;
        line-height: 68px;
        font-size: 25px;
        color: white;
        background: url("~~assets/img/main_content/course/lv1-speak.png") center no-repeat;
        background-size: cover;

    em {
        display: none;
    }

    }
    .active {
        background: url("~~assets/img/main_content/course/lv1-countdown.png") center no-repeat;
        background-size: cover;

    em {
        display: block;
    }

    }
    .one-picture {
        display: inline-block;
        vertical-align: middle;
        width: 120px;
        height: 125px;
        margin-right: 1.08rem;

    img {
        width: 100%;
        height: 100%;
    }

    }
    .two-info {
        display: inline-block;
        vertical-align: middle;
        font-size: 25px;
        text-align: center;
    }

    .two-picture {
        width: 120px;
        height: 120px;
        /* border: 1px solid black; */
        background: url("~~assets/img/main_content/course/you-head.png") center 5px no-repeat;
        background-size: contain;
    }

    .role-speak {
        display: inline-block;
        vertical-align: middle;
        color: white;
        font-size: 20px;
        background: #002D32;
        box-sizing: border-box;
        padding: 8px;
        border-radius: 5px;

    .inside {
        border-radius: 5px;
        border: 2px dashed white;
        background: #084E62;
        color: white;
        padding: 5px 10px 5px 10px;
        min-width: 3.04rem;
        min-height: 1.55rem;
        box-sizing: border-box;
    }

    span {
        display: block;

    em {
        display: block;
        font-size: 22px;
    }

    }
    }

    .record {
        display: inline-block;
        vertical-align: middle;

    .waviness {
        display: inline-block;
        vertical-align: middle;
        color: white;
        background: #002D32;
        box-sizing: border-box;
        padding: 8px;
        border-radius: 5px;

    .inside {
        border-radius: 5px;
        border: 2px dashed white;
        background: #084E62;
        color: white;
        padding: 5px;
        min-width: 1.55rem;
        box-sizing: border-box;
    }

    }
    .voice-icon {
        display: inline-block;
        vertical-align: middle;
        width: 50px;
        height: 50px;
        background: url("~~assets/img/main_content/course/voice-img.png") center center no-repeat;
        background-size: contain;
    }

    .voice-wave {
        display: inline-block;
        vertical-align: middle;
        width: 220px;
        height: 50px;
        margin: 0 .1rem;
        background: url("~~assets/img/main_content/course/sound-wave.png") center center no-repeat;
        background-size: contain;
    }

    .you-speak {
        font-size: 20px;
        color: rgb(1, 102, 102);
        width: 310px;
    }

    }
    }

    }

</style>
