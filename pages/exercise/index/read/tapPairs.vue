<template>
    <div class="practice_tap_pairs practice_common_box" :class="isUpdate&&'fadeIn'"
    >
        <div class="tap_pairs_content" ref="container">
            <div class="center_cell">
                <canvas ref="drawingBoard" class="canvas"></canvas>
                <div class="tap_pairs_top">
                    <div class="pairs-container" v-for="(item,index) in englishArr"
                         :style="{width:`${1/content.length*100}%`}">
                        <p ref="word" @click="chooseWord(index)" :class="(from-1)===index&&'active'">
                            {{item}}</p>
                    </div>
                </div>
                <div class="tap_pairs_bottom">
                    <div class="pairs-container" v-for="(item,index) in chineseArr"
                         :style="{width:`${1/content.length*100}%`}">
                        <p @click="matchWord(index)" :class="(to-1)===index&&'active'">{{item}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Component from 'vue-class-component'
    import R from 'ramda';
    import loadingImage from '~/components/loadingImage'
    @Component({
        components: {loadingImage},
        async fetch({store, params}){
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },
        computed: {
            ...mapState('index/exercise/index', {
                contentInfo: state => state.contentInfo,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ])
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

    })
    export default class chooseNumber extends Vue {
        ctx = {};
        isUpdate = false;
        from = null;
        to = null;
        lineStore = [];
        container = {};
        wordItem = {};

        chooseWord(index) {
            index = index + 1;
            this.from = index;
            if (R.any(R.propEq("from", index))(this.lineStore)) {
                this.lineStore = R.remove(R.findIndex(R.propEq("from", index))(this.lineStore), 1, this.lineStore);
            }
            else if (this.to !== null) {
                this.lineStore.push({from: this.from, to: this.to});
                this.from = null;
                this.to = null;
            }
            this.initCanvas();
            this.lineStore.forEach(item => {
                this.matchline(item.from, item.to);
            });
            this.checkAnswer();
        }

        checkAnswer() {
            const getChineseIndex = index => R.findIndex(R.propEq('chinese', this.chineseArr[index]))(this.content);
            const getEnglishIndex = index => R.findIndex(R.propEq('english', this.englishArr[index]))(this.content);
            const answer = this.lineStore.length === this.content.length ? R.all(item => R.equals(getEnglishIndex(item.from - 1), getChineseIndex(item.to - 1)))(this.lineStore) : false;
            this.setAnswer({
                answer,
                msg: R.join("\n")(R.map(R.pipe(R.props(["chinese", "english"]), R.defaultTo([]), R.join("——")))(this.content))
            });
        }

        get chineseArr() {
            const randomFn = _ => Math.random() - .5;
            return R.sort(randomFn)(R.map(R.prop('chinese'))(this.content))
        }

        get englishArr() {
            const randomFn = _ => Math.random() - .5;
            return R.sort(randomFn)(R.map(R.prop('english'))(this.content))
        }

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

        }

        mounted() {
            this.init();
        }

        init() {
            if (this.contentInfo["template_no"] === 'D01') {
                this.$nextTick(_ => {
//                初始化
                    this.ctx = this.$refs.drawingBoard.getContext("2d");
                    this.container = this.$refs.container;
                    this.wordItem = this.$refs.word[0];
                    this.initCanvas();
//                初始化
                    this.setAnswer({
                        answer: false,
                        msg: R.join("\n")(R.map(R.pipe(R.props(["chinese", "english"]), R.defaultTo([]), R.join("——")))(this.content))
                    });

                })
            }
        }

        initCanvas() {
            this.$refs.drawingBoard.width = this.container.offsetWidth;
            this.$refs.drawingBoard.height = this.container.offsetHeight;
        }

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
        }
    }
</script>

<style lang="less" scoped>
    .fadeIn {
        animation: fadeIn .4s ease-in;
        transform: translateZ(0);
    }

    @keyframes fadeIn {
        from {
            transform-origin: left;
            transform: scaleX(.4);
            opacity: 0;
        }
    }

    .canvas {
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
    }

    .practice_common_box {
        width: 750px;
        height: 100%;
        display: block;
        margin: 0 auto;
        position: relative;
        text-align: center;
    }

    .tap_pairs_content {
        margin-top: 40px;
        display: table;
        width: 100%;
        height: 100%;
    }

    .center_cell {
        display: table-cell;
        vertical-align: middle;
    }

    .tap_pairs_top {
        margin-bottom: 170px;
        .container {
            display: inline-block;
            width: 30%;
            text-align: center;
        }
    }

    .tap_pairs_top p {
        margin-bottom: 0;
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        background: url(~~assets/img/main_content/exercise/cloud.png) no-repeat;
        background-size: 100% 100%;
        background-position: center;
        line-height: 150px;
        font-size: 26px;
        color: #CC0099;
        cursor: pointer;
        position: relative;
        &.active {
            background-image: url(~~assets/img/main_content/exercise/audio_speaking_active.png);
            background-size: 130% 120%;
            color: black;
            transition: all .1s ease-in;
        }
    }

    .tap_pairs_top p span {
        position: absolute;
        width: 8px;
        border-radius: 10px;
        display: none;
        background: linear-gradient(white 25%, #2980B9 0, #2980B9 50%, white 0, white 75%, #2980B9 0);
        background-size: 100% 30px;
    }

    .tap_pairs_top p:nth-child(1) span:nth-child(1) {
        height: 165px;
        left: 55px;
        top: 120px;
    }

    .tap_pairs_top p:nth-child(1) span:nth-child(2) {
        left: 150px;
        top: 68px;
        height: 260px;
        -webkit-transform: rotate(-48deg);
        -ms-transform: rotate(-48deg);
        transform: rotate(-48deg);
    }

    .tap_pairs_top p:nth-child(1) span:nth-child(3) {
        left: 227px;
        top: 3px;
        height: 390px;
        -webkit-transform: rotate(-65deg);
        -ms-transform: rotate(-65deg);
        transform: rotate(-64deg);
    }

    .tap_pairs_top p:nth-child(2) span:nth-child(1) {
        left: -30px;
        top: 75px;
        height: 245px;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }

    .tap_pairs_top p:nth-child(2) span:nth-child(2) {
        left: 55px;
        top: 110px;
        height: 175px;
    }

    .tap_pairs_top p:nth-child(2) span:nth-child(3) {
        left: 140px;
        top: 75px;
        height: 245px;
        -webkit-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
    }

    .tap_pairs_top p:nth-child(3) span:nth-child(1) {
        left: -120px;
        top: 0;
        height: 395px;
        -webkit-transform: rotate(64deg);
        -ms-transform: rotate(64deg);
        transform: rotate(64deg);
    }

    .tap_pairs_top p:nth-child(3) span:nth-child(2) {
        left: -34px;
        top: 70px;
        height: 255px;
        -webkit-transform: rotate(46deg);
        -ms-transform: rotate(46deg);
        transform: rotate(46deg);
    }

    .tap_pairs_top p:nth-child(3) span:nth-child(3) {
        left: 55px;
        top: 110px;
        height: 175px;
    }

    .pairs-container {
        display: inline-block;
        text-align: center;
    }

    .tap_pairs_bottom p {
        margin-bottom: 0;
        display: inline-block;
        width: 130px;
        height: 100px;
        background: url(~~assets/img/main_content/exercise/choose1_img_bg.png) no-repeat;
        background-size: 100% 100% !important;
        background-position: center center !important;
        line-height: 95px;
        font-size: 26px;
        color: #0000FF;
        margin-left: 20px;
        margin-right: 20px;
        cursor: pointer;
        position: relative;
        &.active {
            transition: all .1s ease-in;
            background-image: url("~~assets/img/main_content/exercise/choose_block_bg_active.png");
        }
    }
</style>
