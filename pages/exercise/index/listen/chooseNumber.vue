<template>
    <div :class="isUpdate&&'fadeIn'">
        <div v-if="templateStyle==='level-1'">
            <div v-if="haveQuestion" class="theme-1">
                <ul class="content">
                    <li class="list" v-for="(item,index) in questions">
                        <div class="solid-cloud" :class="optionState(randomOrder[index])"
                             @click="chooseHandler(randomOrder[index])">{{randomOrder[index]}}
                        </div>
                        <div class="hollow-cloud" @click="answerHandler(index)">{{chooseArr[index]}}</div>
                        <div class="sentence">
                            <ul class="sentence-list">
                                <li class="pinyin">{{item.pinyin}}</li>
                                <li class="chinese">{{item.chinese}}</li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="theme-2" v-else>
                <ul class="content">
                    <li v-for="(item,index) in questions" class="list-item">
                        <figure>
                            <figcaption>
                                <loadingImage :src="addPrefixHost(item.image)" alt=""
                                              class="question-img"></loadingImage>
                            </figcaption>
                            <figcaption>
                                <div class="hollow-cloud" @click="answerHandler(index)">{{chooseArr[index]}}</div>
                            </figcaption>
                            <figcaption>
                                <div class="solid-cloud" :class="optionState(randomOrder[index])"
                                     @click="chooseHandler(randomOrder[index])">{{randomOrder[index]}}
                                </div>
                            </figcaption>
                        </figure>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else class="coming-soon-container">
            <div class="coming-soon"></div>
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
        async fetch({store, params}) {
            await store.dispatch("index/exercise/index/setContentInfo", params);
        },
        computed: {
            ...mapState('index/exercise/index', {
                contentInfo: state => state.contentInfo,
                templateStyle: state => state.templateStyle,
                content: state => state.contentInfo ? state.contentInfo.content : {}
            }),
        },
        created() {
        },
        methods: {
            ...mapActions('index/exercise/index', [
                'setAudioInfo',
                'setAnswer'
            ]),
        },
        watch: {
            content() {
//                当数据发生变化后执行动画效果
                this.isUpdate = true;
                const initData = {
                    activeIndex: "",
                    chooseAnswerOrder: "",
                    chooseArr: [],
                    removeArr: [],
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
        activeIndex = "";
        chooseAnswerOrder = "";
        chooseArr = [];
        removeArr = [];
        isUpdate = false;

        chooseHandler(order) {
            this.chooseAnswerOrder = order;
            this.activeIndex = order;
        }

        get questions() {
            return this.content.answers && R.sort(_ => Math.random() - .5)(this.content.answers);
        }

        mounted() {
            this.init();
        }

        get randomOrder() {
//            const random = _ => {
//                return Math.random() - .5
//            };
            return R.map(R.prop('order'))(this.content.answers);
        }

        get haveQuestion() {
            return this.content.answers && R.all(item => item.chinese || item.english)(this.content.answers);
        }

        init() {
            this.$nextTick(_ => {
                if (this.content.answers) {
                    const orderArr = R.map(R.prop("order"))(this.questions);
                    this.setAnswer({
                        answer: false,
                        msg: `${R.join("、")(orderArr)}`
                    });
                }
            })
        }

        answerHandler(index) {
            if (this.activeIndex) {
                this.chooseArr[index] = this.chooseAnswerOrder;
//            删除选中内容
                this.removeArr[index] = this.chooseAnswerOrder;
                this.activeIndex = "";
            } else if (this.chooseArr[index]) {
                this.chooseAnswerOrder = "";
                this.chooseArr = R.adjust(R.always(""), index, this.chooseArr);
                this.removeArr = R.adjust(R.always(""), index, this.removeArr);
            }
            const orderArr = R.map(R.prop("order"))(this.questions);
            const answer = R.equals(this.chooseArr)(orderArr);
            this.setAnswer({
                answer,
                msg: `${R.join("、")(orderArr)}`
            });
        }

        optionState(order) {
            let className = '';
            if (R.any(R.equals(order))(this.removeArr)) {
                className += ' remove';
            }
            if (this.activeIndex === order) {
                className += ' active';
            }
            return className;
        }

    }
</script>
<style lang="less" scoped>
    .coming-soon {
        width: 600px;
        height: 236px;
        margin: 100px auto auto auto;
        background: url(~~assets/img/exercise/coming.png) no-repeat;
        background-size: 100% 100%;
    }

    .theme-1 {
        text-align: center;
        .content {
            margin-top: 30px;
            display: inline-block;
        }
        .list {
            margin-top: 15px;
        }
        .list:nth-child(1) .hollow-cloud {
            margin-left: 80px
        }
        .list:nth-child(2) .hollow-cloud {
            margin-left: 160px
        }
        .solid-cloud {
            display: inline-block;
            width: 110px;
            height: 110px;
            text-align: center;
            background: url(~~assets/img/main_content/exercise/cloud.png) no-repeat;
            background-size: 100% 100%;
            background-position: center 5px;
            line-height: 110px;
            font-size: 40px;
            vertical-align: middle;
            cursor: pointer;
            font-family: GothamRounded-Medium;
            color: #042bfb;
            &.active {
                background-image: url("~~assets/img/main_content/exercise/audio_speaking_active.png");
                background-size: 130% 120%;
                background-position: center;
            }
            &.remove {
                visibility: hidden;
            }
        }
        .hollow-cloud {
            display: inline-block;
            width: 110px;
            height: 95px;
            margin-right: 40px;
            text-align: center;
            background: url(~~assets/img/exercise/hollow.png) no-repeat;
            background-size: 100% 100% !important;
            line-height: 95px;
            vertical-align: middle;
            font-size: 40px;
            cursor: pointer;
        }
        .sentence {
            display: inline-block;
            background: url(~~assets/img/main_content/exercise/answer_title_bg.png) no-repeat;
            background-size: 100% 100%;
            min-width: 5rem;
            vertical-align: middle;
            min-height: 1.2rem;
            position: relative;
            .sentence-list {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                margin: 0 60px;
                transform: translate(-50%, -50%);
                text-align: left;
                font-family: GothamRounded-Medium;
                font-size: 22px;
                .pinyin {
                    color: #9e7fda;
                }
                .chinese {
                    font-family: GothamRounded-Medium;
                    color: #042bfb;
                }
            }
        }
    }

    .theme-2 {
        text-align: center;
        .content {
            margin-top: 30px;
            display: inline-block;
        }
        .question-img {
            max-width: 220px;
            max-height: 220px;
            margin: 20px 0;
        }
        .list-item {
            display: inline-block;
            margin: 0 30px;
        }
        .solid-cloud {
            display: inline-block;
            width: 110px;
            height: 110px;
            text-align: center;
            background: url(~~assets/img/main_content/exercise/cloud.png) no-repeat;
            background-size: 100% 100%;
            background-position: left -.04rem bottom -.02rem;
            line-height: 110px;
            font-size: 40px;
            vertical-align: middle;
            cursor: pointer;
            font-family: GothamRounded-Medium;
            color: #042bfb;
            &.active {
                background-image: url("~~assets/img/main_content/exercise/audio_speaking_active.png");
                background-size: 130% 120%;
                background-position: center;
            }
            &.remove {
                visibility: hidden;
            }
        }
        .hollow-cloud {
            display: inline-block;
            width: 110px;
            height: 95px;
            text-align: center;
            background: url(~~assets/img/exercise/hollow.png) no-repeat;
            background-size: 100% 100% !important;
            line-height: 95px;
            vertical-align: middle;
            font-size: 40px;
            cursor: pointer;
        }
    }

</style>