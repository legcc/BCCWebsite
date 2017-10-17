<template>
    <div>
        <transition name="fade">
            <div class="style-2" v-if="templateStyle ==='style-2'">
                <div class="course_common_box">
                    <div class="course-content">
                        <p class="content-title">{{contentInfo.sentence ? contentInfo.sentence : ''}}</p>
                        <ul class="option-group">
                            <li class="option" v-for="item in contentInfo.words">
                                {{item.english}}
                            </li>
                        </ul>
                        <div class="content">
                            <div class="picture">
                                <div v-for="item in contentInfo.images"
                                     :class="contentInfo.images.length>1&&item.length<0?'n-picture':'one-picture'"
                                     v-if="item.length>0">
                                    <loadingImage :src="addPrefixHost(item)"/>
                                </div>
                            </div>
                            <div class="content-bottom">
                                <div class="top-sentence">
                                    <div class="sentence" v-for="item in contentInfo.topSentences"
                                         v-html='item.replace(/\[.+[\]、]/g,`<ul class="l2-m3-data"><li class="en"></li><li class="cn"></li><li class="gap"></li></ul>`)'
                                    ></div>
                                </div>
                                <div class="bottom-sentence">
                                    <div class="sentence" v-for="item in contentInfo.bottomSentences"
                                         v-html='item.replace(/\[.+[\]、]/g,`<ul class="l2-m3-data"><li class="en"></li><li class="cn"></li><li class="gap"></li></ul>`)'
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <h1 class="title" v-for="item in contentInfo.topSentences">{{item}}</h1>
                        <div class="content-picture">
                            <div v-for="item in contentInfo.images">
                                <loadingImage :src="addPrefixHost(item)"/>
                            </div>
                        </div>
                        <div class="content-sentence"
                             v-for="item in contentInfo.bottomSentences"
                             v-html='item.replace(/\[.+[\]、]/g,`<ul class="m-3-data"><li></li><li></li><li class="l3-gap"></li></ul>`)'
                        >
                        </div>
                        <ul class="content-word">
                            <li class="word-item" v-for="item in contentInfo.words">
                                <div>
                                    {{item.english}}
                                </div>
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
                        <ul class="left-option">
                            <li class="option" v-for="(item,index) in option" @click="getOption(item,index)"
                                :class="activeIndex===index&&'active'" v-if="item">
                                <em class="tb">{{item.english}}</em>
                            </li>
                        </ul>
                        <div class="content-right course-content-sentence">
                            <div class="l4-m-word" ref="sentence">
                                <div class="list" v-for="(item,index) in contentInfo.topSentences"
                                     v-html='getHtml(item)' @click="setOption($event)">
                                </div>
                            </div>
                            <div class="top-picture-one" v-if="contentInfo.images&&contentInfo.images.length==1">
                                <loadingImage :key="index" :src="addPrefixHost(item)"
                                              v-for="(item,index) in contentInfo.images"/>
                            </div>
                            <div class="top-picture-two" v-if="contentInfo.images&&contentInfo.images.length>1">
                                <loadingImage :key="index" :src="addPrefixHost(item)"
                                              v-for="(item,index) in contentInfo.images"/>
                            </div>
                            <div class="bottom-gap">
                                <div class="l4-m-word" ref="word">
                                    <div class="list" v-for="(item,index) in contentInfo.bottomSentences"
                                         v-html='getHtml(item)' @click="setOption($event)">
                                    </div>
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
        async fetch({isServer, redirect, store, params}) {
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}) {
            return {extendData: params.extendData}
        }, data() {
            return {
                answerArr: [],
                activeIndex: null,
                activeItem: null,
                toIndex: null,
                isUpdate: false,
                correctArr: [],
                errorMessage: ""
            }
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
            getHtml(item) {
                let obj = item;
                let words = this.contentInfo ? this.contentInfo.words : '';
                if (obj) {
                    const re = /([^\[\]]+)(?=\])/g;
                    let arr = obj.match(re);
                    if (arr) {
                        for (let i = 0; i < arr.length; i++) {
                            if (words) {
                                for (let j = 0; j < words.length; j++) {
                                    let key = this.answerArr[j] || '';
                                    let bindStyle = this.bindStyle || '';
                                    let Index = j;
                                    if (words[j].order === arr[i]) {
                                        obj = obj.replace(/\[.]、?/, "<ul><li " + bindStyle + " class='en'>" + words[j].pinyin + "</li><li class='cn'>" + words[j].chinese + "</li><li class='gap' data-name='" + Index + "'>" + (key.english || '') + "</li></ul>");
                                    }
                                }
                            }
                        }
                    }
                    return obj;
                }
            },
            setOption(e) {
                if (e.target.nodeName.toUpperCase() === "LI" && e.target.className === "gap") {
                    let target = e.target;
                    this.toIndex = target.getAttribute("data-name");
                    if (this.activeItem != null) {
                        if (!this.answerArr[this.toIndex]) {
                            Vue.set(this.answerArr, this.toIndex, this.activeItem);
                            this.option.splice(this.activeIndex, 1);
                            this.activeItem = null;
                            this.activeIndex = null;
                        } else {
                            this.option.splice(this.activeIndex, 1);
                            this.option.push(this.answerArr[this.toIndex]);
                            Vue.set(this.answerArr, this.toIndex, this.activeItem);
                            this.activeItem = null;
                            this.activeIndex = null;
                        }
                    } else {
                        if (this.answerArr[this.toIndex]) {
                            this.option.push(this.answerArr[this.toIndex]);
                        }
                        Vue.set(this.answerArr, this.toIndex, "");
                    }
                    this.Answer(this.toIndex);
                }
            }
            ,
            getOption(item, index) {
                this.activeIndex = index;
                this.activeItem = item;
            }
            ,
            Answer(Index) {
                let answer = false;
                Vue.set(this.correctArr, Index, this.answerArr[Index].order);
                console.log(this.correctArr)
                if (this.contentInfo.answerOrder) {
                    for (let i = 0; i < this.contentInfo.answerOrder.length; i++) {
                        if (this.correctArr.toString() === this.contentInfo.answerOrder[i].toString()) {
                            answer = true;
                        }
                    }
                }
                this.setAnswer({
                    answer: answer,
                    msg: this.errorMessage
                });
            }
            ,
            init() {
                this.$nextTick(_ => {
                    if (this.contentInfo.words) {
                        for (let i = 0; i < this.contentInfo.words.length; i++) {
                            this.errorMessage += this.contentInfo.words[i].chinese + "——" + this.contentInfo.words[i].english + "<br>";
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
            console.log(this.data)
        },
        mounted() {
            this.init();
        },
        watch: {
            contentInfo() {
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    answerArr: [],
                    activeIndex: null,
                    activeItem: null,
                    toIndex: null,
                    isUpdate: false,
                    correctArr: [],
                    errorMessage: ""
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
            option() {
                const content = [];
                if (this.content.words) {
                    for (let i = 0; i < this.content.words.length; i++) {
                        content.push(this.content.words[i]);
                    }
                }
                return content.sort(function () {
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
                pinyinSwitch: state => state.pinyinSwitch,
                bindStyle: state => state.bindStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {},
                data: state => state.contentInfo,
            }),
        },
        components: {
            loadingImage,
        }
    }
</script>
<style lang="less">
    .l4-m-word {
        font-size: 22px;
        font-family: Calibri, KaiTi;
        max-width: 8rem;

        .list {
            margin: 0 0.2rem 0rem 0;
            display: inline-block;
            ul {
                display: inline-block;
                margin: 0 10px;

                li {
                    margin-top: 2px;
                }

            }
            .cn {
                color: rgb(160, 32, 32);
                font-size: 30px;
                font-weight: 700;
            }

            .en {
                font-size: 0.2rem;
            }

            .gap {
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                display: inline-block;
                min-width: 1.2rem;
                height: 0.4rem;
                line-height: 0.4rem;
                border-radius: 0.05rem;
                background: linear-gradient(-315deg, #935378, #733A6D);
                font-size: 0.22rem;
                color: white;
                cursor: pointer;
                box-shadow: 0 0 0rem 0.01rem white, -0.05rem 0.05rem 0.15rem black inset;
                vertical-align: bottom;
                padding: 0 0.05rem;
                font-family: Calibri;
            }

        }
    }

    .m-3-data {
        display: inline-block;
        .l3-gap {
            display: inline-block;
            width: 1.4rem;
            min-height: 0.45rem;
            background: #681515;
            border-left: 0.02rem solid #901D1C;
            border-bottom: 0.02rem solid #901D1C;
            -webkit-box-shadow: -0.03rem 0.05rem 0.2rem black inset;
            box-shadow: -0.03rem 0.05rem 0.2rem black inset;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: white;
            font-size: 0.18rem;
            vertical-align: middle;
            cursor: pointer;
            padding: .05rem .02rem;
            margin: 0 .05rem;
        }
    }

    .l2-m3-data {
        display: inline-block;
        margin: 0 5px;
        .gap {
            display: inline-block;
            vertical-align: middle;
            font-size: 0.18rem;
            width: 1.2rem;
            min-height: 0.45rem;
            border-radius: 0.05rem;
            -webkit-box-shadow: 0 0 0rem 0.01rem white, -0.05rem 0.05rem 0.15rem black inset;
            box-shadow: 0 0 0rem 0.01rem white, -0.05rem 0.05rem 0.15rem black inset;
            cursor: pointer;
            background: transparent;
            padding: 0.1rem 0.02rem;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }
    }
</style>
<style lang="less" scoped>
    .style-2 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
            }
            .content-title {
                font-size: 22px;
                width: 750px;
                margin: 0 auto 10px auto;
            }
            .option-group {
                display: inline-block;
                vertical-align: middle;
                margin-right: 20px;
            }

            .option {
                min-width: 1.4rem;
                max-width: 1.7rem;
                min-height: 0.45rem;
                padding: 0.1rem 0.03rem;
                box-sizing: border-box;
                font-size: 0.18rem;
                background: linear-gradient(#ffffff 0, #ACACAC 90%);
                box-shadow: 0.02rem 0.03rem 0.06rem 0 black;
                margin: .2rem 0rem;
                cursor: pointer;
                border-radius: 5px;
            }
            .content {
                display: inline-block;
                vertical-align: middle;
                max-width: 750px;
            }
            .picture {
                display: inline-block;
                vertical-align: middle;
                .n-picture {
                    display: inline-block;
                    vertical-align: middle;
                    img {
                        max-width: 2.5rem;
                        max-height: 2.5rem;
                        border-radius: 5px;
                        margin: 0 20px;
                    }
                }
                .one-picture {
                    img {
                        max-width: 6rem;
                        max-height: 2.5rem;
                        border-radius: 5px;
                        margin: 0 20px;
                    }
                }
            }
            .content-bottom {
                margin-top: .2rem;
            }
            .bottom-sentence, .top-sentence {
                margin: 10px 0;
            }
            .bottom-sentence .sentence {
                display: inline-block;
                font-size: 18px;
                margin: 0 .2rem;
            }
            .top-sentence .sentence {
                display: inline-block;
                margin: 0 30px;
                font-size: 18px;
                vertical-align: top;
            }
        }

    }

    .style-3 {

        .course_common_box {
            margin: 0 auto;
            text-align: center;

            .course-content {
                display: inline-block;
            }

            .title {
                font-size: 22px;
            }

            .content-picture {
                width: 640px;
                height: 220px;
                margin: 10px auto;

                img {
                    max-width: 6rem;
                    max-height: 3.2rem;
                    border-radius: 5px;
                }

            }

            .content-sentence {
                font-size: 18px;

                .data {
                    display: inline-block;
                }

                .gap {
                    display: inline-block;
                    width: 140px;
                    min-height: 50px;
                    background: #681515;
                    border-left: 2px solid #901D1C;
                    border-bottom: 2px solid #901D1C;
                    box-shadow: -3px 5px 20px black inset;
                    box-sizing: border-box;
                    color: white;
                    line-height: 50px;
                    font-size: 0.2rem;
                    vertical-align: middle;
                    cursor: pointer;
                }

            }
            .content-word {
                margin-top: 30px;
            }

            .word-item {
                display: inline-block;
                vertical-align: top;
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
                margin: 0 15px;

                /* display: table; */
                div {
                    border: 0.01rem solid #FB984B;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    padding: .08rem .02rem;
                    min-height: .44rem;
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
                position: relative;
                min-width: 600px;
            }

            .left-option {
                display: inline-block;
                vertical-align: middle;
                min-width: 170px;
                position: absolute;
                right: 105%;
                top: 50%;
                transform: translate(0, -50%);
            }

            .content-right {
                display: inline-block;
                vertical-align: middle;
            }

            .option {
                width: 1.6rem;
                min-height: 0.45rem;
                border-radius: 5px;
                background: linear-gradient(#9D5678 0, #7F4577 90%);
                font-size: 22px;
                box-shadow: 0 0.03rem 0.03rem black;
                color: white;
                cursor: pointer;
                display: table;
                margin: 35px 0;
                font-family: Calibri;
                padding: 0 2px;
            }

            .option:hover {
                background: linear-gradient(#6944B5 0, #353C8D 90%);
            }
            .active {
                background: linear-gradient(#6944B5 0, #353C8D 90%);
            }
            .top-picture-one {
                display: inline-block;
                vertical-align: middle;
                border-radius: 10px;
                margin: 5px 0;
                img {
                    width: 4rem;
                    height: 2rem;
                    border-radius: 10px;
                    border: 2px solid black;
                }

            }
            .top-picture-two {
                display: inline-block;
                vertical-align: middle;
                margin: 5px 0;
                img {
                    vertical-align: middle;
                    width: 220px;
                    height: 160px;
                    border-radius: 10px;
                    margin: 0 10px;
                    display: inline-block;
                    border: 2px solid black;
                }

            }
            .bottom-gap {
                max-width: 8rem;
                margin: 0 auto;
                min-height: 0.7rem;
            }

        }

    }
</style>
