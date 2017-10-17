<template>
    <div>
        <transition name="fade">
            <div class="style-1" v-if="templateStyle ==='style-1'">
                <div class="course_common_box">
                    <div class="course-content">
                        <div class="course-content-left">
                            <div class="course-content-img">
                                <loadingImage :src="addPrefixHost(contentInfo.images)"/>
                            </div>
                        </div>
                        <div class="course-content-right">
                            <span class="parts-audio" @click="playAudio($event)"
                                  v-if="contentInfo.audio&&contentInfo.audio.length"></span>
                            <template v-if="contentInfo.sentences&&contentInfo.sentences.length<=1">
                                <div class="course-content-sentence type-1">
                                    <div v-for="item in contentInfo.sentences" class="sentence en">
                                        {{item.english}}
                                    </div>
                                </div>
                                <ul class="course-content-blank" ref="blank" @click="setOption($event)"
                                    v-if="contentInfo.sentences&&contentInfo.sentences.length<=1">
                                    <li v-for="(item,index) in answerArr" v-if="item">
                                        <div class="tb">
                                            <em :style="{'display':pinyinSwitch ? 'block':'none'}"
                                                class="py">{{item.pinyin || ''}}</em>
                                            <em class="cn">{{item.chinese}}</em>
                                            <em>{{item.english}}</em>
                                        </div>
                                    </li>
                                </ul>
                            </template>
                            <template v-if="contentInfo.sentences&&contentInfo.sentences.length>1">
                                <div class="course-content-sentence type-2">
                                    <ul class="sentence">
                                        <li v-for="item in contentInfo.sentences" v-if="item.order!=''">
                                            <em class="order">{{item.order}}:</em>
                                            <div class="text" v-if="item.trans==='Y'">
                                                <ul class="course-content-blank" ref="blank"
                                                    @click="setOption($event)">
                                                    <li v-for="(item,index) in answerArr" v-if="item">
                                                        <div class="tb">
                                                            <em :style="{'display':pinyinSwitch ? 'block':'none'}"
                                                                class="py">{{item.pinyin || ''}}</em>
                                                            <em class="cn">{{item.chinese}}</em>
                                                            <em>{{item.english}}</em>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="talk">
                                                <em :style="{'display':pinyinSwitch ? 'block':'none'}"
                                                    class="py">{{item.pinyin || ''}}</em>
                                                <em class="cn">{{item.chinese}}</em>
                                                <em class="en">{{item.english}}</em>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                            <ul class="course-content-word">
                                <li v-for="(item,index) in contentInfo.words" ref="options"
                                    @click="getOption($event,index,item,item.order)" v-if="item">
                                    <div class="tb">
                                        <em :style="{'display':pinyinSwitch ? 'block':'none'}"
                                            class="py">{{item.pinyin || ''}}</em>
                                        <em class="cn">{{item.chinese}}</em>
                                        <em>{{item.english}}</em>
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
                        <div class="course-content-left">
                            <div class="course-content-img">
                                <loadingImage :src="addPrefixHost(contentInfo.images)"/>
                            </div>
                        </div>
                        <div class="course-content-right">
                            <template v-if="contentInfo.sentences&&contentInfo.sentences.length<=1">
                                <div class="course-content-sentence type-1">
                                    <div v-for="item in contentInfo.sentences" class="sentence en">
                                        {{item.english}}
                                    </div>
                                </div>
                                <ul class="course-content-blank" ref="blank" @click="setOption($event)"
                                    v-if="contentInfo.sentences&&contentInfo.sentences.length<=1">
                                    <li v-for="(item,index) in answerArr" v-if="item">
                                        <div class="tb">
                                            <em :style="{'display':pinyinSwitch ? 'block':'none'}"
                                                class="en">{{item.pinyin || ''}}</em>
                                            <em>{{item.chinese}}</em>
                                            <em>{{item.english}}</em>
                                        </div>
                                    </li>
                                </ul>
                            </template>
                            <template v-if="contentInfo.sentences&&contentInfo.sentences.length>1">
                                <div class="course-content-sentence type-2">
                                    <ul class="sentence">
                                        <li v-for="item in contentInfo.sentences" v-if="item.order!=''">
                                            <em class="order">{{item.order}}:</em>
                                            <div class="text" v-if="item.trans==='Y'">
                                                <ul class="course-content-blank" ref="blank"
                                                    @click="setOption($event)">
                                                    <li v-for="(item,index) in answerArr" v-if="item">
                                                        <div class="tb">
                                                            <em :style="{'display':pinyinSwitch ? 'block':'none'}"
                                                                class="en">{{item.pinyin || ''}}</em>
                                                            <em>{{item.chinese}}</em>
                                                            <em>{{item.english}}</em>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="talk">
                                                <em :style="{'display':pinyinSwitch ? 'block':'none'}"
                                                    class="en">{{item.pinyin || ''}}</em>
                                                <em>{{item.chinese}}</em>
                                                <em>{{item.english}}</em>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                            <ul class="course-content-word">
                                <li v-for="(item,index) in contentInfo.words" ref="options"
                                    @click="getOption($event,index,item,item.order)" v-if="item">
                                    <div class="tb">
                                        <em :style="{'display':pinyinSwitch ? 'block':'none'}"
                                            class="en">{{item.pinyin}}</em>
                                        <em>{{item.chinese}}</em>
                                        <em>{{item.english}}</em>
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
                        <div class="course-content-left">
                            <div class="course-content-img">
                                <loadingImage :src="addPrefixHost(contentInfo.images)"/>
                            </div>
                        </div>
                        <div class="course-content-right">
                            <ul class="course-content-sentence">
                                <li v-for="item in contentInfo.sentences">{{item.english || item.chinese}}</li>
                            </ul>
                            <ul class="course-content-blank">
                            </ul>
                            <ul class="course-content-word">
                                <li v-for="item in contentInfo.words">
                                    <div>
                                        <em>{{item.pinyin}}</em>
                                        <em>{{item.chinese}}</em>
                                        <em>{{item.english}}</em>
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
                            <div class="course-content-img">
                                <loadingImage :src="addPrefixHost(contentInfo.images)"/>
                            </div>
                        </div>
                        <div class="course-content-right">
                            <div class="course-content-sentence">
                                {{contentInfo.sentences && contentInfo.sentences.english}}
                            </div>
                            <ul class="course-content-blank" @click="setOption($event)">
                                <li v-for="(item,index) in answerArr" v-if="item">
                                    <div class="tb">
                                        <!--<span :style="{'display':pinyinSwitch ? 'block':'none'}"-->
                                        <!--class="py">{{item.pinyin || ''}}</span>-->
                                        <span class="cn">{{item.chinese || item.english}}</span>
                                        <!--<span class="py">{{ item.english}}</span>-->
                                    </div>
                                </li>
                            </ul>
                            <ul class="course-content-word">
                                <li v-for="(item,index) in contentInfo.words" ref="options"
                                    @click="getOption($event,index,item,item.order)" v-if="item">
                                    <div class="tb">
                                        <span :style="{'display':pinyinSwitch ? 'block':'none'}"
                                              class="py">{{item.pinyin}}</span>
                                        <span class="cn">{{item.chinese}}</span>
                                        <span class="py">{{ item.english}}</span>
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
                correctArr: [],
                isUpdate: false,
                errorMessage: ""
            }

        },
        methods: {
            playAudio(ev) {
                this.$emit("playAudio", this.addPrefixHost(this.contentInfo.audio), ev);
            },
            setOption(e) {
                this.contentInfo.words.push(this.answerArr[this.answerArr.length - 1]);
                this.answerArr.pop();
                this.correctArr.pop();
                this.Answer();
            },
            getOption(e, index, item, order) {
                this.answerArr.push(this.contentInfo.words[index]);
                this.correctArr.push(order);
                this.contentInfo.words.splice(index, 1);
                this.Answer();
            },
            Answer() {
                let answer = false;
                if (this.contentInfo.answerOrder) {
                    for (let i = 0; i < this.contentInfo.answerOrder.length; i++) {
                        if (this.correctArr.toString() === this.contentInfo.answerOrder[i]) {
                            answer = true;
                        }
                    }
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
                    let txt = "";
                    const orderArr = this.contentInfo.answerOrder && this.contentInfo.answerOrder[0].split(",");
                    if (orderArr) {
                        for (let j = 0; j < orderArr.length; j++) {
                            if (this.contentInfo.words) {
                                for (let k = 0; k < this.contentInfo.words.length; k++) {
                                    if (this.contentInfo.words[k].order === orderArr[j]) {
                                        this.errorMessage = (txt += (this.contentInfo.words[k].chinese || this.contentInfo.words[k].english))
                                    }
                                }
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
                    answerArr: [],
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
            contentInfo() {
                return this.courseExtendInfo || this.extendData || this.contentData;
            },
            ...mapState('index/course/index', {
                courseExtendInfo: state => state.courseExtendInfo,
                contentData: state => state.contentInfo.content,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {},
                pinyinSwitch: state => state.pinyinSwitch,
                data: state => state.contentInfo,
            }),
        },
        components: {
            loadingImage
        }
    }
</script>
<style lang="less">
    .l2-translate-blank {
        border-bottom: 0.02rem solid black;
        display: inline-block;
        min-height: 0.55rem;
        width: 85%;
        vertical-align: sub;

        li {
            min-width: 110px;
            min-height: 40px;
            float: left;
            padding: 0 .02rem;
            border-radius: 10px;
            margin: 5px;
            cursor: pointer;
            box-shadow: 1px 2px 6px black;
            background: linear-gradient(#C7C7C7, #ffffff);
            display: table;

            .en {
                font-size: 14px;
            }

            .cn {
                font-size: 16px;
            }

        }

    }
</style>
<style lang="less" scoped>
    .style-1 {

        .course_common_box {
            text-align: center;

            .course-content {
                display: inline-block;
                position: relative;
            }
            .py {
                font-size: 15px;
            }
            .course-content-left {
                display: inline-block;
                vertical-align: middle;
                margin-right: 40px;

                .course-content-img {
                    background: white;
                    border: 3px solid black;

                    img {
                        max-width: 2.5rem;
                        max-height: 2.5rem;
                        display: block;
                    }

                }

            }
            .course-content-right {
                display: inline-block;
                vertical-align: middle;
                margin-left: 40px;
                width: 5.15rem;

                .type-1 {
                    display: inline-block;
                    padding: 5px;
                    border-radius: 5px;
                    background: #002D32;
                    font-size: 24px;
                    color: white;
                    text-align: left;

                    .sentence {
                        background: #084E62;
                        padding: 5px;
                        border: 2px dashed white;
                        box-sizing: border-box;
                        border-radius: 5px;
                    }

                }
                .type-2 {

                    .sentence {
                        text-align: left;
                        font-size: 22px;

                        li {
                            margin: 2px;
                        }

                        .order {
                            display: inline-block;
                            font-weight: 800;
                        }

                        .talk {
                            display: inline-block;

                            em {
                                display: block;
                            }

                        }
                        .text {
                            display: inline-block;
                            width: 4.9rem;

                            em {
                                display: block;
                            }

                        }
                    }

                }
                .course-content-blank {
                    min-height: 0.8rem;
                    border-bottom: 0.02rem dashed #084E62;
                    overflow: auto;
                    text-align: center;
                    cursor: pointer;
                    padding: 4px 4px 2px 4px;

                    li {
                        float: left;
                        padding: 5px;
                        border-radius: 5px;
                        background: #084E62;
                        color: white;
                        margin: 5px;
                        cursor: pointer;
                        box-shadow: 0 0 0 4px #002D32;
                        border: 2px dashed white;
                        min-height: 55px;
                        min-width: 65px;
                        font-size: 22px;
                        display: table;

                        span {
                            display: block;
                        }

                    }
                }

                .course-content-word {
                    display: block;
                    margin-top: 20px;
                    min-height: 80px;
                    overflow: auto;

                    .active {
                        background: #619ABE;

                        div {
                            background: dodgerblue;
                        }

                    }
                    li {
                        float: left;
                        padding: 5px;
                        border-radius: 5px;
                        background: #084E62;
                        color: white;
                        margin: 5px;
                        cursor: pointer;
                        box-shadow: 0 0 0 4px #002D32;
                        border: 2px dashed white;
                        min-height: 55px;
                        min-width: 65px;
                        font-size: 22px;
                        display: table;

                        span {
                            display: block;
                        }

                    }
                }
                .parts-audio {
                    display: block;
                    cursor: pointer;
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                    position: absolute;
                    top: 40%;
                    right: 5.25rem;
                    background: url("~~assets/img/main_content/course/lv1-audio.png") center no-repeat;
                    background-size: cover;
                }

                .play-active {
                    background: url("~~assets/img/main_content/course/lv1-audio-active.png") center no-repeat;
                    background-size: cover;
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
                position: relative;
            }

            .course-content-left {
                display: inline-block;
                vertical-align: middle;
                margin-right: 30px;

                .course-content-img {
                    width: 250px;
                    height: 240px;
                    border-radius: 10px;
                    overflow: hidden;
                    background: url("~~assets/img/main_content/course/l2-word-frame.png") center no-repeat;
                    background-size: 100% 100%;

                    img {
                        width: 90%;
                        height: 89%;
                        margin: 10px 3px 0 0px;
                        border-radius: 5px;
                    }

                }

            }
            .course-content-right {
                display: inline-block;
                vertical-align: middle;
                margin-left: 30px;
                width: 5.15rem;

                .course-content-sentence {
                    font-size: 0.22rem;
                    text-align: left;

                }

                .course-content-blank {
                    background: url("~~assets/img/main_content/course/l2-sentence-line.png") center 100% no-repeat;
                    background-size: 100%;
                    margin-top: 50px;
                    overflow: auto;
                    min-height: 0.55rem;
                    padding: 0 0 10px 15px;
                    li {
                        min-width: 110px;
                        min-height: 0.46rem;
                        float: left;
                        padding: 0 .02rem;
                        border-radius: 5px;
                        margin: 3px;
                        cursor: pointer;
                        box-shadow: 1px 2px 6px black;
                        background: linear-gradient(#C7C7C7, #ffffff);
                        display: table;
                        font-size: 22px;
                        em {
                            display: block;
                        }
                        .en {
                            font-size: 16px;
                        }

                    }

                }
                .course-content-word {
                    display: block;
                    margin-top: 30px;
                    min-height: 105px;

                    li {
                        min-width: 110px;
                        min-height: 46px;
                        float: left;
                        padding: 0 .02rem;
                        border-radius: 5px;
                        margin: 2px;
                        cursor: pointer;
                        box-shadow: 1px 2px 6px black;
                        background: linear-gradient(#C7C7C7, #ffffff);
                        display: table;
                        font-size: 22px;

                        em {
                            display: block;
                        }

                        .en {
                            font-size: 16px;
                        }

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
                margin-top: 3%;
                position: relative;
            }

            .course-content-left {
                display: inline-block;
                vertical-align: middle;
                margin-right: 40px;

                .course-content-img {
                    width: 2.8rem;
                    height: 2.9rem;
                    overflow: hidden;
                    background: url("~~assets/img/main_content/course/l3-picture-frame.png") center center no-repeat;
                    background-size: 100% 100%;

                    img {
                        width: 2.35rem;
                        height: 2.35rem;
                        margin: 27px 0 0 7px;
                    }

                }

            }
            .course-content-right {
                width: 5.15rem;
                display: inline-block;
                vertical-align: middle;
                margin-left: 40px;

                .course-content-sentence {
                    font-size: 0.2rem;
                    text-align: left;

                }

                .course-content-blank {
                    padding-bottom: 0.02rem;
                    background: url("~~assets/img/main_content/course/l3-sentence-line.png") center 100% no-repeat;
                    background-size: 100%;
                    margin-top: 90px;
                    overflow: auto;
                    min-height: 0.7rem;

                    li {
                        float: left;
                        min-width: 1.4rem;
                        padding: 0.03rem;
                        box-sizing: border-box;
                        background: #BE2C23;
                        font-size: 16px;
                        color: white;
                        background: linear-gradient(#B43C0B 0, #901D1C 90%);
                        margin: 5px;
                        cursor: pointer;
                        display: grid;

                        div {
                            border: 0.01rem solid #FB984B;
                            -webkit-box-sizing: border-box;
                            box-sizing: border-box;
                            /* padding: .08rem .02rem; */
                            min-height: .44rem;
                            /* line-height: .44rem; */
                            display: grid;
                        }

                    }

                }

                .course-content-word {
                    display: block;
                    margin-top: 25px;
                    text-align: center;
                    overflow: auto;

                    li {
                        float: left;
                        min-width: 1.4rem;
                        padding: 0.03rem;
                        box-sizing: border-box;
                        background: #BE2C23;
                        font-size: 16px;
                        color: white;
                        background: linear-gradient(#B43C0B 0, #901D1C 90%);
                        margin: 5px;
                        cursor: pointer;
                        display: grid;

                        div {
                            border: 0.01rem solid #FB984B;
                            -webkit-box-sizing: border-box;
                            box-sizing: border-box;
                            /* padding: .08rem .02rem; */
                            min-height: .44rem;
                            /* line-height: .44rem; */
                            display: grid;
                        }

                    }
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
            }

            .course-content-left {
                display: inline-block;
                vertical-align: middle;
                margin-right: 30px;

                .course-content-img {
                    width: 300px;
                    height: 200px;
                    border-radius: 10px;
                    border: 3px solid black;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                    }

                }

            }
            .course-content-right {
                width: 5.15rem;
                display: inline-block;
                vertical-align: middle;
                margin-left: 30px;

                .course-content-sentence {
                    font-size: 0.25rem;
                    text-align: left;
                    font-family: Calibri;
                }

                .course-content-blank {
                    padding-bottom: 10px;
                    background: url("~~assets/img/main_content/course/l4-sentence-line.png") center 100% no-repeat;
                    background-size: 100%;
                    margin-top: 50px;
                    overflow: auto;
                    min-height: 0.55rem;
                    padding-left: 15px;
                    li {
                        float: left;
                        min-width: 50px;
                        height: 0.45rem;
                        padding: 0 3px;
                        box-sizing: border-box;
                        color: white;
                        background: linear-gradient(#1D1E33 0, #2F4678 90%);
                        margin: 5px 2px;
                        cursor: pointer;
                        box-shadow: 0px 3px 3px black;
                        border-radius: 5px;
                        display: table;
                        font-family: KaiTi;
                        span {
                            display: block;
                        }
                        .en {
                            font-size: 14px;
                        }

                        .cn {
                            font-size: 0.22rem;
                        }

                    }
                    li:hover {
                        background: linear-gradient(#4A236D 0, #4D24E8 90%);
                    }

                }

                .course-content-word {
                    display: block;
                    margin-top: 0.1rem;
                    text-align: center;
                    min-height: 110px;
                    overflow: hidden;

                    li {
                        float: left;
                        min-width: 1.5rem;
                        height: 0.45rem;
                        padding: 0 3px;
                        box-sizing: border-box;
                        color: white;
                        background: linear-gradient(#1D1E33 0, #2F4678 90%);
                        margin: 5px;
                        cursor: pointer;
                        box-shadow: 0px 3px 3px black;
                        border-radius: 5px;
                        display: table;
                        font-family: KaiTi, Calibri;
                        span {
                            display: block;
                        }
                        .en {
                            font-size: 14px;
                        }

                        .cn {
                            font-size: 0.22rem;
                        }

                    }

                    li:hover {
                        background: linear-gradient(#4A236D 0, #4D24E8 90%);
                    }

                }

            }

        }
    }


</style>
