<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-top">
                            <ul class="content-top-wordlist">
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div class="content-bottom">
                            <div class="content-bottom-radical"></div>
                            <div class="content-bottom-state">
                                <div class="state-inside">
                                    <span><em>Radical :</em><em>animal</em></span>
                                    <span><em>Meaning :</em><em>cat/dog/pig</em></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-2" v-if="templateStyle ==='style-2'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-left">
                            <ul class="content-left-word">
                                <li v-for="item in contentInfo.wordImages">
                                    <loadingImage :src="addPrefixHost(item.image)"/>
                                </li>
                            </ul>
                            <div class="content-left-parts">
                                <div class="content-tool">
                                    <span class="parts-write"></span>
                                    <!--<span>PLAY</span>-->
                                </div>
                                <div class="content-tool">
                                    <span class="parts-hint"></span>
                                    <!--<span>RECORD</span>-->
                                </div>
                            </div>
                        </div>
                        <div class="content-right">
                            <span class="content-right-cn">{{contentInfo.words.pinyin}}</span>
                            <span class="content-right-en">{{contentInfo.words.english}}</span>
                            <span class="content-right-en"
                                  v-if="contentInfo.words.meaning.length">{{contentInfo.words.meaning}}</span>
                            <div class="content-rights-radical">
                                <em>Radical</em>
                                <em>{{contentInfo.radicals}}</em>
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
                        <div class="content-left">
                            <div class="inside">
                                <div class="tb">
                                    <ul class="content-left-word">
                                        <li v-for="item in contentInfo.wordImages">
                                            <loadingImage :src="addPrefixHost(item.image)"/>
                                        </li>
                                    </ul>
                                    <div class="content-left-parts">
                                        <div class="content-tool">
                                            <span class="parts-write"></span>
                                            <span>WRITE</span>
                                        </div>
                                        <div class="content-tool">
                                            <span class="parts-hint"></span>
                                            <span>HINT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-right">
                            <div class="inside">
                                <div class="tb">
                                    <span class="content-right-cn">{{contentInfo.words.pinyin}}</span>
                                    <div class="conten-right-spell">
                                        <span>{{contentInfo.words.english}}</span>
                                        <span><em>Radicals:</em><em>{{contentInfo.words.radicals}}</em></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="style-4" v-if="templateStyle ==='style-4'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="content-left">
                            <div class="inside">
                                <div class="tb">
                                    <ul class="content-left-word">
                                        <li v-for="(item,index) in contentInfo.wordImages">
                                            <img :src="writeHint(item)" :class="(write===true&compare===false)&&'show'">
                                            <canvas ref="canvas" :class="write===true&&'show'"
                                                    @mousedown="moveBegin($event,index)"
                                                    @mousemove="move($event,index)"
                                                    @mouseout="leave($event,index)"
                                                    @mouseup="leave($event,index)"></canvas>
                                        </li>
                                    </ul>
                                    <div class="content-left-parts">
                                        <div class="content-tool">
                                            <span class="parts-write" @click="write=!write;hint=false;clearCanvas()"
                                                  :class="write&&'active'"></span>
                                            <span>WRITE</span>
                                        </div>
                                        <div class="content-tool">
                                            <span class="parts-hint" @click="hint=!hint;write=false;clearCanvas()"
                                                  :class="hint&&'active'"></span>
                                            <span>HINT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-right">
                            <div class="inside">
                                <div class="tb">
                                    <span class="content-right-cn"
                                          :style="{'display':pinyinSwitch ? 'block':'none'}">{{contentInfo.words && contentInfo.words.pinyin}}</span>
                                    <span class="content-right-en">{{contentInfo.words && contentInfo.words.english}}</span>
                                    <div class="conten-right-spell">
                                        <span><em>Radicals:</em><em>{{contentInfo.words && contentInfo.words.radicals}}</em></span>
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

    export default {
        async fetch({store, params, isServer, redirect}) {
            (isServer || !params) && redirect("/learner/myCourse");
            params.extendData || await store.dispatch("index/course/index/setContentInfo", params);
        },
        asyncData({params}) {
            return {extendData: params.extendData}
        }, data() {
            return {
                ratio: 3,
                lineWidth: 16,
                canvas: [],
                start: [],
                touched: [],
                hint: false,
                write: false,
                isUpdate: false
            }
        },
        methods: {
            ...mapActions('index/course/index', [
                'setAnswer',
                'setJudge'
            ]),
            moveBegin(ev, index) {
                this.start[index] ? void 0 : this.start[index] = {};
                const start = this.start[index];
                start.x = ev.offsetX * this.ratio;
                start.y = ev.offsetY * this.ratio;
                const canvas = this.canvas[index];
                canvas.beginPath();
                canvas.moveTo(this.start.x, this.start.y);
                canvas.lineWidth = this.lineWidth;
                this.canvas.lineJoin = "round";
                this.canvas.lineCap = "round";
                canvas.strokeStyle = "#00fed8";
                this.touched[index] = true;
            },
            move(ev, index) {
                if (this.touched[index]) {
                    const canvas = this.canvas[index];
                    canvas.lineTo(ev.offsetX * this.ratio, ev.offsetY * this.ratio);
                    canvas.stroke();
                    canvas.save();
                    this.setJudge({practice: true, haveJudge: true});
                }
            },
            leave(ev, index) {
                this.touched[index] = false;
            },
            writeHint(item) {
                if (item) {
                    return !this.hint ? this.addPrefixHost(item.image) : this.addPrefixHost(item.image_gif);
                }
            },
            clearCanvas() {
                for (let i = 0, len = this.$refs.canvas.length; i < len; i++) {
                    const ele = this.$refs.canvas[i];
                    const cxt = ele.getContext("2d");
                    cxt.clearRect(0, 0, ele.width, ele.height);
                }
            },
            init() {
                this.$nextTick(_ => {
                    if (this.$refs.canvas) {
                        for (let i = 0, len = this.$refs.canvas.length; i < len; i++) {
                            const ele = this.$refs.canvas[i];
                            ele.height = ele.parentNode.offsetHeight * this.ratio;
                            ele.width = ele.parentNode.offsetWidth * this.ratio;
                            ele.style.height = ele.parentNode.offsetHeight + "px";
                            ele.style.width = ele.parentNode.offsetWidth + "px";
                        }
                        for (let i = 0, len = this.$refs.canvas.length; i < len; i++) {
                            const ele = this.$refs.canvas[i];
                            this.canvas.push(ele.getContext("2d"));
                        }
                    }
                });

            },
        },
        created() {
        },
        mounted() {
            this.init();
        },
        watch: {
            contentInfo() {
//                当数据发生变化后执行动画效果
                const initData = {
                    ratio: 3,
                    lineWidth: 16,
                    canvas: [],
                    start: [],
                    touched: [],
                    hint: false,
                    write: false,
                    isUpdate: false
                };
                const init = (val, key) => {
                    this[key] = val;
                };
                R.forEachObjIndexed(init)(initData);
                this.init();
                setTimeout(_ => {
                    this.isUpdate = false;
                }, 500)
            }
        },
        computed: {
            contentInfo() {
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle,
                pinyinSwitch: state => state.pinyinSwitch,
                compare: state => state.compare
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
                width: 7.5rem;
            }

            .content-top-wordlist {

                li {
                    display: inline-block;
                    width: 150px;
                    height: 150px;
                    border-radius: 5px;
                    border: 3px solid #002D32;
                    margin: 0 45px 0 45px;
                }

            }
            .content-bottom {
                margin-top: 100px;

                .content-bottom-radical {
                    width: 135px;
                    height: 135px;
                    border-radius: 5px;
                    border: 3px solid #002D32;
                    display: inline-block;
                    vertical-align: top;
                    margin-right: 50px;
                    box-sizing: border-box;
                }

                .content-bottom-state {
                    display: inline-block;
                    width: 500px;
                    height: 135px;
                    border: 3px solid #002D32;
                    border-radius: 5px;
                    vertical-align: top;
                    color: white;
                    font-size: 25px;
                    padding: 8px;
                    box-sizing: border-box;
                    background: #002D32;

                    .state-inside {
                        border: 2px dashed white;
                        padding: 10px 0 10px 40px;
                        box-sizing: border-box;
                        border-radius: 5px;
                    }

                    span {
                        text-align: left;
                        display: block;
                        margin: 8px 0;

                        em:nth-child(1) {
                            width: 120px;
                            display: inline-block;
                            text-align: right;
                        }

                        em:nth-child(2) {
                            margin-left: 20px;
                        }

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
                border: 5px solid #006C29;
                border-radius: 10px;
                display: inline-block;
                margin-top: 3%;
                background: #8EFF56;
                padding: 50px 20px 50px 20px;
                min-width: 650px;
            }

            .content-left, .content-right {
                display: inline-block;
                vertical-align: middle;
            }

            .content-left {
                margin-right: 50px;
            }

            .content-right {
                padding: 0 20px;
                max-width: 230px;
                word-wrap: break-word;
            }

            .content-left-word {
                display: inline-block;
                background: #53A600;
                border-radius: 5px;
                padding: 5px;
                box-shadow: 0px 2px 8px -1px black;
                overflow: auto;
            }

            .content-left-word li {
                width: 140px;
                height: 140px;
                border: 1px solid black;
                background: white;
                margin: 2px;
                float: left;
                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .content-left-parts {
                margin-top: 50px;
                text-align: center;

                .content-tool:nth-child(1) {
                    margin-right: .3rem;
                }

                .content-tool:nth-child(2) {
                    margin-left: .3rem;
                }

                .content-tool {
                    display: inline-block;

                    span {
                        display: block;
                        margin: 0 auto;
                    }

                    span:nth-child(2) {
                        margin-top: .05rem;
                        color: green;
                    }

                }
            }
            .parts-write {
                background: url("~~assets/img/main_content/course/l2-write.png") center no-repeat;
                background-size: cover;
            }

            .parts-hint {
                background: url("~~assets/img/main_content/course/l2-hint.png") center no-repeat;
                background-size: cover;
            }
            .parts-write, .parts-hint {
                display: block;
                cursor: pointer;
                width: 68px;
                height: 68px;
                border-radius: 50%;
            }

            .content-right-cn {
                display: block;
                font-size: 25px;
                margin-bottom: 17px;
            }

            .content-right-en {
                display: block;
                font-size: 20px;
                margin-bottom: 17px;
            }

            .content-rights-radical {
                background: #DBFF5A;
                border-radius: 5px;
                box-shadow: 0px 2px 8px -1px black;
                padding: 30px 35px 30px 35px;
                border: 1px solid #53A600;

                em:nth-child(1) {
                    font-size: 25px;
                    display: block;
                }

                em:nth-child(2) {
                    font-size: 20px;
                    display: block;
                }

            }

        }
    }

    .style-3 {

        .course_common_box {
            margin: 0 auto;

            .course-content {
                min-width: 7.5rem;
                height: 4rem;
                margin: 0 auto;
                border: 3px solid #871E24;
                border-radius: 5px;
                background: #F4DB87;
                text-align: center;

                .content-left, .content-right {
                    height: 100%;
                    display: inline-block;
                    vertical-align: top;
                    box-sizing: border-box;
                    .inside {
                        display: table;
                        width: 100%;
                        height: 100%;
                    }
                }

                .content-right {
                    width: 2.3rem;
                    padding: 10px 10px;
                    word-wrap: break-word;
                }

                .content-right-cn {
                    font-size: 20px;
                    display: block;
                    margin-bottom: 55px;
                }

                .conten-right-spell {
                    text-align: left;
                    padding-left: 30px;
                    border-top: 1px solid #871E24;
                    span:nth-child(1) {
                        display: block;
                        font-size: 20px;
                        margin: 15px 0 30px 0;
                    }

                    span:nth-child(2) {
                        display: block;
                        font-size: 20px;
                        margin: 35px 0 10px 0;

                        em:nth-child(1) {
                            margin-right: 10px;
                        }

                    }

                }
                .content-left {
                    min-width: 4.5rem;
                    height: 100%;
                    box-sizing: border-box;
                    background: url("~~assets/img/main_content/course/l3-radical-line.png") 100% center no-repeat;
                    background-size: 40px;
                    padding: 0 50px 0 25px;
                    .content-left-word {
                        margin: 0 auto;
                        margin-bottom: .4rem;

                        li {
                            display: inline-block;
                            width: 140px;
                            height: 140px;
                            vertical-align: middle;
                            margin: 0 5px;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }

                    }

                    .content-left-parts {
                        margin-top: 50px;
                        text-align: center;

                        .content-tool:nth-child(1) {
                            margin-right: .4rem;
                        }

                        .content-tool:nth-child(2) {
                            margin-left: .4rem;
                        }

                        .content-tool {
                            display: inline-block;

                            span {
                                display: block;
                                margin: 0 auto;
                            }

                            span:nth-child(2) {
                                margin-top: .05rem;
                                color: #872822;
                            }

                        }
                    }
                    .parts-write {
                        background: url("~~assets/img/main_content/course/l3-write.png") center no-repeat;
                        background-size: cover;
                    }

                    .parts-hint {
                        background: url("~~assets/img/main_content/course/l3-hint.png") center no-repeat;
                        background-size: cover;
                    }
                    .parts-write, .parts-hint {
                        display: block;
                        cursor: pointer;
                        width: 68px;
                        height: 68px;
                        border-radius: 50%;
                    }

                }
            }

        }
    }

    .style-4 {

        .course_common_box {
            margin: 0 auto;

            .course-content {
                height: 4.1rem;
                margin: 0 auto;
                text-align: center;

                .content-left, .content-right {
                    height: 100%;
                    display: inline-block;
                    vertical-align: top;
                    box-sizing: border-box;
                    background: white;
                    .inside {
                        display: table;
                        width: 100%;
                        height: 100%;
                    }
                }

                .content-left {
                    min-width: 490px;
                    padding: 0rem .2rem;
                    border: 3px solid #2A5CB8;
                    border-radius: 10px;
                    border-right: 3px dotted #2A5CB8;
                }

                .content-right {
                    padding: 0rem 0.15rem 0 0.15rem;
                    border: 3px solid #2A5CB8;
                    border-radius: 10px;
                    border-left: none;
                    width: 2.3rem;
                    word-wrap: break-word;
                }

                .content-right-en, .content-right-cn {
                    font-size: 22px;
                    display: block;
                    margin-bottom: 40px;
                }

                .conten-right-spell {
                    border-top: 2px dashed black;
                    text-align: left;
                    /* padding: 0 40px 0 20px; */
                    font-size: 22px;
                    padding-top: 60px;
                    /* background-color: white; */
                }

                .content-left {

                    .content-left-word {
                        margin: 0 auto;
                        margin-bottom: .4rem;

                        li {
                            display: inline-block;
                            width: 1.3rem;
                            height: 1.3rem;
                            border: 0.01rem solid #999999;
                            margin: .1rem .05rem;
                            position: relative;
                            img {
                                position: absolute;
                                width: 100%;
                                height: 100%;
                                left: 0;
                                top: 0;
                                display: block;
                                &.show {
                                    display: none;
                                }
                            }
                            canvas {
                                display: none;
                                cursor: pointer;
                                position: absolute;
                                left: 0;
                                top: 0;
                                &.show {
                                    display: block;
                                }
                            }
                        }

                    }

                    .content-left-parts {
                        margin-top: 20px;
                        text-align: center;

                        .content-tool:nth-child(1) {
                            margin-right: .4rem;
                        }

                        .content-tool:nth-child(2) {
                            margin-left: .4rem;
                        }

                        .content-tool {
                            display: inline-block;

                            span {
                                display: block;
                                margin: 0 auto;
                            }

                            span:nth-child(2) {
                                margin-top: .05rem;
                                color: #023C7F;
                            }

                        }
                    }
                    .parts-write, .parts-hint {
                        display: block;
                        cursor: pointer;
                        width: 68px;
                        height: 68px;
                        border-radius: 50%;
                        &.active {
                            filter: drop-shadow(0rem 0rem 0rem black);
                        }
                    }
                    .parts-write {
                        background: url("~~assets/img/main_content/course/l4-write.png") center no-repeat;
                        background-size: cover;
                    }
                    .parts-hint {
                        background: url("~~assets/img/main_content/course/l4-hint.png") center no-repeat;
                        background-size: cover;
                    }
                }
            }

        }
    }
</style>
