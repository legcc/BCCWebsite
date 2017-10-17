<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-title">
                            {{contentInfo.sentence}}
                        </div>
                        <ul class="option-list">
                            <li v-for="(item,index) in wordArr" :class="activeIndex===index&&'active'" ref="option"
                                @click="getOption(index,item,item.order)">
                                <div class="tb">
                                    <span v-if="item.pinyin"
                                          :style="{'display':pinyinSwitch ? 'block':'none'}"
                                          class="en">{{item.pinyin}}</span>
                                    <span class="cn">{{item.chinese}}</span>
                                    <span class="en">{{item.english}}</span>
                                </div>
                            </li>
                        </ul>
                        <div class="picture">
                            <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            <ul class="m1-option-gap">
                                <li v-for="(item,index) in answerArr" @click="setOption(index)"
                                    ref="gap">
                                    <div class="inside">
                                        <div class="tb">
                                        <span v-if="item.pinyin"
                                              :style="{'display':pinyinSwitch ? 'block':'none'}"
                                              class="en">{{item.pinyin}}</span>
                                            <span class="cn">{{item.chinese}}</span>
                                            <span class="en">{{item.english}}</span>
                                        </div>
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
                        <div class="content-title">
                            {{contentInfo.sentence}}
                        </div>
                        <ul class="option-list">
                            <li v-for="(item,index) in wordArr" :class="activeIndex===index&&'active'"
                                @click="getOption(index,item,item.order)">
                                <div class="tb">
                                    {{item.english}}
                                </div>
                            </li>
                        </ul>
                        <div class="picture">
                            <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            <ul class="m2-option-gap">
                                <li v-for="(item,index) in content.words">
                                    <em :style="{'display':pinyinSwitch ? 'block':'none'}">{{item.pinyin}}</em>
                                    <em>{{item.chinese}}</em>
                                    <div class="gap" @click="setOption(index)">
                                        <div class="tb">
                                            {{answerArr[index] && answerArr[index].english}}
                                        </div>
                                    </div>
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
                        <div class="content-title">
                            {{contentInfo.sentence}}
                        </div>
                        <ul class="option-list">
                            <li v-for="item in contentInfo.words">
                                <div class="tb">
                                    <span>{{item.pinyin}}</span>
                                    <span>{{item.chinese}}</span>
                                    <span>{{item.english}}</span>
                                </div>
                            </li>
                        </ul>
                        <div class="picture">
                            <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            <ul class="m3-option-gap">
                                <li v-for="item in contentInfo.words">
                                    <!--<div class="option">-->
                                    <!--<div>-->
                                    <!--<span></span>-->
                                    <!--<span></span>-->
                                    <!--<span></span>-->
                                    <!--</div>-->
                                    <!--</div>-->
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
    import Vue from 'vue';

    export default {
        async fetch({isServer, redirect, store, params}) {
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}) {
            return {extendData: params.extendData}
        }, data() {
            return {
                activeIndex: null,
                activeItem: null,
                answerArr: [],
                correctArr: [],
                errorArr: [],
                isUpdate: false,
                errorMessage: "",
                xOrder: null,
            }

        },
        methods: {
            setOption(index) {
                if (this.activeItem != null) {
                    if (!this.answerArr[index]) {
                        Vue.set(this.answerArr, index, this.activeItem);
                        this.wordArr.splice(this.activeIndex, 1);
                        this.activeItem = null;
                        this.activeIndex = null;
                    } else {
                        this.wordArr.splice(this.activeIndex, 1);
                        this.wordArr.push(this.answerArr[index]);
                        Vue.set(this.answerArr, index, "");
                        Vue.set(this.answerArr, index, this.activeItem);
                        this.activeItem = null;
                        this.activeIndex = null;
                    }
                } else {
                    if (this.answerArr[index]) {
                        this.wordArr.push(this.answerArr[index]);
                        Vue.set(this.answerArr, index, "");
                        this.xOrder = null;
                    }
                }
                this.Answer(index, this.xOrder);
            },
            getOption(index, item, order) {
                this.xOrder = order;
                this.activeIndex = index;
                this.activeItem = item;
            },
            Answer(index, xOrder) {
                if (index === xOrder) {
                    this.errorArr[index] = 1;
                } else {
                    this.errorArr[index] = 0;
                }
                let answer = false;
                if (this.errorArr.toString() === this.correctArr.toString()) {
                    answer = true;
                }
                this.setAnswer({
                    answer: answer,
                    msg: this.errorMessage
                });
            },
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            init() {
                this.$nextTick(_ => {
                    if (this.content.words) {
                        for (let i = 0; i < this.content.words.length; i++) {
                            this.answerArr.push("");
                            this.correctArr.push(1);
                            this.errorArr.push(0);
                        }
                    }
                    for (let i = 0; i < this.wordArr.length; i++) {
                        this.errorMessage += (i + 1) + "." + (this.contentInfo.words[i].english || this.contentInfo.words[i].chinese) + '<br>'
                    }
                    this.setAnswer({
                        answer: false,
                        msg: this.errorMessage
                    });
                })
            }
        },
        created() {
        },
        mounted() {
            this.init();
        },
        watch: {
            contentInfo() {
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    activeIndex: null,
                    activeItem: null,
                    answerArr: [],
                    correctArr: [],
                    errorArr: [],
                    errorMessage: "",
                    xOrder: null,
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
        computed: {
            wordArr() {
                const wordArr = [];
                if (this.content.words) {
                    for (let i = 0; i < this.content.words.length; i++) {
                        wordArr.push({
                            pinyin: this.content.words[i].pinyin,
                            english: this.content.words[i].english,
                            chinese: this.content.words[i].chinese,
                            order: i,
                        })
                    }
                }
                return wordArr.sort(function () {
                    return Math.random() - 0.5
                });
            },
            contentInfo() {
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {},
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
                display: inline-block;
                position: relative;
            }

            .content-title {
                font-size: 22px;
            }

            .option-list {
                display: inline-block;
                position: absolute;
                right: 105%;
                top: 50%;
                transform: translate(0, -50%);

                .active {
                    background: dodgerblue;
                    box-shadow: 0 0 0 3px #619ABE;
                }

                li {
                    width: 80px;
                    background: #00565F;
                    box-shadow: 0 0 0 0.04rem #002D32;
                    border-radius: 0.05rem;
                    font-size: 0.15rem;
                    color: white;
                    margin: .1rem 0;
                    cursor: pointer;
                    padding: 0.01rem;
                    border: 0.02rem dashed white;
                    display: table;
                    min-height: 0.6rem;

                    span {
                        display: block;
                        margin: 0 auto;
                        max-width: 1rem;
                        font-size: 20px;
                    }

                }
            }
            .picture {
                display: inline-block;
                vertical-align: middle;

                img {
                    width: 7rem;
                    height: 3.2rem;
                    border-radius: 5px;
                }

            }
            .m1-option-gap {
                display: block;
                font-size: 0.15rem;
                overflow: hidden;

                li {
                    vertical-align: top;
                    border: 0.02rem dashed black;
                    border-radius: 0.02rem;
                    margin: 0 2%;
                    cursor: pointer;
                    width: 1rem;
                    padding: .02rem;
                    color: darkblue;
                    box-sizing: border-box;
                    display: inline-block;
                    .inside {
                        display: table;
                        width: 100%;
                        min-height: .6rem;
                    }
                    span {
                        display: block;
                        font-size: 20px;
                    }

                }

            }
        }
    }

    .style-2 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
                position: relative;
            }

            .content-title {
                font-size: 22px;
            }

            .option-list {
                display: inline-block;
                position: absolute;
                right: 110%;
                top: 50%;
                transform: translate(0, -50%);

                li {
                    width: 1.4rem;
                    max-width: 1.7rem;
                    min-height: 45px;
                    padding: 0.03rem;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    background: #BE2C23;
                    font-size: 0.22rem;
                    background: linear-gradient(#ffffff 0, #ACACAC 90%);
                    box-shadow: 0.02rem 0.03rem 0.06rem 0 black;
                    margin: .2rem 0;
                    cursor: pointer;
                    display: table;
                    border-radius: 5px;
                    &:hover {
                        background: linear-gradient(#bababa 100%, #ffffff 55%);
                    }
                    &.active {
                        background: linear-gradient(#bababa 100%, #ffffff 55%);
                    }

                }
            }
            .picture {
                display: inline-block;
                vertical-align: middle;
                margin: .25rem auto;

                img {
                    max-width: 7rem;
                    max-height: 2.5rem;
                    border-radius: 5px;
                }

            }
            .m2-option-gap {
                display: block;
                margin-top: 0.2rem;
                font-size: 22px;
                overflow: hidden;
                color: white;
                min-height: 105px;

                li {
                    vertical-align: top;
                    display: inline-block;

                    .en {
                        font-size: 14px;
                    }

                    em {
                        display: block;
                    }

                    .gap {
                        width: 1.4rem;
                        /* max-width: 2rem; */
                        min-height: 0.5rem;
                        border: 2px dashed black;
                        -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                        color: white;
                        font-size: 0.22rem;
                        cursor: pointer;
                        padding: 0 .02rem;
                        margin: 0 .05rem;
                        display: table;
                    }
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
                font-size: 22px;
            }

            .option-list {
                display: inline-block;
                vertical-align: middle;
                margin-right: 0.4rem;
                min-width: 120px;

                li {
                    width: 1.4rem;
                    padding: 0.03rem;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    background: #BE2C23;
                    font-size: 0.16rem;
                    color: white;
                    background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #B43C0B), color-stop(90%, #901D1C));
                    background: -o-linear-gradient(#B43C0B 0, #901D1C 90%);
                    background: linear-gradient(#B43C0B 0, #901D1C 90%);
                    margin: .2rem 0;
                    cursor: pointer;
                    display: grid;

                    div {
                        border: 0.01rem solid #FB984B;
                        -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                        /* padding: .08rem .02rem; */
                        min-height: .44rem;
                        /* line-height: .44rem; */
                        display: grid;

                        span {

                        }

                    }
                }
            }
            .picture {
                display: inline-block;
                vertical-align: middle;
                margin: .25rem auto;

                img {
                    max-width: 7rem;
                    max-height: 3rem;
                    border-radius: 5px;
                }

            }
            .m3-option-gap {
                display: block;
                margin-top: 0.2rem;
                font-size: 22px;
                overflow: hidden;

                li {
                    display: inline-block;
                    width: 1.4rem;
                    /* max-width: 2rem; */
                    min-height: 0.5rem;
                    background: #681515;
                    border-left: 0.02rem solid #901D1C;
                    border-bottom: 0.02rem solid #901D1C;
                    -webkit-box-shadow: -0.03rem 0.05rem 0.2rem black inset;
                    box-shadow: -0.03rem 0.05rem 0.2rem black inset;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    color: white;
                    font-size: 0.18rem;
                    vertical-align: top;
                    cursor: pointer;
                    padding: .05rem .02rem;
                    margin: 0 .05rem;

                    span {
                        display: block;
                    }

                }
            }
        }
    }


</style>
