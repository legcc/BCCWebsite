<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="indicate">
                            <span class="indicate-txt">{{contentInfo.sentence}}</span>
                            <span class="indicate-picture"></span>
                        </div>
                        <div class="top-option">
                            <div class="word-info" v-for="(item,index) in contentInfo.words">
                                <div class="pinyin-house">
                                    <ul class="pinyin-list setOption"
                                        @click="setOption($event,index);Answer($event,index)">
                                        <li class="" ref="topList">tone</li>
                                        <li class="" ref="topList">initial</li>
                                        <li class="" ref="topList">final</li>
                                    </ul>
                                </div>
                                <div class="hz">{{item.chinese}}</div>
                            </div>
                        </div>
                        <div class="bottom-option">
                            <div class="tone-info" v-for="(item,index) in contentInfo.words">
                                <div class="tone-house">
                                    <ul class="pinyin-list" @click="getOption($event)">
                                        <li class="car" ref="bottomList">
                                            {{item.initials}}
                                        </li>
                                        <li class="top" ref="bottomList">
                                            {{item.tone}}
                                        </li>
                                        <li class="door" ref="bottomList">
                                            {{item.finals}}
                                        </li>
                                    </ul>
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
                creatAnswer: [],
                getAnswer: [],
                contrast: [],
                nodeInfo: {},
                setData: [],
                bIndex: 0,
                tIndex: 0,
                getObj: "",
                errorMessage: ""
            }
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
            setOption(e, Index){
                if (e.target.nodeName.toUpperCase() == 'LI') {
                    let initTxt = e.target.innerHTML;
                    this.$refs.topList.forEach((item, index) => {
                        if (e.target == item) {
                            this.tIndex = index;
                        }
                    });
                    if (this.nodeInfo.value) {
                        if (this.setData.length != 0) {
                            for (let i in this.setData) {
                                if (this.setData[i].tIndex === this.tIndex) {
                                    initTxt = this.setData[i].initTxt;
                                    this.$refs.bottomList[this.setData[i].bIndex].style.visibility = "visible";
                                    this.setData.splice(i, 1);
                                }
                            }
                        }
                        e.target.className = this.nodeInfo.class || '';
                        e.target.innerHTML = this.nodeInfo.value;
                        this.nodeInfo = {};
                        this.getObj.classList.remove('active');
                        this.getObj.style.visibility = "hidden";
                        this.setData.push({
                            bIndex: this.bIndex,
                            tIndex: this.tIndex,
                            initTxt: initTxt,
                        });
                    } else {
                        for (let i in this.setData) {
                            if (this.setData[i].tIndex === this.tIndex) {
                                e.target.className = "";
                                e.target.innerHTML = this.setData[i].initTxt;
                                this.$refs.bottomList[this.setData[i].bIndex].style.visibility = "visible";
                                this.setData.splice(i, 1);
                            }
                        }
                    }
                }
            },
            getOption(e){
                if (e.target.nodeName.toUpperCase() == 'LI') {
                    this.nodeInfo = {
                        class: e.target.className,
                        value: e.target.innerHTML,
                    }
                    this.getObj = e.target;
                    this.$refs.bottomList.forEach((item, index) => {
                        item.classList.remove('active');
                        if (e.target == item) {
                            this.bIndex = index;
                        }
                    });
                    e.target.classList.add('active');
                }
            },
            Answer(e, Index){
                let tones = e.currentTarget.children[0].innerHTML.replace(/\s/g, "");
                let inital = e.currentTarget.children[1].innerHTML.replace(/\s/g, "");
                let final = e.currentTarget.children[2].innerHTML.replace(/\s/g, "");
                if (tones === this.contentInfo.words[Index].tone && inital === this.contentInfo.words[Index].initials && final === this.contentInfo.words[Index].finals) {
                    this.getAnswer[Index] = 1;
                } else {
                    this.getAnswer[Index] = 0;
                }
                //判断所有数值是否为1
                let answer = false;
                for (let i = 0; i < this.contrast.length; i++) {
                    if (this.contrast[i].length < 1 || this.getAnswer[i].length < 1) {
                        answer = false;
                    } else {
                        if (JSON.stringify(this.contrast) == JSON.stringify(this.getAnswer)) {
                            answer = true;
                        }
                    }
                }
                //答案内容
                this.setAnswer({
                    answer,
                    msg: this.errorMessage
                });
            },
            init(){
                this.$nextTick(_ => {
                    if(this.contentInfo.words){
                        if (this.getAnswer < this.contentInfo.words.length) {
                            for (let i = 0; i < this.contentInfo.words.length; i++) {
                                this.getAnswer.push(0);
                                this.contrast.push(1);
                            }
                        }
                    }
                    this.errorMessage = this.contentInfo.answerSentences ? this.contentInfo.answerSentences.pinyin : '';
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
        created () {
        },
        mounted() {
            this.init()
        },
        watch: {
            contentInfo(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    creatAnswer: [],
                    getAnswer: [],
                    contrast: [],
                    nodeInfo: {},
                    setData: [],
                    bIndex: 0,
                    tIndex: 0,
                    getObj: "",
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
    }

    .top-option, .bottom-option {
        display: block;
    }

    .indicate {
        position: absolute;
        top: 0px;
        left: -20%;
        font-size: 30px;
        font-family: 'Showcard Gothic Bold', 'Showcard Gothic Normal', 'Showcard Gothic';

    .indicate-picture {
        display: block;
        width: 80px;
        height: 90px;
        background: url("~~assets/img/main_content/course/click-picture.png") center no-repeat;
        background-size: contain;
        margin: 20px auto;
    }

    }
    .word-info {
        display: inline-block;
        vertical-align: middle;
    }

    .hz {
        font-size: 40px;
        color: red;
        font-weight: 700;
        margin: 20px 0;
        font-family: KaiTi;
    }

    .pinyin-house {
        margin: 0 auto;
        width: 220px;
        height: 200px;
        position: relative;
        background: url("~~assets/img/main_content/course/pinyin-house.png") center no-repeat;
        background-size: contain;

    .pinyin-list {
        font-size: 24px;
        color: #002D32;
        /* float: left; */
        display: inline-block;
        vertical-align: middle;

    li {
        position: absolute;
        cursor: pointer;
        font-weight: 700;

    &:nth-child(1) {
        width: 100px;
        left: 100px;
        height: 80px;
        top: 13px;
        line-height: 115px;
    }

    &:nth-child(2) {
        height: 66px;
        line-height: 71px;
        width: 77px;
        top: 128px;
        left: 21px;
    }

    &:nth-child(3) {
        width: 95px;
        height: 100px;
        line-height: 136px;
        right: 24px;
        top: 95px;
    }

    }

    .top {
        background: url("~~assets/img/main_content/course/tone-top.png") center no-repeat;
    }

    .car {
        background: url("~~assets/img/main_content/course/tone-car.png") center no-repeat;
    }

    .door {
        background: url("~~assets/img/main_content/course/tone-door.png") center no-repeat;
    }

    }

    }
    .top {

        width: 102px;
        height: 84px;
        background: url("~~assets/img/main_content/course/tone-top.png") center no-repeat;
        background-size: contain;
        line-height: 110px;
    }

    .door {

        width: 108px;
        height: 105px;
        background: url("~~assets/img/main_content/course/tone-door.png") center no-repeat;
        background-size: contain;
        line-height: 158px;
        color: #99CD00;
    }

    .car {
        width: 100px;
        height: 92px;
        background: url("~~assets/img/main_content/course/tone-car.png") 3px 13px no-repeat;
        background-size: contain;
        line-height: 132px;
        color: #FF3200;
    }

    .tone-info {
        vertical-align: middle;
        display: inline-block;
    }

    .tone-house {

    .pinyin-list {

    li {
        margin: 0 5px;
        font-size: 30px;
        cursor: pointer;
        font-weight: 700;
        display: inline-block;
        vertical-align: bottom;
    }

    .active {
        box-sizing: border-box;
        border: 1px inset paleturquoise;
    }

    }
    }
    }
    }

</style>
