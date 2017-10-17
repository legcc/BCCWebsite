<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="topic">
                            <p v-for="item in contentInfo.questions" class="en">
                                {{item}}
                            </p>
                        </div>
                        <div class="container">
                            <div class="picture">
                                <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            </div>
                            <div class="tool">
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
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import loadingImage from '~/components/loadingImage';
    import R from 'ramda';
    import Vue from 'vue';

    export default {
        async fetch({isServer, redirect, store, params}){
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}){
            return {extendData: params.extendData}
        }, data () {
            return {
                timer: {count: 30},
            }
        },
        methods: {
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
                templateStyle: state => state.templateStyle
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
                color: white;
                position: relative;
            }
            .topic {
                /* position: absolute; */
                /* top: 12px; */
                /* left: 0; */
                /* top: -38px; */
                color: black;
                /* display: block; */
                /* width: 4rem; */
                text-align: left;
                font-size: 0.22rem;
                /* left: -3.5rem; */
            }
            .picture {
                margin: 10px auto;
                img {
                    max-width: 7rem;
                    max-height: 2.5rem;
                    border-radius: 5px;
                }
            }
            .tool {
                display: inline-block;
                margin-top: 10px;
                span {
                    display: block;
                    margin: 0 auto;
                }
                span:nth-child(2) {
                    margin-top: .05rem;
                    color: #1F7C84;
                }
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
                em{
                    display: none;
                }
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
