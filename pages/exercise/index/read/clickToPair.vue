<template>
    <div :class="isUpdate&&'fadeIn'">
        <div class="container">
            <div class="pair-picture" ref="container">
                <canvas ref="drawingBoard" class="canvas"></canvas>
                <div class="pic-container">
                    <div class="top">
                        <div v-for="(item,index) in content.words" class="word-container">
                            <div class="clothes" :style="getBGI(content.imageA)" ref="word" @click="chooseWord(index)"
                                 :class="(from-1)===index&&'active'">{{item.wordA}}
                            </div>
                        </div>
                    </div>
                    <div class="bottom">
                        <div v-for="(item,index) in content.words" class="word-container">
                            <div class="horse" :style="getBGI(content.imageB)" @click="matchWord(index)"
                                 :class="(to-1)===index&&'active'">{{item.wordB}}
                            </div>
                        </div>
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
                    container: {},
                    wordItem: {},
                    chooseIndex: "",
                    matchIndex: "",
                    alreadyArr: new Set(),
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
                this.lineStore = this.lineStore.concat({from: this.from, to: this.to});
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
            const answer = this.lineStore.length === this.content.words.length ? R.all(item => R.equals(item.from, item.to))(this.lineStore) : false;
            this.setAnswer({
                answer,
                msg: ` ${R.join("、")(R.map(R.values)(this.content.words))}`
            });
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

        created() {
            this.$nextTick(_ => {
//                初始化
                this.ctx = this.$refs.drawingBoard.getContext("2d");
                this.container = this.$refs.container;
                this.wordItem = this.$refs.word[0];
                this.initCanvas();
//                初始化

            })
        }

        mounted() {
            this.init();
        }

        init() {
            this.$nextTick(_ => {
                this.setAnswer({
                    answer: false,
                    msg: this.content.words && ` ${R.join("、")(R.map(R.values)(this.content.words))}`
                });
            })
        }

        initCanvas() {
            this.$refs.drawingBoard.width = this.container.offsetWidth;
            this.$refs.drawingBoard.height = this.container.offsetHeight;
        }

        matchline(from, to) {
            const width = this.container.offsetWidth;
            const height = this.container.offsetHeight;
            const itemHeight = this.wordItem.offsetHeight;
            const segment = width / this.content.words.length;
            this.ctx.beginPath();
            this.ctx.lineWidth = "2";
            this.ctx.strokeStyle = "black";
            this.ctx.moveTo((segment * from) - segment / 2.2, itemHeight * .9);
            this.ctx.lineTo((segment * to) - segment / 2, height - (itemHeight * .8));
            this.ctx.save();
            this.ctx.stroke();
            this.ctx.closePath();
        }

        getBGI(path) {
            return {backgroundImage: `url(${this.addPrefixHost(path)})`}
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

    .container {
        text-align: center;
        margin-top: 100px;

        .canvas {
            position: absolute;
            left: 0;
            bottom: 0;
            top: 0;
            right: 0;
            z-index: 1;
        }
        .bottom {
            margin-top: 100px;
        }
        .pair-picture {
            width: 850px;
            height: 500px;
            display: inline-block;
            position: relative;
        }
        .pic-container {
            position: absolute;
            left: 0;
            bottom: 0;
            top: 0;
            right: 0;
            z-index: 20;
        }
        .pair-picture li {
            display: inline-block;
            margin-right: 5%;
        }
        .word-container {
            width: 33%;
            display: inline-block;
            cursor: pointer;
            vertical-align: middle;
        }
        .clothes {
            background: url(~~assets/img/main_content/exercise/clothes.png);
            width: 180px;
            height: 172px;
            background-size: 100% 100%;
            margin: 0 auto 15% auto;
            text-align: center;
            line-height: 2.5rem;
            color: white;
            display: inline-block;
            font-size: 30px;
            cursor: pointer;

            font-family: 'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;

        }
        .horse {
            background: url(~~assets/img/main_content/exercise/horse.png);
            width: 230px;
            height: 172px;
            background-size: 100% 100%;
            text-align: center;
            display: inline-block;
            line-height: 2.5rem;
            color: white;
            font-size: 30px;
            cursor: pointer;

            font-family: 'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;

        }
    }
</style>
