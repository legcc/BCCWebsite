<template>
    <div>
        <transition name="fade">
            <div class="style-1">
                <div class="course_common_box">
                    <canvas ref="drawingBoard" class="canvas"></canvas>
                    <div class="course-content" ref="container">
                        <div class="course-content-top">
                            <ul class="top-option">
                                <li v-for="(item,index) in englishArr"  ref="word" @click="chooseWord(index)" :style="{width:`${1/content.length*100}%`}">
                                    <loadingImage :src="addPrefixHost(item)" class="bg-img" :class="(from-1)===index&&'active'"/>
                                </li>
                            </ul>
                        </div>
                        <div class="course-content-bottom">
                            <ul class="bottom-option">
                                <li v-for="(item,index) in chineseArr"  @click="matchWord(index)" :style="{width:`${1/content.length*100}%`}">
                                    <loadingImage :src="addPrefixHost(item)" class="bg-img"  :class="(to-1)===index&&'active'"/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!--<transition name="fade">-->
            <!--<div class="style-2" v-if="templateStyle ==='style-2'">-->
                <!--<div class="course_common_box">-->
                    <!--<div class="course-content">-->
                        <!--<div class="course-content-top">-->
                            <!--<ul class="top-option">-->
                                <!--<li v-for="item in contentInfo">-->
                                    <!--<loadingImage :src="addPrefixHost(item['english_img'])" class="bg-img"/>-->
                                    <!--<p>-->
                                        <!--<span>{{item.pinyin}}</span>-->
                                        <!--<span>{{item.chinese}}</span>-->
                                    <!--</p>-->
                                <!--</li>-->
                            <!--</ul>-->
                        <!--</div>-->

                        <!--<div class="course-content-bottom">-->
                            <!--<ul class="bottom-option">-->
                                <!--<li v-for="item in contentInfo">-->
                                    <!--<loadingImage :src="addPrefixHost(item.image)" class="bg-img"/>-->
                                    <!--<p>-->
                                        <!--<span>{{item.english || ''}}</span>-->
                                    <!--</p>-->
                                <!--</li>-->
                            <!--</ul>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</transition>-->
        <!--<transition name="fade">-->
            <!--<div class="style-3" v-if="templateStyle ==='style-3'">-->
                <!--<div class="course_common_box">-->
                    <!--<div class="course-content">-->
                        <!--<div class="course-content-top">-->
                            <!--<ul class="top-option">-->
                                <!--<li v-for="item in contentInfo">-->
                                    <!--<loadingImage :src="addPrefixHost(item['english_img'])" class="bg-img"/>-->
                                    <!--<p>-->
                                        <!--<span>{{item.pinyin}}</span>-->
                                        <!--<span>{{item.chinese}}</span>-->
                                    <!--</p>-->
                                <!--</li>-->
                            <!--</ul>-->
                        <!--</div>-->

                        <!--<div class="course-content-bottom">-->
                            <!--<ul class="bottom-option">-->
                                <!--<li v-for="item in contentInfo">-->
                                    <!--<loadingImage :src="addPrefixHost(item.image)" class="bg-img"/>-->
                                    <!--<p>-->
                                        <!--<span>{{item.english}}</span>-->
                                    <!--</p>-->
                                <!--</li>-->
                            <!--</ul>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</transition>-->
        <!--<transition name="fade">-->
            <!--<div class="style-4" v-if="templateStyle ==='style-4'">-->
                <!--<div class="course_common_box">-->
                    <!--<canvas ref="drawingBoard" class="canvas"></canvas>-->
                    <!--<div class="course-content" ref="container">-->
                        <!--<div class="course-content-top">-->
                            <!--<ul class="top-option">-->
                                <!--<li v-for="(item,index) in englishArr"  ref="word" @click="chooseWord(index)" :style="{width:`${1/content.length*100}%`}">-->
                                    <!--<loadingImage :src="addPrefixHost(item)" class="bg-img" :class="(from-1)===index&&'active'"/>-->
                                <!--</li>-->
                            <!--</ul>-->
                        <!--</div>-->
                        <!--<div class="course-content-bottom">-->
                            <!--<ul class="bottom-option">-->
                                <!--<li v-for="(item,index) in chineseArr"  @click="matchWord(index)" :style="{width:`${1/content.length*100}%`}">-->
                                    <!--<loadingImage :src="addPrefixHost(item)" class="bg-img"  :class="(to-1)===index&&'active'"/>-->
                                <!--</li>-->
                            <!--</ul>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</transition>-->
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
                ctx: {},
                isUpdate: false,
                from: null,
                to: null,
                lineStore: [],
                container: {},
                wordItem: {},
            }
        },
        methods: {
            initCanvas() {
                this.$refs.drawingBoard.width = this.container.offsetWidth;
                this.$refs.drawingBoard.height = this.container.offsetHeight;
            },
            init() {
                if (this.contentInfo["template_no"] === 'K12') {
                    this.$nextTick(_ => {
                        this.ctx = this.$refs.drawingBoard.getContext("2d");
                        this.container = this.$refs.container;
                        this.wordItem = this.$refs.word[0];
                        this.initCanvas();
//                初始化
                        this.setAnswer({
                            answer: false,
                            msg: R.join("<br>")(R.map(R.pipe(R.props(["chinese", "english"]), R.defaultTo([]), R.join("——")))(this.content))
                        });

                    })

                }
            },
            matchline(from, to) {
                function getBeveling(x, y) {
                    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                }

                function drawDashLine(context, x1, y1, x2, y2, dashLen) {
                    dashLen = dashLen === undefined ? 5 : dashLen;
                    //得到斜边的总长度
                    var beveling = getBeveling(x2 - x1, y2 - y1);
                    //计算有多少个线段
                    var num = Math.floor(beveling / dashLen);

                    for (var i = 0; i < num; i++) {
                        context[i % 2 == 0 ? 'moveTo' : 'lineTo'](x1 + (x2 - x1) / num * i, y1 + (y2 - y1) / num * i);
                    }
                    context.stroke();
                }

                const width = this.container.offsetWidth;
                const height = this.container.offsetHeight;
                const itemHeight = this.wordItem.offsetHeight;
                const segment = width / this.content.length;
                this.ctx.beginPath();
                this.ctx.lineWidth = "2";
                this.ctx.strokeStyle = "black";
                const [x1, y1, x2, y2] = [(segment * from) - segment / 2, itemHeight * .9, (segment * to) - segment / 2, height - (itemHeight * .8)];
                drawDashLine(this.ctx, x1, y1, x2, y2, 5);
                this.ctx.save();
                this.ctx.stroke();
                this.ctx.closePath();
            },
            chooseWord(index) {
                index = index + 1;
                Vue.set(this, 'from', index);
                if (R.any(R.propEq("from", index))(this.lineStore)) {
                    this.lineStore = R.remove(R.findIndex(R.propEq("from", index))(this.lineStore), 1, this.lineStore);
                }
                else if (this.to !== null) {
                    this.lineStore = this.lineStore.concat({from: this.from, to: this.to});
                    this.from = null;
                    this.to = null;
                }
                this.initCanvas();
                this.lineStore.forEach(item => {
                    this.matchline(item.from, item.to);
                });
                this.checkAnswer();
            },
            checkAnswer() {
                const getChineseIndex = index => R.findIndex(R.propEq('image', this.chineseArr[index]))(this.content);
                const getEnglishIndex = index => R.findIndex(R.propEq('english_img', this.englishArr[index]))(this.content);
                const answer = this.lineStore.length === this.content.length ? R.all(item => R.equals(getEnglishIndex(item.from - 1), getChineseIndex(item.to - 1)))(this.lineStore) : false;
                this.setAnswer({
                    answer,
                    msg: R.join("<br>")(R.map(R.pipe(R.props(["chinese", "english"]), R.defaultTo([]), R.join("——")))(this.content))
                });
            },

            matchWord(index) {
                index = index + 1;
                this.to = index;
                if (R.any(R.propEq("to", index))(this.lineStore)) {
                    this.lineStore = R.remove(R.findIndex(R.propEq("to", index))(this.lineStore), 1, this.lineStore);
                }
                else if (this.from !== null) {
                    this.lineStore.push({from: this.from, to: this.to});
                    this.from = null;
                    this.to = null;
                }
                this.initCanvas();
                this.lineStore.forEach(item => {
                    this.matchline(item.from, item.to);
                })
                this.checkAnswer();
            },
            ...mapActions('index/course/index', [
                'setAnswer'
            ]),
        },
        mounted() {
            this.init();
        },
        created () {
        },
        computed: {
            chineseArr(){
                const randomFn = _ => Math.random() - .5;
                return R.sort(randomFn)(R.map(R.prop('image'))(this.content))
            },
             englishArr() {
                const randomFn = _ => Math.random() - .5;
                return R.sort(randomFn)(R.map(R.prop('english_img'))(this.content))
            },
            contentInfo(){
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ENGLISH_IMG_PATH(){
                return this.contentInfo.length ? this.contentInfo.map(item => {
                    return `${this.imgPath}/${item.english_img}`;
                }) : [];
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {},
                contentInfo: state => state.contentInfo,
            }),
        },
        watch: {
            content(){
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    ctx: {},
                    from: null,
                    to: null,
                    lineStore: [],
                    container: {},
                    wordItem: {},
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                this.init();
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 600)
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
        min-width: 7.5rem;
        height: 4.7rem;
        position: relative;

    .course-content {
        display: inline-block;
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
        z-index: 20;
    }

    .canvas {
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
        z-index: 1;
    }

    .top-option {
        display: block;

    li {
        width: 150px;
        height: 150px;
        vertical-align: top;
        display: inline-block;
        box-sizing: border-box;
        cursor: pointer;
        position: relative;
        border-radius: 6px;
        color: black;
        text-shadow: 0 0 0 white, 0 0 0 #ff3, 0 0 0 #fd3, 0rem 0rem 0.11rem #f80, 0.02rem 0 0 #f20;

    .bg-img {
        border-radius: 0.06rem;
        /* margin: 0 auto; */
        max-width: 1.5rem;
        max-height: 1.5rem;
        position: absolute;
        left: 0;
        top: 0;
        top: 50%;
        left: 50%;
        /* -webkit-transform: translate(-50%); */
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    }
    .active {
        background: rgba(255,255,255,.6);
        border-radius: 5px;
    }
    }
    .course-content-bottom {
        margin-top: 1.5rem;
    }

    .bottom-option {
        display: block;

    li {
        width: 150px;
        height: 150px;
        vertical-align: top;
        display: inline-block;
        box-sizing: border-box;
        cursor: pointer;
        text-align: center;
        position: relative;
        border-radius: 6px;
        color: black;
        text-shadow: 0 0 0 white, 0 0 0 #ff3, 0 0 0 #fd3, 0rem 0rem 0.11rem #f80, 0.02rem 0 0 #f20;

    .bg-img {
        border-radius: 0.06rem;
        /* margin: 0 auto; */
        max-width: 1.5rem;
        max-height: 1.5rem;
        position: absolute;
        left: 0;
        top: 0;
        top: 50%;
        left: 50%;
        /* -webkit-transform: translate(-50%); */
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    }
    .active {
        background: rgba(255,255,255,.6);
        border-radius: 5px;
    }
    }
    }

    }

    .style-2 {

    .course_common_box {
        text-align: center;

    .course-content {
        display: inline-block;
    }

    .top-option {
        display: block;

    li {
        width: 150px;
        height: 150px;
        vertical-align: top;
        display: inline-block;
        margin: 0 20px;
        box-sizing: border-box;
        cursor: pointer;
        position: relative;
        border-radius: 6px;
        color: black;
        text-shadow: 0 0 0 white, 0 0 0 #ff3, 0 0 0 #fd3, 0rem 0rem 0.11rem #f80, 0.02rem 0 0 #f20;

    .bg-img {
        border-radius: 0.06rem;
        /* margin: 0 auto; */
        max-width: 1.5rem;
        max-height: 1.5rem;
        position: absolute;
        left: 0;
        top: 0;
        top: 50%;
        left: 50%;
        /* -webkit-transform: translate(-50%); */
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    p {
        width: 100%;
        /* display: block; */
        font-size: 0.2rem;
        position: absolute;
        /* z-index: 3; */
        top: 50%;
        /* left: 50%; */
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);

    span {
        display: block;
    }

    }
    }

    }
    .course-content-bottom {
        margin-top: 1.25rem;
    }

    .bottom-option {
        display: block;

    li {
        width: 150px;
        height: 150px;
        vertical-align: top;
        display: inline-block;
        margin: 0 20px;
        box-sizing: border-box;
        cursor: pointer;
        text-align: center;
        position: relative;
        border-radius: 6px;
        color: black;
        text-shadow: 0 0 0 white, 0 0 0 #ff3, 0 0 0 #fd3, 0rem 0rem 0.11rem #f80, 0.02rem 0 0 #f20;

    .bg-img {
        border-radius: 0.06rem;
        /* margin: 0 auto; */
        max-width: 1.5rem;
        max-height: 1.5rem;
        position: absolute;
        left: 0;
        top: 0;
        top: 50%;
        left: 50%;
        /* -webkit-transform: translate(-50%); */
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    p {
        width: 100%;
        /* display: block; */
        font-size: 0.2rem;
        position: absolute;
        /* z-index: 3; */
        top: 50%;
        /* left: 50%; */
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
    }

    }

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

    .top-option {
        color: black;
        text-shadow: 0 0 0 white, 0 0 0 #ff3, 0 0 0 #fd3, 0rem 0rem 0.11rem #f80, 0.02rem 0 0 #f20;

    li {
        display: inline-block;
        margin: 0 0.4rem 0 0.4rem;
        vertical-align: top;
        box-sizing: border-box;
        cursor: pointer;
        position: relative;
        width: 150px;
        height: 150px;

    .bg-img {
        border-radius: 0.06rem;
        /* margin: 0 auto; */
        max-width: 1.5rem;
        max-height: 1.5rem;
        position: absolute;
        left: 0;
        top: 0;
        top: 50%;
        left: 50%;
        /* -webkit-transform: translate(-50%); */
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    p {
        width: 100%;
        /* display: block; */
        font-size: 0.2rem;
        position: absolute;
        /* z-index: 3; */
        top: 50%;
        /* left: 50%; */
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);

    span {
        display: block;
    }

    }
    }

    }
    .bottom-option {
        display: block;
        margin-top: 170px;
        color: black;
        text-shadow: 0 0 0 white, 0 0 0 #ff3, 0 0 0 #fd3, 0rem 0rem 0.11rem #f80, 0.02rem 0 0 #f20;

    li {
        display: inline-block;
        margin: 0 0.4rem 0 0.4rem;
        vertical-align: top;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        cursor: pointer;
        position: relative;
        width: 150px;
        height: 150px;

    /* text-align: center; */
    .bg-img {
        border-radius: 0.06rem;
        /* margin: 0 auto; */
        max-width: 1.5rem;
        max-height: 1.5rem;
        position: absolute;
        left: 0;
        top: 0;
        top: 50%;
        left: 50%;
        /* -webkit-transform: translate(-50%); */
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    p {
        width: 100%;
        /* display: block; */
        font-size: 0.2rem;
        position: absolute;
        /* z-index: 3; */
        top: 50%;
        /* left: 50%; */
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
    }

    }

    }
    }

    }

    .style-4 {

    .course_common_box {
        text-align: center;
        min-width: 7.5rem;
        height: 4.7rem;
        position: relative;

    .course-content {
        display: inline-block;
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
        z-index: 20;
    }

    .canvas {
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
        z-index: 1;
    }

    .top-option {
        display: block;

    li {
        width: 150px;
        height: 150px;
        vertical-align: top;
        display: inline-block;
        box-sizing: border-box;
        cursor: pointer;
        position: relative;
        border-radius: 6px;
        color: black;
        text-shadow: 0 0 0 white, 0 0 0 #ff3, 0 0 0 #fd3, 0rem 0rem 0.11rem #f80, 0.02rem 0 0 #f20;

    .bg-img {
        border-radius: 0.06rem;
        /* margin: 0 auto; */
        max-width: 1.5rem;
        max-height: 1.5rem;
        position: absolute;
        left: 0;
        top: 0;
        top: 50%;
        left: 50%;
        /* -webkit-transform: translate(-50%); */
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    }
    .active {
        background: rgba(255,255,255,.6);
        border-radius: 5px;
    }
    }
    .course-content-bottom {
        margin-top: 1.5rem;
    }

    .bottom-option {
        display: block;

    li {
        width: 150px;
        height: 150px;
        vertical-align: top;
        display: inline-block;
        box-sizing: border-box;
        cursor: pointer;
        text-align: center;
        position: relative;
        border-radius: 6px;
        color: black;
        text-shadow: 0 0 0 white, 0 0 0 #ff3, 0 0 0 #fd3, 0rem 0rem 0.11rem #f80, 0.02rem 0 0 #f20;

    .bg-img {
        border-radius: 0.06rem;
        /* margin: 0 auto; */
        max-width: 1.5rem;
        max-height: 1.5rem;
        position: absolute;
        left: 0;
        top: 0;
        top: 50%;
        left: 50%;
        /* -webkit-transform: translate(-50%); */
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    }
    .active {
        background: rgba(255,255,255,.6);
        border-radius: 5px;
    }
    }
    }

    }


</style>
