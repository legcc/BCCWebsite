<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-tool" v-if="contentInfo.audio">
                            <span class="parts-audio" @click="playAudio($event)"></span>
                        </div>
                        <div class="course-content-left">
                            <div class="inside">
                                <div class="content-picture" v-if="contentInfo.image">
                                    <div class="bokeh-bg"></div>
                                    <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                                </div>
                                <ul class="column-type-1" v-if="contentInfo.image">
                                    <li v-for="item in contentInfo.questions">
                                        <!--<div class="column-picture">-->
                                        <!--<img src=""/>-->
                                        <!--</div>-->
                                        <div class="column-info" v-for="list in item.sentences">
                                            <p :style="{'display':pinyinSwitch ? 'block':'none'}" class="en">{{list.pinyin}}</p>
                                            <p v-html="getHtml(list)" @click="setOption($event)" class="cn">
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                                <ul class="column-type-2" v-if="!contentInfo.image">
                                    <li v-for="(item,index) in contentInfo.questions">
                                        <div class="column-picture">
                                            <loadingImage :src="addPrefixHost(item.image)" v-if="item.image"/>
                                        </div>
                                        <div class="column-info" v-for="(list,index) in item.sentences">
                                            <p :style="{'display':pinyinSwitch ? 'block':'none'}" class="en">{{list.pinyin}}</p>
                                            <p v-html="getHtml(list)" @click="setOption($event)" class="cn"></p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="course-content-right">
                            <ul class="right-word" ref="rList">
                                <li v-for="item in contentInfo.answers" @click="getOption($event,item.order)">
                                    <div class="tb">
                                        <span :style="{'display':pinyinSwitch ? 'block':'none'}" class="en">{{item.pinyin || ""}}</span>
                                        <span class="cn">{{item.chinese || item.english}}</span>
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
        async fetch({isServer, redirect, store, params}) {
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}) {
            return {extendData: params.extendData}
        }, data() {
            return {
                nodeInfo: [],
                creatAnswer: [],
                getAnswer: [],
                setData: [],
                lIndex: 0,
                rIndex: 0,
                getObj: "",
                Order: 0,
                errorMessage: "",
                isUpdate: false
            }
        },
        methods: {
            playAudio(ev) {
                this.$emit("playAudio", this.addPrefixHost(this.contentInfo.audio), ev);
            },
            //方括號切橫綫
            getHtml(list) {
                let obj = list.chinese || list.english;
                if (obj) {
                    const re = /\[.]、?/g;
                    let arr = obj.match(re);
                    arr && arr.forEach(_ => {
                        obj = obj.replace(/\[.]、?/, "<div class='move-blank'><span class='en'></span><span class='cn'></span></div>")
                    });
                    return obj;
                }
            },
            setOption(e, Index) {
                const _li = document.querySelectorAll(".move-blank");
                let target = e.target;
                if (e.target.nodeName.toUpperCase() == "SPAN") {
                    target = e.target.parentNode;
                    for (let i = 0; i < _li.length; i++) {
                        if (target == _li[i]) {
                            this.lIndex = i;
                        }
                    }
                    if (this.nodeInfo.length > 0) {
                        if (this.setData.length != 0) {
                            for (let i in this.setData) {
                                if (this.setData[i].lIndex === this.lIndex) {
                                    this.$refs.rList.children[this.setData[i].rIndex].style.visibility = "visible";
                                    this.setData.splice(i, 1);
                                }
                            }
                        }
                        for (let i = 0; i < target.children.length; i++) {
                            target.children[i].innerHTML = "";
                            target.children[i].innerHTML = this.nodeInfo[i];
                        }
                        this.nodeInfo = [];
                        this.getObj.classList.remove('active');
                        this.getObj.style.visibility = "hidden";
                        this.setData.push({
                            lIndex: this.lIndex,
                            rIndex: this.rIndex,
                        });
                    } else {
                        for (let i in this.setData) {
                            if (this.setData[i].lIndex === this.lIndex) {
                                for (let i = 0; i < target.children.length; i++) {
                                    target.children[i].innerHTML = "";
                                }
                                this.$refs.rList.children[this.setData[i].rIndex].style.visibility = "visible";
                                this.setData.splice(i, 1);
                            }
                        }
                    }
                    this.Answer(target, this.Order);
                }
            },
            getOption(e, order) {
                let target = e.currentTarget;
                for (let i = 0; i < this.$refs.rList.children.length; i++) {
                    this.$refs.rList.children[i].classList.remove('active');
                    if (target == this.$refs.rList.children[i]) {
                        this.rIndex = i;
                    }
                }
                let nodeChildren = target.children[0].children;
                this.getObj = target;
                for (let i = 0; i < nodeChildren.length; i++) {
                    this.nodeInfo[i] = nodeChildren[i].innerHTML;
                }
                this.Order = order;
                target.classList.add('active');
            },
            Answer(_this, order) {
                const _obj = document.querySelectorAll(".move-blank");
                let Index;
                for (let i = 0; i < _obj.length; i++) {
                    if (_this == _obj[i]) {
                        Index = i;
                    }
                }
                if (this.getAnswer.length < _obj.length) {
                    this.getAnswer.push(0);
                }
                this.getAnswer[Index] = order;
                //判定
                let answer = false;
                for (let i = 0; i < this.contentInfo.answerOrder.length; i++) {
                    if (this.getAnswer.join(",") === this.contentInfo.answerOrder[i]) {
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
                    let AnswerStrArr = this.contentInfo.answerOrder && this.contentInfo.answerOrder[0].split(",");
                    let AnswerArr = AnswerStrArr && AnswerStrArr.map(function (data) {
                        return +data;
                    });
                    if (this.contentInfo.answers) {
                        for (let i = 0; i < AnswerArr.length; i++) {
                            for (let j = 0; j < this.contentInfo.answers.length; j++) {
                                if (AnswerArr[i] === parseInt(this.contentInfo.answers[j].order)) {
                                    this.errorMessage += (i + 1) + '.' + ((this.contentInfo.answers[j].chinese || this.contentInfo.answers[j].english) + "<br>");
                                }
                            }
                        }

                        this.contentInfo.answers.forEach((item, index) => {
                            this.creatAnswer.push({
                                cn: item.chinese,
                                en: item.english,
                                py: item.pinyin,
                                order: item.order,
                            });
                        });
                    }
                    this.setAnswer({
                        answer: false,
                        msg: this.errorMessage
                    });
                })
            },
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
        },
        mounted() {
            this.init();
        },
        created() {
        },
        watch: {
            contentInfo() {
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    nodeInfo: [],
                    creatAnswer: [],
                    getAnswer: [],
                    setData: [],
                    lIndex: 0,
                    rIndex: 0,
                    getObj: "",
                    Order: 0,
                    errorMessage: "",
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
            chineseArr() {
                const randomFn = _ => Math.random() - .5;
                return R.sort(randomFn)(R.map(R.prop('answers'))(this.content))
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
    .move-blank {
        display: inline-grid;
        min-width: 1rem;
        height: .37rem;
        border-bottom: 0.01rem solid white;
        text-align: center;
        cursor: pointer;
        vertical-align: bottom;
        margin: 0 0.05rem;
        /* padding-bottom: 0.05rem; */
        font-size: 16px;
        color: #ffde72;

        span {
            display: block;
        }

    }
</style>
<style lang="less" scoped>
    .style-1 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
                color: white;
                position: relative;
            }

            .content-tool {
                display: inline-block;
                position: absolute;
                left: -80px;
                top: 5%;
            }

            .parts-audio {
                display: inline-block;
                width: 68px;
                height: 68px;
                border-radius: 50%;
                cursor: pointer;
                text-align: center;
                line-height: 68px;
                font-size: 25px;
                color: white;
                background: url("~~assets/img/main_content/course/lv1-audio.png") center no-repeat;
                background-size: cover;
            }

            .play-active {
                background: url("~~assets/img/main_content/course/lv1-audio-active.png") center no-repeat;
                background-size: cover;
            }

            .course-content-left {
                display: inline-block;
                background: #002D32;
                border-radius: 10px;
                box-sizing: border-box;
                vertical-align: middle;
                padding: .1rem;

                .inside {
                    background: #00565F;
                    border-radius: 0.1rem;
                    border: 0.02rem dashed white;
                    min-width: 6rem;
                    min-height: 3rem;
                    overflow: hidden;
                    padding: 5px 0;
                }

                .content-picture {
                    width: 2.2rem;
                    height: 1.5rem;
                    position: relative;
                    float: right;

                    .bokeh-bg {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        background: rgba(255, 255, 255, .8);
                        filter: blur(.1rem);
                        left: 0;
                        bottom: 0;
                    }

                    img {
                        position: absolute;
                        max-width: 2.2rem;
                        max-height: 1.5rem;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 1;
                        border-radius: 0.05rem;
                    }

                }

            }
            .column-type-1 {

                li {
                    overflow: hidden;
                    font-size: 0.16rem;
                    padding: 0 .3rem;
                    box-sizing: border-box;
                    margin: 2px 0;
                }

                .column-info {
                    float: left;
                    margin: 5px 0 0 0;
                    font-size: 18px;

                    p {
                        text-align: left;

                        .active {
                            color: dodgerblue;
                        }

                    }

                }
            }
            .column-type-2 {

                li {
                    display: block;
                    text-align: left;
                    font-size: 16px;
                    margin: 2px 0;
                }

                li:nth-child(even) {
                    background: darkcyan;
                }

                .column-picture {
                    /*background: rgba(255, 255, 255, .8);*/
                    /*filter: blur(8px);*/
                    display: inline-block;
                    vertical-align: middle;

                    img {
                        max-width: .8rem;
                        max-height: .7rem;
                    }

                }
                .column-info {
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 25px;
                    font-size: 18px;
                }

            }

            .course-content-right {
                display: inline-block;
                vertical-align: middle;
            }

            .right-word {
                margin-left: .2rem;

                /*li:hover {*/
                /*background: #619ABE;*/

                /*div {*/
                /*background: dodgerblue;*/
                /*transition: all 0.3s ease;*/
                /*}*/

                /*}*/
                .active {
                    background: #619ABE;

                    div {
                        background: dodgerblue;
                    }

                }
                li {
                    background: #002D32;
                    border-radius: 0.05rem;
                    padding: 0.04rem;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    color: white;
                    margin: .1rem 0;
                    height: .7rem;
                    width: 100%;
                    cursor: pointer;
                    display: table;

                    div {
                        -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                        background: #00565F;
                        border: 0.02rem dashed white;
                        border-radius: 0.05rem;
                        padding: .03rem .1rem;
                        min-width: .8rem;
                        height: 100%;

                        span {
                            display: block;
                            &:nth-child(1) {
                                font-size: 20px;
                            }
                            &:nth-child(2) {
                                font-size: 20px;
                            }
                        }

                    }

                }
            }

        }

    }

</style>
