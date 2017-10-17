<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <ul class="course-content-word">
                            <li v-for="(item,index) in imgArr">
                                <div class="word">
                                    <loadingImage :src="addPrefixHost(item.image)"/>
                                </div>
                                <ul class="pit" ref="topList"
                                    @click="setOption($event,index,item.order)">
                                    <li v-if="answerArr[index]">
                                        <div class="tb">
                                            <em :style="{'display':pinyinSwitch ? 'block':'none'}"
                                                class="py">{{answerArr[index] && answerArr[index].pinyin}}</em>
                                            <em class="cn">{{answerArr[index] && answerArr[index].chinese}}</em>
                                            <em class="en">{{answerArr[index] && answerArr[index].english}}</em>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div class="course-content-bottom">
                            <ul>
                                <li v-for="(item,index) in wordArr" :class="activeIndex===index&&'active'"
                                    @click="getOption($event,index,item,item.order)" v-if="item">
                                    <div class="inside">
                                        <div class="tb">
                                            <span :style="{'display':pinyinSwitch ? 'block':'none'}"
                                                  class="py">{{item.pinyin || ""}}</span>
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
                        <div class="content-title">{{contentInfo.sentence || ''}}</div>
                        <ul class="course-content-word">
                            <li v-for="(item,index) in imgArr">
                                <div class="word-picture">
                                    <loadingImage :src="addPrefixHost(item.image)"/>
                                </div>
                                <div class="wordkey">
                                    <div class="tb">
                                        <div class="word-info">
                                            <span :style="{'display':pinyinSwitch ? 'block':'none'}">{{item.pinyin || ""}}</span>
                                            <span>{{item.chinese}}</span>
                                        </div>
                                        <div class="word-blank" @click="setOption($event,index,item.order)">
                                            <div class="inside">
                                                <div class="tb">
                                                    {{answerArr[index] && answerArr[index].english}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="course-content-bottom">
                            <ul>
                                <li v-for="(item,index) in wordArr" :class="activeIndex===index&&'active'"
                                    @click="getOption($event,index,item,item.order)" v-if="item">
                                    <div class="inside">
                                        <div class="tb">
                                            {{item.english}}
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
                        <h1 class="title">{{contentInfo.sentence}}</h1>
                        <ul class="option-group">
                            <li v-for="item in contentInfo.words">
                                <div class="option-picture">
                                    <loadingImage :src="addPrefixHost(item.image)"/>
                                </div>
                                <div class="option-gap" v-if="item.sentence.length==0">
                                    <em>{{item.pinyin}}</em>
                                    <em>{{item.chinese}}</em>
                                </div>
                                <div class="option-sentence" v-if="item.sentence.length>0"
                                     v-html="(item.sentence).replace(/\[.+[\]、]/g,`<div class='option-gap'></div>`)"></div>
                            </li>
                        </ul>
                        <ul class="select-group">
                            <li class="option-word" v-for="item in contentInfo.words">
                                <div>{{item.english}}</div>
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
                        <h1 class="title">{{contentInfo.sentence}}</h1>
                        <ul class="word-list">
                            <li v-for="(item,index) in imgArr">
                                <div class="word-picture">
                                    <loadingImage :src="addPrefixHost(item.image)"/>
                                </div>
                                <ul class="word-info" @click="setOption($event,index,item.order)">
                                    <li :style="{'display':pinyinSwitch ? 'block':'none'}"
                                        class="py">{{item.pinyin || ""}}
                                    </li>
                                    <li class="cn">{{item.chinese}}</li>
                                    <li class="gap">{{answerArr[index] && answerArr[index].english}}</li>
                                </ul>
                            </li>
                        </ul>
                        <ul class="option-list">
                            <li v-for="(item,index) in wordArr" :class="activeIndex===index&&'active'"
                                @click="getOption($event,index,item,item.order)" v-if="item">
                                <div class="inside">
                                    <div class="tb">{{item.english}}</div>
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
            setOption(e, index, order) {
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
                this.Answer(index, order, this.xOrder);
            },
            getOption(e, index, item, order) {
                this.xOrder = order;
                this.activeIndex = index;
                this.activeItem = item;
            },
            Answer(index, order, xOrder) {
                if (order === xOrder) {
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
                            this.correctArr.push(1);
                            this.errorArr.push(0);
                        }
                    }
                    for (let i = 0; i < this.imgArr.length; i++) {
                        for (let j = 0; j < this.wordArr.length; j++) {
                            if (this.imgArr[i].order === this.wordArr[j].order) {
                                this.errorMessage += (i + 1) + '.' + (this.wordArr[j].english||this.wordArr[j].chinese) + "<br>";
                            }
                        }
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
            imgArr() {
                const imgArr = [];
                if (this.content.words) {
                    for (let i = 0; i < this.content.words.length; i++) {
                        imgArr.push({
                            image: this.content.words[i].image,
                            pinyin: this.content.words[i].pinyin,
                            chinese: this.content.words[i].chinese,
                            english: this.content.words[i].english,
                            order: i,
                        })
                    }
                }
                return imgArr.sort(function () {
                    return Math.random() - 0.5
                });
            },
            wordArr() {
                const wordArr = [];
                if (this.content.words) {
                    for (let i = 0; i < this.content.words.length; i++) {
                        wordArr.push({
                            image: this.content.words[i].image,
                            pinyin: this.content.words[i].pinyin,
                            chinese: this.content.words[i].chinese,
                            english: this.content.words[i].english,
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
<style lang="less">
    .style-3 {
        .option-gap {
            display: inline-block;
            min-width: 140px;
            max-width: 2rem;
            height: 50px;
            background: #681515;
            border-left: 2px solid #901D1C;
            border-bottom: 2px solid #901D1C;
            box-shadow: -3px 5px 20px black inset;
            box-sizing: border-box;
            color: white;
            vertical-align: middle;
            cursor: pointer;
            font-size: 18px;
            padding: 0 .02rem;
            margin: 25px 5px;

            em {
                display: grid;
            }

        }
    }
</style>
<style lang="less" scoped>
    .style-1 {

        .course_common_box {
            margin: 0 auto;
            text-align: center;

            .course-content {
                display: inline-block;
            }
            .py {
                font-size: 15px;
                font-family: Calibri;
            }
            .course-content-word {
                display: block;

                li {
                    display: inline-block;
                    vertical-align: top;
                    margin: 0 10px 0 10px;

                    .word {
                        width: 150px;
                        height: 150px;
                        border-radius: 5px;
                        border: 3px solid #002D32;
                        margin: 0 auto;
                        display: block;

                        img {
                            width: 100%;
                            height: 100%;
                        }

                    }

                    .pit {
                        /* width: 1.56rem; */
                        width: 100%;
                        border-bottom: 0.02rem dashed #002D32;
                        margin: 5px auto;
                        cursor: pointer;
                        min-height: 85px;
                        padding-bottom: 2px;
                        position: relative;

                        li {
                            border-radius: 0.05rem;
                            box-sizing: border-box;
                            display: table;
                            font-size: 0.22rem;
                            color: white;
                            cursor: pointer;
                            min-width: .9rem;
                            min-height: .6rem;
                            vertical-align: top;
                            margin: 2px 0;
                            background: #00565F;
                            box-shadow: 0 0 0 4px #002D32;
                            border: 2px dashed white;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            padding: 0 2px;

                            em {
                                display: block;
                            }

                        }

                    }
                }
            }
            .course-content-bottom {
                min-height: 85px;
                margin-top: 30px;

                .active {
                    background: dodgerblue;
                    box-shadow: 0 0 0 3px #619ABE;
                }

                li {
                    background: #00565F;
                    border-radius: 0.05rem;
                    box-sizing: border-box;
                    font-size: 0.22rem;
                    color: white;
                    margin: .05rem 0.2rem;
                    /* display: table; */
                    cursor: pointer;
                    /* float: left; */
                    min-width: .9rem;
                    height: .6rem;
                    border: 2px dashed white;
                    box-shadow: 0 0 0 4px #002D32;
                    vertical-align: top;
                    display: inline-block;
                    padding: 0 2px;
                    .inside {
                        display: table;
                        width: 100%;
                        height: 100%;
                    }
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

            .content-title {
                font-size: 20px;
                width: 750px;
                margin: 0 auto;
                margin-bottom: 10px;
            }

            .course-content-word {
                display: block;

                li {
                    margin: 0 5px;
                    display: inline-block;
                    vertical-align: top;

                    .wordkey {
                        margin-top: 40px;
                        height: 55px;
                        display: table;
                    }

                    .word-picture {
                        width: 2rem;
                        height: 1.5rem;
                        border-radius: 5px;
                        display: block;
                        background: url("~~assets/img/main_content/course/l2-word-frame.png") center center no-repeat;
                        background-size: 100% 100%;
                        margin: 0 auto;

                        img {
                            margin: 7px 0 0 -3px;
                            width: 90%;
                            height: 88%;
                            border-radius: 5px;
                        }

                    }

                    .word-info {
                        font-size: 22px;
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 5px;

                        span {
                            display: block;
                        }

                    }
                    .word-blank {
                        vertical-align: middle;
                        font-size: 22px;
                        width: 120px;
                        border-radius: 5px;
                        box-shadow: 0 0 0rem 0.01rem white, -0.05rem 0.05rem 0.15rem black inset;
                        cursor: pointer;
                        background: transparent;
                        padding: 0 3px;
                        box-sizing: border-box;
                        display: inline-block;
                        .inside{
                            display: table;
                            width: 100%;
                            min-height: 45px;
                        }
                    }

                }
            }
            .course-content-bottom {
                margin-top: 20px;
                min-height: 85px;

                ul li {
                    min-width: 1.4rem;
                    max-width: 2rem;
                    padding: 0 0.03rem;
                    box-sizing: border-box;
                    background: #BE2C23;
                    font-size: 0.22rem;
                    background: linear-gradient(#ffffff 0, #ACACAC 90%);
                    box-shadow: 0.02rem 0.03rem 0.06rem 0 black;
                    margin: .2rem 10px;
                    cursor: pointer;
                    border-radius: 5px;
                    vertical-align: top;
                    display: inline-block;
                    .inside {
                        display: table;
                        width: 100%;
                        min-height: 0.45rem;
                    }
                    &:hover {
                        background: linear-gradient(#bababa 100%, #ffffff 55%);
                    }
                    &.active {
                        background: linear-gradient(#bababa 100%, #ffffff 55%);
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

            .title {
                font-size: 22px;
                margin-bottom: 20px;
            }

            .option-group {

                li {
                    display: inline-block;
                    margin: 0 10px;
                    vertical-align: top;
                }

            }
            .option-picture {
                width: 2.3rem;
                height: 1.6rem;
                background: url("~~assets/img/main_content/course/l3-picture-frame.png") center center no-repeat;
                background-size: 100% 100%;
                margin: 0 auto;

                img {
                    width: 195.5px;
                    height: 128px;
                    margin: 0.16rem 0 0 0.06rem;
                }

            }
            .option-sentence {
                color: white;
            }

            .option-word {
                vertical-align: top;
                display: inline-block;
                min-width: 1.4rem;
                max-width: 2rem;
                padding: 0.03rem;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                background: #BE2C23;
                font-size: 0.2rem;
                /* line-height: 0.42rem; */
                color: white;
                background: -o-linear-gradient(#B43C0B 0, #901D1C 90%);
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #B43C0B), color-stop(90%, #901D1C));
                background: linear-gradient(#B43C0B 0, #901D1C 90%);
                cursor: pointer;
                margin: 0 20px;

                /* display: table; */
                div {
                    border: 0.01rem solid #FB984B;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    padding: .08rem .02rem;
                    min-height: .45rem;
                }

            }
        }

    }

    .style-4 {

        .course_common_box {
            margin: 0 auto;
            text-align: center;

            .course-content {
                display: inline-block;
            }

            .title {
                font-size: 22px;
                margin-bottom: 10px;
            }

            .word-list {

                li {
                    display: inline-block;
                    vertical-align: top;
                    margin: 0 20px;
                }

                .word-picture {
                    width: 200px;
                    height: 160px;
                    border: 2px solid black;
                    border-radius: 10px;
                    margin: 0 auto;
                    overflow: hidden;
                    margin: 0 auto;

                    img {
                        width: 100%;
                        height: 100%;
                    }

                }

                .word-info {

                    li:nth-child(1) {
                        display: block;
                        margin: 2px 0;
                    }

                    li:nth-child(2) {
                        display: block;
                        font-size: 32px;
                        font-weight: 700;
                        color: #952729;
                        margin: 2px 0;
                    }

                }
                .gap {
                    display: inline-block;
                    vertical-align: top;
                    min-width: 1.4rem;
                    min-height: 0.4rem;
                    line-height: 0.4rem;
                    border-radius: 5px;
                    background: linear-gradient(-315deg, #935378, #733A6D);
                    font-size: 22px;
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 0 0rem 0.01rem white, -0.05rem 0.05rem 0.15rem black inset;
                    margin: 0 auto;
                    padding: 0 .03rem;
                }

            }
            .option-list {
                display: block;
                margin-top: 30px;
                min-height: 50px;

                li {
                    border-radius: 0.05rem;
                    background: linear-gradient(#9D5678 0, #7F4577 90%);
                    font-size: 0.22rem;
                    -webkit-box-shadow: 0 0.03rem 0.03rem black;
                    box-shadow: 0 0.03rem 0.03rem black;
                    color: white;
                    cursor: pointer;
                    margin: 0 10px;
                    font-family: Calibri;
                    display: inline-block;
                    .inside {
                        display: table;
                        width: 1.6rem;
                        padding: 0 2px;
                        min-height: 0.45rem;
                    }
                }
                .active {
                    background: linear-gradient(#6944B5 0, #353C8D 90%);
                }
                li:hover {
                    background: linear-gradient(#6944B5 0, #353C8D 90%);
                }

            }
        }

    }
</style>
