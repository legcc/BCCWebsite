<template>
    <div>
        <transition name="fade">
            <div class="style-3" v-if="templateStyle ==='style-3'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="course-content-sentence">
                            {{contentInfo.sentence}}
                        </div>
                        <ul class="course-content-word">
                            <li v-for="item in contentInfo.words">
                                <div>{{item.chinese}}</div>
                            </li>
                        </ul>
                        <div class="course-content-img">
                            <loadingImage :src="addPrefixHost(contentInfo.image)"/>
                        </div>
                        <ul class="course-content-spell">
                            <li v-for="item in contentInfo.words">
                                {{item.english}}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-4" v-if="templateStyle ==='style-4'">
                <div class="course_common_box">
                    <canvas ref="drawingBoard" class="canvas"></canvas>
                    <div class="course-content" ref="container">
                        <ul class="course-content-spell">
                            <li v-for="(item,index) in englishArr" @click="chooseWord(index)" ref="word"
                                :style="{margin:`${1/content.words.length*100}% 0`}"
                                :class="(from-1)===index&&'active'">
                                <div class="tb">
                                    {{item}}
                                </div>
                            </li>
                        </ul>
                        <ul class="course-content-word">
                            <li v-for="(item,index) in chineseArr" @click="matchWord(index)"
                                :style="{margin:`${1/content.words.length*100}% 0`}" :class="(to-1)===index&&'active'">
                                <div class="tb">
                                    {{item}}
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
        async fetch({store, params, isServer, redirect}) {
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}) {
            return {extendData: params.extendData}
        }, data() {
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
                if (this.contentInfo["template_no"] === 'K09') {
                    this.$nextTick(_ => {
                        this.ctx = this.$refs.drawingBoard.getContext("2d");
                        this.container = this.$refs.container;
                        this.wordItem = this.$refs.word[0];
                        this.initCanvas();
//                初始化
                        this.setAnswer({
                            answer: false,
                            msg: R.join("<br>")(R.map(R.pipe(R.props(["chinese", "english"]), R.defaultTo([]), R.join("——")))(this.content.words))
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
                const itemWidth = this.wordItem.offsetWidth;
                const segment = height / this.content.words.length;
                const margin = 1 / this.content.words.length * 100;
                this.ctx.beginPath();
                this.ctx.lineWidth = "2";
                this.ctx.strokeStyle = "black";
                const [x1, y1, x2, y2] = [itemWidth * 1.23, (segment * from) - (margin * from), width - (itemWidth * 1.12), (segment * to) - (margin * to)];
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
                const getChineseIndex = index => R.findIndex(R.propEq('chinese', this.chineseArr[index]))(this.content.words);
                const getEnglishIndex = index => R.findIndex(R.propEq('english', this.englishArr[index]))(this.content.words);
                const answer = this.lineStore.length === this.content.words.length ? R.all(item => R.equals(getEnglishIndex(item.from - 1), getChineseIndex(item.to - 1)))(this.lineStore) : false;
                this.setAnswer({
                    answer,
                    msg: R.join("<br>")(R.map(R.pipe(R.props(["chinese", "english"]), R.defaultTo([]), R.join("——")))(this.content.words))
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
        created() {
        },
        computed: {
            chineseArr() {
                const randomFn = _ => Math.random() - .5;
                return R.sort(randomFn)(R.map(R.prop('chinese'))(this.content.words ? this.content.words : ''))
            },
            englishArr() {
                const randomFn = _ => Math.random() - .5;
                return R.sort(randomFn)(R.map(R.prop('english'))(this.content.words ? this.content.words : ''))
            },
            contentInfo() {
                return this.courseExtendInfo || this.extendData || this.contentData;
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
            content() {
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
    .style-3 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
            }

            .course-content-sentence {
                font-size: 22px;
                width: 7.5rem;
            }

            .course-content-word, .course-content-img, .course-content-spell {
                display: inline-block;
                vertical-align: middle;
            }

            .course-content-word {

                li {
                    display: block;
                    width: 1.4rem;
                    padding: 0.03rem;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    background: #BE2C23;
                    font-size: 0.22rem;
                    line-height: 0.42rem;
                    color: white;
                    background: -o-linear-gradient(#B43C0B 0, #901D1C 90%);
                    background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #B43C0B), color-stop(90%, #901D1C));
                    background: linear-gradient(#B43C0B 0, #901D1C 90%);
                    margin: 0.6rem 0.2rem 0.6rem 0.2rem;
                    cursor: pointer;

                    div {
                        padding: 0 .02rem;
                        border: 0.01rem solid #FB984B;
                        -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                        /* padding: 0 .02rem; */
                        min-height: .44rem;
                    }

                }
            }
            .course-content-img {

                margin: 0 50px 0 50px;
                img {
                    max-width: 3.5rem;
                    max-height: 320px;
                    border-radius: 5px;
                }
            }

            .course-content-spell {

                li {
                    width: 1.4rem;
                    /* max-width: 2rem; */
                    min-height: 0.5rem;
                    background: #681515;
                    border-left: 0.02rem solid #901D1C;
                    border-bottom: 0.02rem solid #901D1C;
                    -webkit-box-shadow: -0.03rem 0.01rem 0.05rem black inset;
                    box-shadow: -0.03rem 0.01rem 0.05rem black inset;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    margin: 0.6rem 0.2rem 0.6rem 0.2rem;
                    color: white;
                    font-size: 0.18rem;
                    cursor: pointer;
                    /* padding: 0 .02rem; */
                    /* display: table; */
                    padding: .1rem .02rem;

                }

            }
        }

    }

    .style-4 {

        .course_common_box {
            margin: 0 auto;
            text-align: center;
            position: relative;
            width: 7.5rem;
            height: 4.7rem;
            .course-content {
                display: inline-block;
                position: absolute;
                left: 0;
                bottom: 0;
                top: 0;
                right: 0;
                z-index: 20;
            }

            .course-content-spell {
                position: absolute;
                top: 50%;
                left: 5%;
                transform: translate(0, -50%);
                li {
                    width: 170px;
                    height: 50px;
                    display: table;
                    border-radius: 5px;
                    font-size: 22px;
                    color: white;
                    cursor: pointer;
                    padding: 0 .05rem;
                    background: linear-gradient(#9D5678 0, #7F4577 90%);
                    box-shadow: 0 0.03rem 0.03rem black;
                    font-family: Calibri;
                }

                li:hover {
                    background: linear-gradient(#6944B5 0, #353C8D 90%);
                }
                .active {
                    background: linear-gradient(#6944B5 0, #353C8D 90%);
                }
            }
            .course-content-word {
                position: absolute;
                right: 5%;
                top: 50%;
                transform: translate(0, -50%);
                li {
                    display: table;
                    width: 170px;
                    height: 50px;
                    line-height: 50px;
                    border-radius: 5px;
                    color: white;
                    cursor: pointer;
                    font-size: 22px;
                    font-family: KaiTi;
                    padding: 0 .05rem;
                    background: linear-gradient(-315deg, #935378, #733A6D);
                    box-shadow: 0 0 0rem 0.01rem white, -0.05rem 0.05rem 0.15rem black inset;
                }

                li:hover {
                    background: linear-gradient(-315deg, #6944B5, #353C8D);
                }
                .active {
                    background: linear-gradient(#6944B5 0, #353C8D 90%);
                }
            }
        }

    }

</style>
