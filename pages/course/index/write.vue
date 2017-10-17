<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="course-content-inside">
                            <div class="course-content-info">
                                <div class="course-content-word">
                                    <img :src="writeImage">
                                </div>
                                <div class="course-content-spell">
                                    <span :style="{'display':pinyinSwitch ? 'block':'none'}" class="en">{{contentInfo.words&&contentInfo.words.pinyin}}</span>
                                    <span class="en">{{contentInfo.words&&contentInfo.words.english}}</span>
                                    <span class="content-hint" @click="hint=!hint" :class="hint&&'active'"></span>
                                </div>
                                <div class="course-content-img">
                                    <div class="content-picture"></div>
                                    <loadingImage :src="addPrefixHost(contentInfo.images&&contentInfo.images.image)"/>
                                </div>
                            </div>
                            <ul class="course-content-tone">
                                <li v-for="(item,index) in contentInfo.stroke">
                                    <div @click="answerHandler(index+1)">
                                        <loadingImage :src="addPrefixHost(item)"/>
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
    import {mapState, mapActions} from 'vuex';
    import loadingImage from '~/components/loadingImage';
    import R from 'ramda';
    export default {
        async fetch({isServer, redirect, store, params}){
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}){
            return {extendData: params.extendData}
        }, data () {
            return {
                getAnswer: [],
                writingPic: "",
                rightOrder: [],
                allObserve: [],
                hint: false,
                isUpdate: false,
            }
        },
        methods: {
            ...mapActions('index/course/index', ['setJudge']),
            answerHandler(order) {
                if (this.rightOrder[0] === order) {
                    if (this.allObserve.length) {
                        this.rightOrder = R.drop(1, this.rightOrder);
                        this.writingPic = this.allObserve[0];
                        this.allObserve = R.drop(1, this.allObserve);
                    }
                } else {
                    this.$message.error("Stroke error ...");
                }
                this.setJudge({practice: true, haveJudge: true});
            },
            init(){
                this.$nextTick(_ => {
                    if (this.contentInfo.strokeorder && this.contentInfo.strokeimg) {
                        this.rightOrder = R.clone(this.contentInfo.strokeorder);
                        this.allObserve = R.clone(this.contentInfo.strokeimg);
                    }
                })
            }
        },
        mounted() {
            this.init();
        },
        watch: {
            contentInfo(){
//                当数据发生变化后执行动画效果
                const initData = {
                    getAnswer: [],
                    writingPic: "",
                    rightOrder: [],
                    allObserve: [],
                    hint: false,
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                this.init();
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 500)
            }
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
            }),
            writeImage() {
                if(this.contentInfo.words){
                    return !this.hint ? this.addPrefixHost(this.writingPic || this.contentInfo.words.image) : this.addPrefixHost(this.contentInfo.images.image_gif);
                }
            }
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
                background: #002D32;
                padding: 10px;
                border-radius: 10px;
                box-sizing: border-box;
            }

            .course-content-inside {
                background: #00565F;
                border-radius: 10px;
                border: 2px dotted white;
                padding: 0.3rem .5rem .1rem .5rem;
                min-height: 3.2rem;
            }

            .course-content-spell, .course-content-word, .course-content-img {
                display: inline-block;
                vertical-align: middle;
            }

            .course-content-word {
                width: 150px;
                height: 150px;
                border-radius: 5px;
                overflow: hidden;
                border: 3px solid #002D32;

                img {
                    width: 100%;
                    height: 100%;
                }

            }

            .course-content-spell {
                margin: 0 60px 0 60px;

                span {
                    display: block;
                    text-align: center;
                    color: white;
                    font-size: 0.25rem;
                    /* margin-top: 0.1rem; */
                    margin-bottom: 0.1rem;
                }

                span:nth-child(1) {
                    color: red;
                }

            }
            .content-hint {
                width: 68px;
                height: 68px;
                border-radius: 50%;
                cursor: pointer;
                background: url("~~assets/img/main_content/course/lv1-hint.png") center no-repeat;
                background-size: cover;
                margin: 0 auto;
                &.active {
                    filter: drop-shadow(2px 2px 2px black)
                }
            }
            .course-content-img {
                width: 210px;
                height: 150px;
                position: relative;

                .content-picture {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    filter: blur(20px);
                    background: white;
                    z-index: 0;
                }

                img {
                    position: absolute;
                    max-width: 210px;
                    max-height: 150px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1;
                    border-radius: 0.05rem;
                }

            }

            .course-content-tone {
                display: block;
                margin: 0.6rem auto 0;
                width: 5rem;
                overflow: auto;
                box-sizing: border-box;
                text-align: center;
                li {
                    width: 80px;
                    height: 45px;
                    padding: 3px;
                    box-sizing: border-box;
                    border-radius: 5px;
                    display: inline-block;
                    background: #002D32;
                    cursor: pointer;
                    margin: 10px;
                    font-size: 25px;

                    div {
                        background: #084E62;
                        width: 100%;
                        height: 100%;
                        border: 2px dotted white;
                        border-radius: 5px;
                        box-sizing: border-box;
                        img {
                            width: 45%;
                            height: 100%;
                        }
                    }

                }
            }
        }

    }

</style>
