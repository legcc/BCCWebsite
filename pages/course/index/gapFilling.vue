<template>
    <div>
        <transition name="fade">
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="course-content-left">
                            <div class="content-left-img">
                                <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            </div>
                        </div>
                        <div class="course-content-right">
                            <div class="content-right-gap"
                                 v-html="(contentInfo.sentence.chinese).replace(/\[.+[\]、]/g,`<div class='l3-gap'></div>`)">

                            </div>
                            <div class="content-right-sentence">{{contentInfo.sentence.english}}</div>
                            <ul class="content-right-word">
                                <li v-for="item in contentInfo.words">
                                    <div>
                                        <span class="py">{{item.pinyin}}</span>
                                        <span class="cn">{{item.chinese}}</span>
                                        <span class="en">{{item.english}}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-4" v-if="templateStyle ==='style-4'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="course-content-left">
                            <div class="content-left-img">
                                <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                            </div>
                        </div>
                        <div class="course-content-right">
                            <div class="box">
                                <div class="content-right-sentence">
                                    {{contentInfo.sentence ? contentInfo.sentence.english : ''}}
                                </div>
                                <div class="content-right-gap"
                                     v-html="getHtml(contentInfo.sentence&&contentInfo.sentence.chinese)"
                                     @click="setOption($event)">
                                </div>
                            </div>
                            <ul class="content-right-word">
                                <li v-for="(item,index) in option" @click="getOption(item,index)"
                                    :class="activeIndex===index&&'active'">
                                    <div class="inside">
                                        <div class="tb">
                                            <!--<span class="en">{{item.pinyin}}</span>-->
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
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import loadingImage from '~/components/loadingImage';
    import R from 'ramda';
    import Vue from 'vue';

    export default {
        async fetch({store, params, isServer, redirect}) {
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
                            let key = this.answerArr[i] || '';
                            let Index = i;
                            obj = obj.replace(/\[.]、?/, "<div class='gap' data-name='" + Index + "'>" + (key.chinese || '') + "</div>");
                        }
                    }
                    return obj;
                }
            },
            setOption(e) {
                if (e.target.nodeName.toUpperCase() === "DIV" && e.target.className === "gap") {
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
            },
            getOption(item, index) {
                this.activeIndex = index;
                this.activeItem = item;
            },
            Answer(Index) {
                let answer = false;
                Vue.set(this.correctArr, Index, this.answerArr[Index].order);
                for (let i = 0; i < this.contentInfo.answerOrder.length; i++) {
                    if (this.correctArr.toString() === this.contentInfo.answerOrder[i].toString()) {
                        answer = true;
                    }
                }
                this.setAnswer({
                    answer: answer,
                    msg: this.errorMessage
                });
            },
            init() {
                this.$nextTick(_ => {
                        if (this.contentInfo.answerOrder) {
                            for (let i = 0; i < this.contentInfo.answerOrder.length; i++) {
                                const orderArr = this.contentInfo.answerOrder[i] && this.contentInfo.answerOrder[i].split(",");
                                if (orderArr) {
                                    for (let j = 0; j < orderArr.length; j++) {
                                        Vue.set(this.correctArr, j, "");
                                        if (this.contentInfo.words) {
                                            for (let k = 0; k < this.contentInfo.words.length; k++) {
                                                if (this.contentInfo.words[k].order === orderArr[j]) {
                                                    this.errorMessage += (j + 1) + "." + this.contentInfo.words[k].chinese + "<br>";
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        this.setAnswer({
                            answer: false,
                            msg: this.errorMessage
                        });
                    }
                )
            }
        }
        ,
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
            }
            ,
        }
        ,
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
            }
            ,
            contentInfo() {
                return this.courseExtendInfo || this.extendData || this.contentData;
            }
            ,
            ...
                mapState('index/course/index', {
                    courseExtendInfo: state => state.courseExtendInfo,
                    contentData: state => state.contentInfo.content,
                    templateStyle: state => state.templateStyle,
                    pinyinSwitch: state => state.pinyinSwitch,
                    data: state => state.contentInfo,
                    content: state => state.contentInfo ? state.contentInfo.content : {},
                }),
        }
        ,
        components: {
            loadingImage,
        }
    }
</script>
<style lang="less">
    .l3-gap {
        display: inline-block;
        min-width: 1.4rem;
        /* max-width: 2rem; */
        min-height: 0.5rem;
        background: #681515;
        border-left: 2px solid #901D1C;
        border-bottom: 2px solid #901D1C;
        box-shadow: -3px 5px 20px black inset;
        box-sizing: border-box;
        color: white;
        font-size: 18px;
        vertical-align: middle;
        cursor: pointer;
        padding: .1rem .02rem;
        margin: 0 5px;
    }

    .style-4 {
        .gap {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            display: inline-block;
            min-width: 1.1rem;
            height: 0.42rem;
            line-height: 0.42rem;
            border-radius: 0.05rem;
            background: -o-linear-gradient(45deg, #6944B5, #353C8D);
            background: linear-gradient(-315deg, #6944B5, #353C8D);
            font-size: 0.22rem;
            color: white;
            cursor: pointer;
            /* box-shadow: 0px 0px 4px 2px white; */
            -webkit-box-shadow: 0 0 0rem 0.01rem white, -0.05rem 0.05rem 0.15rem black inset;
            box-shadow: 0 0 0rem 0.01rem white, -0.05rem 0.05rem 0.15rem black inset;
            vertical-align: bottom;
            /* display: grid; */
            padding: 0 0.05rem;
            margin: 3px;
            text-align: center;
            font-family: KaiTi;
        }
    }
</style>
<style lang="less" scoped>
    .style-3 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
            }

            .course-content-right {
                width: 5.15rem;
            }

            .course-content-left, .course-content-right {
                display: inline-block;
                vertical-align: middle;
                margin: 0 20px 0 20px;
            }

            .content-left-img {
                width: 2.7rem;
                height: 2.8rem;
                overflow: hidden;
                background: url("~~assets/img/main_content/course/l3-picture-frame.png") center no-repeat;
                background-size: 100% 100%;
                img {
                    width: 85%;
                    height: 81%;
                    margin: 26px 0 0 6px;
                }
            }

            .content-right-gap {
                display: block;
                font-size: 0.2rem;

            }
            .content-right-sentence {
                font-size: 25px;
                margin-top: 1rem;
                padding-bottom: 10px;
                box-sizing: border-box;
            }

            .content-right-word {
                margin-top: 25px;
                text-align: center;
                display: flow-root;

                li {
                    float: left;
                    min-width: 1.4rem;
                    padding: 0.03rem;
                    box-sizing: border-box;
                    background: #BE2C23;
                    font-size: 20px;
                    color: white;
                    background: linear-gradient(#B43C0B 0, #901D1C 90%);
                    margin: 5px;
                    cursor: pointer;
                    div {
                        border: 0.01rem solid #FB984B;
                        -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                        padding: 0 .02rem;
                        min-height: .44rem;
                        display: grid;
                        .py, .en {
                            font-size: 12px;
                        }
                        span {
                            display: block;
                        }
                    }

                }
            }

        }

    }

    .style-4 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
            }

            .course-content-right {
                width: 5.15rem;
                .box {
                    border: 0.01rem solid black;
                    border-radius: 0.1rem;
                    background: #b3aaf0;
                    padding: 0.1rem;
                    min-height: 1.5rem;
                    text-align: left;
                    display: grid;
                    font-family: Calibri, KaiTi;
                }
            }

            .course-content-left, .course-content-right {
                display: inline-block;
                vertical-align: middle;
                margin: 0 20px 0 20px;
            }

            .content-left-img {

                border-radius: 5px;
                border: 2px solid black;
                overflow: hidden;
                img {
                    max-width: 2.7rem;
                    max-height: 2rem;
                }
            }

            .content-right-gap {
                display: block;
                font-size: 0.2rem;
                font-family: Calibri, KaiTi;
            }
            .content-right-sentence {
                font-size: 25px;
                box-sizing: border-box;
                font-family: Calibri;
            }

            .content-right-word {
                margin-top: 25px;
                text-align: center;
                display: flow-root;
                min-height: 60px;

                li {
                    min-width: 1.5rem;
                    height: 45px;
                    padding: 0 3px;
                    box-sizing: border-box;
                    color: white;
                    background: linear-gradient(#1D1E33 0, #2F4678 90%);
                    margin: 5px;
                    cursor: pointer;
                    box-shadow: 0px 3px 3px black;
                    border-radius: 5px;
                    display: inline-block;
                    .inside {
                        display: table;
                        width: 100%;
                        height: 100%;
                    }
                    &.active {
                        background: linear-gradient(#4A236D 0, #4D24E8 90%);
                    }
                    .en {
                        font-size: 14px;
                        font-family: Calibri;
                    }
                    .cn {
                        font-size: 0.22rem;
                        font-family: KaiTi;
                    }

                }
                li:hover {
                    background: linear-gradient(#4A236D 0, #4D24E8 90%);
                }
            }

        }

    }
</style>
